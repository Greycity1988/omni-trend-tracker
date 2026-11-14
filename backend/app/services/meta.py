import math
import datetime
from typing import Dict, Any, List, Optional
from ..config import META_ACCESS_TOKEN
from .common import EXAMPLE_METRIC_LABEL, EXAMPLE_METRIC_VALUE, example_rng

GRAPH_API = "https://graph.facebook.com/v21.0"


def lookup_hashtag_media(keyword: str) -> Optional[List[Dict[str, Any]]]:
    """
    Recent public posts for the keyword's hashtag via Meta Graph API v21.0, or None.
    - Uses META_ACCESS_TOKEN
    - Discovers the connected Instagram Business/Creator Account ID
    - Queries ig_hashtag_search and the hashtag's recent media

    fetch_meta_trend does not call this yet: nothing it returns is shown on screen, and
    each new hashtag counts against Instagram's 30-hashtags-per-week limit. Connect it
    when a real metric (for example reactions on recent posts) replaces the example index.
    """
    if not META_ACCESS_TOKEN:
        return None
    clean_tag = keyword.replace(" ", "").replace("#", "")
    try:
        import requests
        # The token travels in the Authorization header, never in the URL,
        # so it cannot end up in logs, proxies or exception messages.
        headers = {"Authorization": f"Bearer {META_ACCESS_TOKEN}"}
        # 1. Verify the token works
        r_me = requests.get(f"{GRAPH_API}/me", headers=headers, params={"fields": "id"}, timeout=4)
        if r_me.status_code != 200:
            return None

        # 2. Discover linked Instagram Business Account IDs
        r_pages = requests.get(
            f"{GRAPH_API}/me/accounts",
            headers=headers,
            params={"fields": "id,instagram_business_account"},
            timeout=4
        )
        if r_pages.status_code != 200:
            return None
        ig_user_id = None
        for p in r_pages.json().get("data", []):
            ig_acc = p.get("instagram_business_account")
            if ig_acc and "id" in ig_acc:
                ig_user_id = ig_acc["id"]
                break
        if not ig_user_id:
            return None

        # 3. Find the hashtag
        r_tag = requests.get(
            f"{GRAPH_API}/ig_hashtag_search",
            headers=headers,
            params={"user_id": ig_user_id, "q": clean_tag},
            timeout=4
        )
        tags = r_tag.json().get("data", []) if r_tag.status_code == 200 else []
        if not tags:
            return None
        tag_id = str(tags[0]["id"])
        # IDs returned by the API are numeric; anything else must not reach the URL path
        if not tag_id.isdigit():
            return None

        # 4. Query recent media
        r_media = requests.get(
            f"{GRAPH_API}/{tag_id}/recent_media",
            headers=headers,
            params={
                "user_id": ig_user_id,
                "fields": "id,like_count,comments_count",
                "limit": 10,
            },
            timeout=4
        )
        return r_media.json().get("data", []) if r_media.status_code == 200 else None
    except Exception as e:
        # Exception text can carry request details, so only the type is logged
        print(f"[Meta Graph API error] {type(e).__name__}")
        return None


def fetch_meta_trend(keyword: str) -> Dict[str, Any]:
    """Example data only, and no network call (see lookup_hashtag_media)."""
    clean_tag = keyword.replace(" ", "").replace("#", "")

    today = datetime.date.today()
    timeline = []
    rng = example_rng(keyword, "meta")
    base_val = 45 + rng.randrange(42)
    for i in range(12, -1, -1):
        dt = today - datetime.timedelta(days=i * 30)
        variation = math.sin((12 - i) * 0.48) * 16 + rng.uniform(-5, 5)
        val = max(8, min(100, round(base_val + variation, 1)))
        timeline.append({"date": dt.strftime("%Y-%m-%d"), "value": val})

    latest_val = timeline[-1]["value"]
    prev_val = timeline[-2]["value"]
    weekly_change = round(((latest_val - prev_val) / max(prev_val, 1)) * 100, 1)

    return {
        "platform": "meta",
        "display_name": "메타 인스타그램 (Meta / Instagram)",
        "icon": "📸",
        "relative_index": latest_val,
        "weekly_change_pct": weekly_change,
        "status": "rising" if weekly_change > 0 else "cooling",
        "primary_metric_label": "인스타그램 관심도 지수",
        "primary_metric_value": f"{int(latest_val)}/100",
        "secondary_metric_label": EXAMPLE_METRIC_LABEL,
        "secondary_metric_value": EXAMPLE_METRIC_VALUE,
        "top_related_keywords": [
            f"#{clean_tag}",
            f"#{clean_tag}그램",
            f"#{clean_tag}추천",
            f"#{clean_tag}일상",
            f"#{clean_tag}쇼핑"
        ],
        "related_keywords_live": False,
        "timeline": timeline,
        "is_live": False
    }
