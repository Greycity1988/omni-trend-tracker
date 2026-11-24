import json
import math
import datetime
import urllib.request
from typing import Dict, Any, List, Optional
from ..config import NAVER_CLIENT_ID, NAVER_CLIENT_SECRET
from .common import EXAMPLE_METRIC_LABEL, EXAMPLE_METRIC_VALUE, example_rng
from .periods import PeriodError, Window, bucket, change_pct, pct, period_key, period_starts, whole_periods, window

DISPLAY_NAME = "네이버 데이터랩 (Naver DataLab)"


def _suggested_keywords(keyword: str) -> List[str]:
    return [f"{keyword} 브랜드", f"{keyword} 추천 순위", f"{keyword} 가격 비교", f"{keyword} 후기"]


def _request_datalab(url: str, headers: Dict[str, str], body: bytes) -> Optional[List[Dict[str, Any]]]:
    req = urllib.request.Request(url, data=body, headers={**headers, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=7) as response:
        if response.getcode() != 200:
            return None
        results = json.loads(response.read().decode("utf-8")).get("results", [])
        return results[0].get("data") if results else None


def _request_datalab_full(url: str, headers: Dict[str, str], body: bytes) -> Optional[List[Dict[str, Any]]]:
    req = urllib.request.Request(url, data=body, headers={**headers, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=10) as response:
        if response.getcode() != 200:
            return None
        return json.loads(response.read().decode("utf-8")).get("results", [])


LAST_PERIOD = {"day": "어제", "week": "지난주", "month": "지난달"}
LAST_IN_RANGE = {"day": "마지막 날", "week": "마지막 주", "month": "마지막 달"}


def _result(keyword: str, w: Window, timeline: List[Dict[str, Any]], live: bool) -> Dict[str, Any]:
    latest = timeline[-1]["value"] if timeline else 0.0
    change = change_pct([p["value"] for p in timeline])
    return {
        "platform": "naver",
        "display_name": DISPLAY_NAME,
        "icon": "🟩",
        "relative_index": latest,
        "change_pct": change,
        "range_change_pct": pct(timeline[0]["value"], latest) if len(timeline) >= 2 else 0.0,
        "status": "rising" if change > 0 else "cooling",
        "primary_metric_label": f"네이버 검색 지수 ({LAST_IN_RANGE[w.unit] if w.custom else LAST_PERIOD[w.unit]})",
        "primary_metric_value": f"{int(latest)}/100",
        "secondary_metric_label": w.change_label if live else EXAMPLE_METRIC_LABEL,
        "secondary_metric_value": f"{change:+}%" if live else EXAMPLE_METRIC_VALUE,
        "top_related_keywords": _suggested_keywords(keyword),
        "related_keywords_live": False,
        "timeline": timeline,
        "is_live": live,
    }


def fetch_naver_trend(keyword: str, unit="month") -> Dict[str, Any]:
    """unit: "day" | "week" | "month" for the preset window, or a Window (preset or chosen range)."""
    w = unit if isinstance(unit, Window) else window(unit)
    unit = w.unit
    if NAVER_CLIENT_ID and NAVER_CLIENT_SECRET:
        body = {
            "startDate": w.start.isoformat(),
            "endDate": w.end.isoformat(),
            "timeUnit": w.naver_time_unit,
            "keywordGroups": [
                {"groupName": keyword, "keywords": [keyword]}
            ]
        }
        encoded_body = json.dumps(body).encode("utf-8")

        def live(points):
            return _result(keyword, w, bucket([{"date": p["period"], "value": float(p["ratio"])} for p in points], w), True)

        # Naver DataLab search trend API (keys from developers.naver.com). Keys go to this host only.
        try:
            data_points = _request_datalab(
                "https://openapi.naver.com/v1/datalab/search",
                {
                    "X-Naver-Client-Id": NAVER_CLIENT_ID.strip(),
                    "X-Naver-Client-Secret": NAVER_CLIENT_SECRET.strip(),
                },
                encoded_body,
            )
            if data_points:
                return live(data_points)
        except Exception as e:
            print(f"[Naver DataLab error] {type(e).__name__} {getattr(e, 'code', '')}")

    # Example data: one point per period, stable for the same keyword
    rng = example_rng(keyword, f"naver_{unit}_{w.start}_{w.end}")
    base_val = 50 + rng.randrange(40)
    starts = period_starts(w)
    timeline = []
    for i, d in enumerate(starts):
        variation = math.cos(i * 5.4 / max(len(starts), 1)) * 18 + rng.uniform(-3, 5)
        timeline.append({"date": period_key(unit, d.isoformat()), "value": max(10, min(100, round(base_val + variation, 1)))})
    return _result(keyword, w, timeline, False)


def search_naver_datalab_custom(
    start_date: str,
    end_date: str,
    time_unit: str,
    keyword_groups: List[Dict[str, Any]],
    device: Optional[str] = None,
    gender: Optional[str] = None,
    ages: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """
    Direct multi-topic search query identical to Naver DataLab (https://datalab.naver.com).
    Supports up to 5 keyword groups, custom date range, time unit, device, gender, and age brackets.
    """
    valid_groups = [
        {
            "groupName": g.get("group_name", "").strip(),
            "keywords": [k.strip() for k in g.get("keywords", []) if k.strip()]
        }
        for g in keyword_groups
        if g.get("group_name", "").strip() and g.get("keywords")
    ]
    if not valid_groups:
        raise ValueError("최소 1개 이상의 주제어와 검색어를 입력해주세요.")

    time_unit = time_unit if time_unit in ("date", "week", "month") else "month"
    unit = {"date": "day", "week": "week", "month": "month"}[time_unit]
    try:
        first, last = whole_periods(unit, datetime.date.fromisoformat(start_date), datetime.date.fromisoformat(end_date))
    except PeriodError:
        raise
    except ValueError:
        raise ValueError("날짜는 YYYY-MM-DD 형식으로 입력해주세요.")
    # The week or month still in progress is left out: a half-counted last period always looks like a drop.
    start_date, end_date = first.isoformat(), last.isoformat()
    w = Window(unit, first, last, f"{start_date} ~ {end_date}", custom=True)

    body_dict: Dict[str, Any] = {
        "startDate": start_date,
        "endDate": end_date,
        "timeUnit": time_unit,
        "keywordGroups": valid_groups[:5]
    }
    if device in ("pc", "mo"):
        body_dict["device"] = device
    if gender in ("m", "f"):
        body_dict["gender"] = gender
    if ages:
        clean_ages = [str(a).strip() for a in ages if str(a).strip()]
        if clean_ages:
            body_dict["ages"] = clean_ages

    encoded_body = json.dumps(body_dict).encode("utf-8")
    raw_results = None

    if NAVER_CLIENT_ID and NAVER_CLIENT_SECRET:
        try:
            raw_results = _request_datalab_full(
                "https://openapi.naver.com/v1/datalab/search",
                {
                    "X-Naver-Client-Id": NAVER_CLIENT_ID.strip(),
                    "X-Naver-Client-Secret": NAVER_CLIENT_SECRET.strip(),
                },
                encoded_body,
            )
        except Exception as e:
            # Type and status only: the exception text can carry the request URL.
            print(f"[DataLab studio error] {type(e).__name__} {getattr(e, 'code', '')}")

    is_live = raw_results is not None

    # Fallback simulation if no API keys or call failed
    if raw_results is None:
        raw_results = []
        # One point per period, keyed the way DataLab keys them (first day of each period)
        periods = [d.isoformat() for d in period_starts(w)][-400:]

        for idx, g in enumerate(valid_groups):
            rng = example_rng(g["groupName"], f"datalab_{idx}")
            base_score = 30 + rng.randrange(50)
            data_pts = []
            for p_idx, p in enumerate(periods):
                val = max(5.0, min(100.0, round(base_score + math.sin(p_idx * 0.4 + idx) * 25 + rng.uniform(-4, 4), 1)))
                data_pts.append({"period": p, "ratio": val})
            raw_results.append({
                "title": g["groupName"],
                "keywords": g["keywords"],
                "data": data_pts
            })

    # Process and build parsed results
    results_list = []
    for g in raw_results:
        title = g.get("title", "")
        keywords = g.get("keywords", [])
        pts = [
            {"period": p["period"], "ratio": round(float(p["ratio"]), 2)}
            for p in g.get("data", [])
        ]
        peak_pt = max(pts, key=lambda x: x["ratio"]) if pts else None
        latest_ratio = pts[-1]["ratio"] if pts else 0.0
        prev_ratio = pts[-2]["ratio"] if len(pts) >= 2 else latest_ratio
        change_pct = round(((latest_ratio - prev_ratio) / max(prev_ratio, 0.01)) * 100, 1) if prev_ratio > 0 else 0.0

        results_list.append({
            "title": title,
            "keywords": keywords,
            "data": pts,
            "peak_period": peak_pt["period"] if peak_pt else None,
            "peak_ratio": peak_pt["ratio"] if peak_pt else None,
            "latest_ratio": latest_ratio,
            "change_pct": change_pct
        })

    return {
        "start_date": start_date,
        "end_date": end_date,
        "time_unit": time_unit,
        "results": results_list,
        "is_live": is_live
    }
