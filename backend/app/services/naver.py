import json
import math
import datetime
import urllib.request
from typing import Dict, Any, List, Optional
from ..config import NAVER_CLIENT_ID, NAVER_CLIENT_SECRET
from .common import EXAMPLE_METRIC_LABEL, EXAMPLE_METRIC_VALUE, example_rng

DISPLAY_NAME = "네이버 데이터랩 (Naver DataLab)"


def _suggested_keywords(keyword: str) -> List[str]:
    # DataLab has no related-query endpoint; these are search combinations to try, not measurements.
    return [f"{keyword} 브랜드", f"{keyword} 추천 순위", f"{keyword} 가격 비교", f"{keyword} 후기"]


def _request_datalab(url: str, headers: Dict[str, str], body: bytes) -> Optional[List[Dict[str, Any]]]:
    req = urllib.request.Request(url, data=body, headers={**headers, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=7) as response:
        if response.getcode() != 200:
            return None
        results = json.loads(response.read().decode("utf-8")).get("results", [])
        return results[0].get("data") if results else None


def _live_result(keyword: str, data_points: List[Dict[str, Any]]) -> Dict[str, Any]:
    timeline = [{"date": p["period"], "value": round(float(p["ratio"]), 1)} for p in data_points]
    latest_score = timeline[-1]["value"]
    prev_score = timeline[-2]["value"] if len(timeline) >= 2 else latest_score
    change = round(((latest_score - prev_score) / max(prev_score, 1)) * 100, 1)
    return {
        "platform": "naver",
        "display_name": DISPLAY_NAME,
        "icon": "🟩",
        "relative_index": latest_score,
        "weekly_change_pct": change,
        "status": "rising" if change > 0 else "cooling",
        "primary_metric_label": "네이버 검색 지수 (지난달)",
        "primary_metric_value": f"{int(latest_score)}/100",
        "secondary_metric_label": "전월 대비",
        "secondary_metric_value": f"{change:+}%",
        "top_related_keywords": _suggested_keywords(keyword),
        "related_keywords_live": False,
        "timeline": timeline,
        "is_live": True
    }


def fetch_naver_trend(keyword: str) -> Dict[str, Any]:
    if NAVER_CLIENT_ID and NAVER_CLIENT_SECRET:
        # The last 12 complete months. The running month is left out: its total is still
        # growing, so it would always read as a drop against the month before.
        first_of_month = datetime.date.today().replace(day=1)
        start_date = first_of_month.replace(year=first_of_month.year - 1).strftime("%Y-%m-%d")
        end_date = (first_of_month - datetime.timedelta(days=1)).strftime("%Y-%m-%d")

        body = {
            "startDate": start_date,
            "endDate": end_date,
            "timeUnit": "month",
            "keywordGroups": [
                {"groupName": keyword, "keywords": [keyword]}
            ]
        }
        encoded_body = json.dumps(body).encode("utf-8")

        # 1. Try New NAVER API HUB (Naver Cloud Platform - modern standard)
        try:
            data_points = _request_datalab(
                "https://naverapihub.apigw.ntruss.com/search-trend/v1/search",
                {
                    "X-NCP-APIGW-API-KEY-ID": NAVER_CLIENT_ID.strip(),
                    "X-NCP-APIGW-API-KEY": NAVER_CLIENT_SECRET.strip(),
                },
                encoded_body,
            )
            if data_points:
                return _live_result(keyword, data_points)
        except Exception as e:
            print(f"[NAVER API HUB error, trying legacy developers API] {type(e).__name__} {getattr(e, 'code', '')}")

        # 2. Try Legacy Developers Open API
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
                return _live_result(keyword, data_points)
        except Exception as e:
            print(f"[Naver Legacy API error] {type(e).__name__} {getattr(e, 'code', '')}")

    # Example data if both fail or credentials are missing
    today = datetime.date.today()
    timeline = []
    rng = example_rng(keyword, "naver")
    base_val = 50 + rng.randrange(40)
    for i in range(12, -1, -1):
        dt = today - datetime.timedelta(days=i * 30)
        variation = math.cos((12 - i) * 0.45) * 18 + rng.uniform(-3, 5)
        val = max(10, min(100, round(base_val + variation, 1)))
        timeline.append({"date": dt.strftime("%Y-%m-%d"), "value": val})

    latest_val = timeline[-1]["value"]
    prev_val = timeline[-2]["value"]
    weekly_change = round(((latest_val - prev_val) / max(prev_val, 1)) * 100, 1)

    return {
        "platform": "naver",
        "display_name": DISPLAY_NAME,
        "icon": "🟩",
        "relative_index": latest_val,
        "weekly_change_pct": weekly_change,
        "status": "rising" if weekly_change > 0 else "cooling",
        "primary_metric_label": "네이버 검색 지수",
        "primary_metric_value": f"{int(latest_val)}/100",
        "secondary_metric_label": EXAMPLE_METRIC_LABEL,
        "secondary_metric_value": EXAMPLE_METRIC_VALUE,
        "top_related_keywords": _suggested_keywords(keyword),
        "related_keywords_live": False,
        "timeline": timeline,
        "is_live": False
    }
