import math
import datetime
from typing import Dict, Any
from .common import EXAMPLE_METRIC_LABEL, EXAMPLE_METRIC_VALUE, example_rng


def fetch_pinterest_trend(keyword: str) -> Dict[str, Any]:
    """
    Example data only, and no network call.

    Access to the Pinterest trends API has not been approved. The endpoint tried before
    (US top-growing keywords) says nothing about the searched keyword, so its results
    must not be shown as this keyword's related terms or growth. This platform is off
    by default (see ENABLED_PLATFORMS) until a per-keyword source is connected.
    """
    today = datetime.date.today()
    timeline = []
    rng = example_rng(keyword, "pinterest")
    base_val = 38 + rng.randrange(45)
    for i in range(12, -1, -1):
        dt = today - datetime.timedelta(days=i * 30)
        surge = math.sin((12 - i + 2) * 0.52) * 22 + rng.uniform(-4, 5)
        val = max(5, min(100, round(base_val + surge, 1)))
        timeline.append({"date": dt.strftime("%Y-%m-%d"), "value": val})

    latest_val = timeline[-1]["value"]
    prev_val = timeline[-2]["value"]
    weekly_change = round(((latest_val - prev_val) / max(prev_val, 1)) * 100, 1)

    return {
        "platform": "pinterest",
        "display_name": "핀터레스트 트렌드 (Pinterest Trends)",
        "icon": "📌",
        "relative_index": latest_val,
        "weekly_change_pct": weekly_change,
        "status": "rising" if weekly_change > 0 else "cooling",
        "primary_metric_label": "핀터레스트 탐색 지수",
        "primary_metric_value": f"{int(latest_val)}/100",
        "secondary_metric_label": EXAMPLE_METRIC_LABEL,
        "secondary_metric_value": EXAMPLE_METRIC_VALUE,
        "top_related_keywords": [
            f"{keyword} 아이디어",
            f"{keyword} 스타일링",
            f"{keyword} 감성 사진",
            f"{keyword} 인테리어/코디",
            f"{keyword} moodboard"
        ],
        "related_keywords_live": False,
        "timeline": timeline,
        "is_live": False
    }
