import math
import datetime
import time
import random
from typing import Dict, Any, List
from .common import EXAMPLE_METRIC_LABEL, EXAMPLE_METRIC_VALUE, example_rng
from .periods import Window, bucket, change_pct, is_google_weekly, pct, period_key, period_starts, window

# urllib3 v2 backward-compatibility patch for pytrends (method_whitelist -> allowed_methods)
try:
    import urllib3.util.retry
    _orig_retry_init = urllib3.util.retry.Retry.__init__
    def _patched_retry_init(self, *args, **kwargs):
        if "method_whitelist" in kwargs:
            kwargs["allowed_methods"] = kwargs.pop("method_whitelist")
        _orig_retry_init(self, *args, **kwargs)
    urllib3.util.retry.Retry.__init__ = _patched_retry_init
except Exception:
    pass


def drop_partial_rows(df):
    """Drop the period Google marks as still in progress (isPartial).

    The latest week or month is usually incomplete, so comparing it with the previous full
    period always looks like a drop. Both the change rate and the chart use full periods only.
    """
    if df is None or df.empty or "isPartial" not in df.columns:
        return df
    partial = df["isPartial"].astype(str).str.lower().isin(["true", "1"])
    return df[~partial]


def _google_result(keyword: str, w: Window, timeline: List[Dict[str, Any]], live: bool,
                   related: List[str]) -> Dict[str, Any]:
    latest = timeline[-1]["value"] if timeline else 0.0
    change = change_pct([p["value"] for p in timeline])
    fallback_related = [f"{keyword} 추천", f"{keyword} 비교", f"{keyword} 인기 순위", f"{keyword} 사용법", f"{keyword} 가격"]
    return {
        "platform": "google",
        "display_name": "구글 트렌드 (Google Trends)",
        "icon": "🌐",
        "relative_index": latest,
        "change_pct": change,
        "range_change_pct": pct(timeline[0]["value"], latest) if len(timeline) >= 2 else 0.0,
        "status": "rising" if change > 0 else "cooling",
        "primary_metric_label": "구글 관심도 지수",
        "primary_metric_value": f"{int(latest)}/100",
        "secondary_metric_label": w.change_label if live else EXAMPLE_METRIC_LABEL,
        "secondary_metric_value": f"{change:+}%" if live else EXAMPLE_METRIC_VALUE,
        "top_related_keywords": related or fallback_related,
        "related_keywords_live": bool(related),
        "timeline": timeline,
        "is_live": live,
    }


def fetch_google_trend(keyword: str, unit="month", geo: str = "KR") -> Dict[str, Any]:
    """unit: "day" | "week" | "month" for the preset window, or a Window (preset or chosen range)."""
    w = unit if isinstance(unit, Window) else window(unit)
    unit = w.unit
    # Try up to 2 attempts with short jittered backoff on rate-limits
    for attempt in range(2):
        try:
            from pytrends.request import TrendReq
            pytrends = TrendReq(hl="ko-KR", tz=540, timeout=(5, 10), retries=1)
            pytrends.build_payload([keyword], timeframe=w.google_timeframe, geo=geo)
            df = drop_partial_rows(pytrends.interest_over_time())

            if not df.empty and keyword in df.columns:
                raw = [
                    {"date": (d.strftime("%Y-%m-%d") if hasattr(d, "strftime") else str(d)[:10]), "value": float(row[keyword])}
                    for d, row in df.iterrows()
                ]
                timeline = bucket(raw, w, google_weeks=is_google_weekly([p["date"] for p in raw]))

                # Related queries (real ones when Google returns them, otherwise combinations to try)
                try:
                    rq = pytrends.related_queries()
                    top_rq = rq.get(keyword, {}).get("top")
                    related = top_rq["query"].tolist()[:5] if top_rq is not None and not top_rq.empty else []
                except Exception:
                    related = []
                if timeline:
                    return _google_result(keyword, w, timeline, True, related)
        except Exception as e:
            if "TooManyRequests" in type(e).__name__ and attempt == 0:
                time.sleep(1.2 + random.uniform(0.3, 0.7))
                continue
            print(f"[Google Trends fallback] {type(e).__name__}")
            break

    # Example data when Google Trends cannot be reached: one point per period
    rng = example_rng(keyword, f"google_{unit}_{w.start}_{w.end}")
    base_val = 40 + rng.randrange(45)
    starts = period_starts(w)
    timeline = []
    for i, d in enumerate(starts):
        variation = math.sin(i * 6.0 / max(len(starts), 1)) * 15 + rng.uniform(-4, 6)
        timeline.append({"date": period_key(unit, d.isoformat()), "value": max(5, min(100, round(base_val + variation, 1)))})
    return _google_result(keyword, w, timeline, False, [])


def search_google_trends_custom(
    keywords: List[str],
    timeframe: str = "today 12-m",
    geo: str = "KR",
    gprop: str = "",
) -> Dict[str, Any]:
    """
    Multi-keyword comparison search via Google Trends (up to 5 keywords).
    Supports timeframe, geo (region), and gprop (web, youtube, shopping, news).
    """
    clean_kws = [k.strip() for k in keywords if k.strip()][:5]
    if not clean_kws:
        raise ValueError("최소 1개 이상의 검색 키워드를 입력해주세요.")

    for attempt in range(2):
        try:
            from pytrends.request import TrendReq
            pt = TrendReq(hl="ko-KR", tz=540, timeout=(6, 12), retries=1)
            pt.build_payload(clean_kws, timeframe=timeframe, geo=geo if geo else "", gprop=gprop if gprop else "")
            df = drop_partial_rows(pt.interest_over_time())

            if not df.empty:
                timeline = []
                summaries = {}

                for kw in clean_kws:
                    summaries[kw] = {
                        "keyword": kw,
                        "peak_period": None,
                        "peak_value": 0.0,
                        "average_value": 0.0,
                        "latest_value": 0.0,
                        "change_pct": 0.0,
                        "related_queries": [],
                    }

                # 1-day and 7-day ranges come back hourly: keep the hour so points stay distinct
                fmt = "%Y-%m-%d %H:%M" if timeframe.startswith("now") else "%Y-%m-%d"
                for date_val, row in df.iterrows():
                    dt_str = date_val.strftime(fmt) if hasattr(date_val, "strftime") else str(date_val)[:16]
                    vals = {}
                    for kw in clean_kws:
                        val = float(row[kw]) if kw in row else 0.0
                        vals[kw] = val
                    timeline.append({"period": dt_str, "values": vals})

                # Compute keyword statistics
                for kw in clean_kws:
                    series = [pt_item["values"].get(kw, 0.0) for pt_item in timeline]
                    if series:
                        max_val = max(series)
                        max_idx = series.index(max_val)
                        peak_period = timeline[max_idx]["period"]
                        avg_val = round(sum(series) / len(series), 1)
                        latest_val = series[-1]
                        change = change_pct(series)

                        summaries[kw]["peak_value"] = max_val
                        summaries[kw]["peak_period"] = peak_period
                        summaries[kw]["average_value"] = avg_val
                        summaries[kw]["latest_value"] = latest_val
                        summaries[kw]["change_pct"] = change

                # Try to fetch related queries
                try:
                    rq = pt.related_queries()
                    for kw in clean_kws:
                        kw_rq = rq.get(kw, {}).get("top")
                        if kw_rq is not None and not kw_rq.empty:
                            summaries[kw]["related_queries"] = kw_rq["query"].tolist()[:5]
                except Exception:
                    pass

                return {
                    "timeframe": timeframe,
                    "geo": geo,
                    "gprop": gprop,
                    "keywords": clean_kws,
                    "timeline": timeline,
                    "summaries": summaries,
                    "is_live": True,
                }
        except Exception as e:
            if "TooManyRequests" in type(e).__name__ and attempt == 0:
                time.sleep(1.5 + random.uniform(0.3, 0.8))
                continue
            print(f"[Google Trends custom search fallback] {type(e).__name__}")
            break

    # Simulated fallback response if rate limited
    today = datetime.date.today()
    timeline = []
    points_count = 12 if "12-m" in timeframe else (30 if "1-m" in timeframe else (7 if "7-d" in timeframe else 24))
    delta_days = 30 if "12-m" in timeframe else (1 if "1-m" in timeframe else 1)

    summaries = {}
    for kw in clean_kws:
        summaries[kw] = {
            "keyword": kw,
            "peak_period": None,
            "peak_value": 0.0,
            "average_value": 0.0,
            "latest_value": 0.0,
            "change_pct": 0.0,
            "related_queries": [f"{kw} 추천", f"{kw} 가격", f"{kw} 비교", f"{kw} 순위"],
        }

    for i in range(points_count - 1, -1, -1):
        dt = today - datetime.timedelta(days=i * delta_days)
        period_str = dt.strftime("%Y-%m-%d")
        vals = {}
        for idx, kw in enumerate(clean_kws):
            rng = example_rng(f"{kw}_{i}", "point")
            val = max(5.0, min(100.0, round(40.0 + (idx * 12) + math.sin(i * 0.4 + idx) * 20 + rng.uniform(-5, 5), 1)))
            vals[kw] = val
        timeline.append({"period": period_str, "values": vals})

    for kw in clean_kws:
        series = [p["values"][kw] for p in timeline]
        max_val = max(series)
        max_idx = series.index(max_val)
        summaries[kw]["peak_value"] = max_val
        summaries[kw]["peak_period"] = timeline[max_idx]["period"]
        summaries[kw]["average_value"] = round(sum(series) / len(series), 1)
        summaries[kw]["latest_value"] = series[-1]
        prev_val = series[-2] if len(series) >= 2 else series[0]
        summaries[kw]["change_pct"] = round(((series[-1] - prev_val) / max(prev_val, 1)) * 100, 1)

    return {
        "timeframe": timeframe,
        "geo": geo,
        "gprop": gprop,
        "keywords": clean_kws,
        "timeline": timeline,
        "summaries": summaries,
        "is_live": False,
    }

