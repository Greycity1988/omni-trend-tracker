import math
import datetime
import time
import random
from typing import Dict, Any, List
from .common import EXAMPLE_METRIC_LABEL, EXAMPLE_METRIC_VALUE, example_rng

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


def fetch_google_trend(keyword: str, timeframe: str = "today 12-m", geo: str = "KR") -> Dict[str, Any]:
    # Try up to 2 attempts with short jittered backoff on rate-limits
    for attempt in range(2):
        try:
            from pytrends.request import TrendReq
            pytrends = TrendReq(hl="ko-KR", tz=540, timeout=(5, 10), retries=1)
            pytrends.build_payload([keyword], timeframe=timeframe, geo=geo)
            df = pytrends.interest_over_time()
            
            timeline = []
            if not df.empty and keyword in df.columns:
                for date_val, row in df.iterrows():
                    dt_str = date_val.strftime("%Y-%m-%d") if hasattr(date_val, "strftime") else str(date_val)[:10]
                    val = float(row[keyword])
                    timeline.append({"date": dt_str, "value": val})
                
                # calculate weekly change
                if len(timeline) >= 2:
                    last_val = timeline[-1]["value"]
                    prev_val = timeline[-2]["value"]
                    change = round(((last_val - prev_val) / max(prev_val, 1)) * 100, 1)
                else:
                    change = 0.0
                
                # Related queries (real ones when Google returns them, otherwise combinations to try)
                try:
                    rq = pytrends.related_queries()
                    top_rq = rq.get(keyword, {}).get("top")
                    related = top_rq["query"].tolist()[:5] if top_rq is not None and not top_rq.empty else []
                except Exception:
                    related = []
                related_live = bool(related)
                
                latest_score = timeline[-1]["value"] if timeline else 50.0
                return {
                    "platform": "google",
                    "display_name": "구글 트렌드 (Google Trends)",
                    "icon": "🌐",
                    "relative_index": latest_score,
                    "weekly_change_pct": change,
                    "status": "rising" if change > 0 else "cooling",
                    "primary_metric_label": "구글 관심도 지수",
                    "primary_metric_value": f"{int(latest_score)}/100",
                    "secondary_metric_label": "직전 주 대비",
                    "secondary_metric_value": f"{change:+}%",
                    "top_related_keywords": related if related else [f"{keyword} 추천", f"{keyword} 가격", f"{keyword} 후기"],
                    "related_keywords_live": related_live,
                    "timeline": timeline,
                    "is_live": True
                }
        except Exception as e:
            if "TooManyRequests" in type(e).__name__ and attempt == 0:
                time.sleep(1.2 + random.uniform(0.3, 0.7))
                continue
            print(f"[Google Trends fallback] {type(e).__name__}: {e}")
            break

    # Example data when Google Trends cannot be reached
    today = datetime.date.today()
    timeline = []
    rng = example_rng(keyword, "google")
    base_val = 40 + rng.randrange(45)
    for i in range(12, -1, -1):
        dt = today - datetime.timedelta(days=i * 30)
        variation = math.sin((12 - i) * 0.5) * 15 + rng.uniform(-4, 6)
        val = max(5, min(100, round(base_val + variation, 1)))
        timeline.append({"date": dt.strftime("%Y-%m-%d"), "value": val})

    weekly_change = round(((timeline[-1]["value"] - timeline[-2]["value"]) / timeline[-2]["value"]) * 100, 1)
    return {
        "platform": "google",
        "display_name": "구글 트렌드 (Google Trends)",
        "icon": "🌐",
        "relative_index": timeline[-1]["value"],
        "weekly_change_pct": weekly_change,
        "status": "rising" if weekly_change > 0 else "cooling",
        "primary_metric_label": "구글 관심도 지수",
        "primary_metric_value": f"{int(timeline[-1]['value'])}/100",
        "secondary_metric_label": EXAMPLE_METRIC_LABEL,
        "secondary_metric_value": EXAMPLE_METRIC_VALUE,
        "top_related_keywords": [f"{keyword} 추천", f"{keyword} 비교", f"{keyword} 인기 순위", f"{keyword} 사용법", f"{keyword} 가격"],
        "related_keywords_live": False,
        "timeline": timeline,
        "is_live": False
    }
