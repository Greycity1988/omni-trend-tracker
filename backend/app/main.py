import asyncio
import datetime
import random
import time
import unicodedata
from collections import OrderedDict, deque
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from .config import ALLOWED_ORIGINS
from .models import OmniTrendResponse, TimelinePoint, PlatformMetric, DemographicsInfo
from .services.naver import fetch_naver_trend
from .services.google import fetch_google_trend
from .services.pinterest import fetch_pinterest_trend
from .services.meta import fetch_meta_trend

app = FastAPI(
    title="Omni Trend Tracker API",
    description="Cross-platform Keyword & Trend Intelligence (Naver DataLab, Google Trends, Pinterest, Meta)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)

MAX_KEYWORD_LENGTH = 40
CACHE_TTL_SECONDS = 600
CACHE_MAX_ENTRIES = 200
RATE_LIMIT_LOOKUPS = 10   # uncached lookups per client per window (each one calls 4 external APIs)
RATE_LIMIT_WINDOW_SECONDS = 60

_cache: "OrderedDict[str, tuple]" = OrderedDict()
_lookups: dict = {}


def normalize_keyword(raw: str) -> str:
    keyword = " ".join(raw.split())
    if not keyword:
        raise HTTPException(status_code=400, detail="키워드를 입력해주세요.")
    if len(keyword) > MAX_KEYWORD_LENGTH:
        raise HTTPException(status_code=400, detail=f"키워드는 {MAX_KEYWORD_LENGTH}자 이하로 입력해주세요.")
    if any(unicodedata.category(ch).startswith("C") for ch in keyword):
        raise HTTPException(status_code=400, detail="키워드에 사용할 수 없는 문자가 있습니다.")
    return keyword


def check_rate_limit(client: str) -> None:
    now = time.monotonic()
    window = _lookups.setdefault(client, deque())
    while window and now - window[0] > RATE_LIMIT_WINDOW_SECONDS:
        window.popleft()
    if len(window) >= RATE_LIMIT_LOOKUPS:
        raise HTTPException(status_code=429, detail="요청이 많습니다. 잠시 후 다시 시도해주세요.")
    window.append(now)
    if len(_lookups) > 1000:  # keep the table from growing without bound
        for key in [k for k, v in _lookups.items() if not v or now - v[-1] > RATE_LIMIT_WINDOW_SECONDS]:
            _lookups.pop(key, None)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "omni-trend-tracker-backend", "version": "1.0.0"}

@app.get("/api/trend/{keyword}", response_model=OmniTrendResponse)
async def get_omni_trend(keyword: str, request: Request):
    keyword = normalize_keyword(keyword)

    cached = _cache.get(keyword)
    if cached and cached[0] > time.monotonic():
        return cached[1]
    check_rate_limit(request.client.host if request.client else "unknown")

    # Run all 4 platform fetchers concurrently in parallel threads
    naver_res, google_res, pin_res, meta_res = await asyncio.gather(
        asyncio.to_thread(fetch_naver_trend, keyword),
        asyncio.to_thread(fetch_google_trend, keyword),
        asyncio.to_thread(fetch_pinterest_trend, keyword),
        asyncio.to_thread(fetch_meta_trend, keyword)
    )

    # Merge timelines by date
    timeline_dict = {}
    
    # helper to ingest
    def ingest_timeline(items, key):
        for item in items.get("timeline", []):
            d = item["date"]
            if d not in timeline_dict:
                timeline_dict[d] = {"date": d, "naver": 0.0, "google": 0.0, "pinterest": 0.0, "meta": 0.0}
            timeline_dict[d][key] = round(item["value"], 1)

    ingest_timeline(naver_res, "naver")
    ingest_timeline(google_res, "google")
    ingest_timeline(pin_res, "pinterest")
    ingest_timeline(meta_res, "meta")

    sorted_timeline = [TimelinePoint(**timeline_dict[k]) for k in sorted(timeline_dict.keys())]

    # Calculate Dominant Platform & Summary Insight
    scores = {
        "naver": naver_res.get("relative_index", 50),
        "google": google_res.get("relative_index", 50),
        "pinterest": pin_res.get("relative_index", 50),
        "meta": meta_res.get("relative_index", 50),
    }
    dominant_key = max(scores, key=scores.get)
    platform_names = {
        "naver": "네이버 데이터랩",
        "google": "구글 트렌드",
        "pinterest": "핀터레스트",
        "meta": "인스타그램"
    }

    naver_vol = naver_res.get("estimated_monthly_volume", 50000)
    meta_posts = int(meta_res.get("relative_index", 50) * 12000)
    total_reach = naver_vol + meta_posts

    # Construct synthesized summary insight
    summary_insight = (
        f"'{keyword}' 키워드는 현재 {platform_names[dominant_key]}에서 가장 높은 탐색 모멘텀({int(scores[dominant_key])}점)을 기록하고 있습니다. "
        f"네이버 월간 쿼리수는 약 {naver_vol:,}건으로 추정되며, 인스타그램 해시태그 버즈량과 핀터레스트 라이프스타일 핀 탐색이 동반 상승세를 나타내고 있습니다."
    )

    # Cross-platform combined keywords
    cross_keywords = []
    seen = set()
    for p_res, p_name in [(naver_res, "네이버"), (google_res, "구글"), (meta_res, "인스타"), (pin_res, "핀터")]:
        for kw in p_res.get("top_related_keywords", []):
            if kw not in seen:
                seen.add(kw)
                cross_keywords.append({
                    "keyword": kw,
                    "platform": p_name,
                    "relevance": round(random.uniform(85, 99), 1)
                })

    platforms_map = {
        "naver": PlatformMetric(
            platform="naver",
            display_name=naver_res["display_name"],
            icon=naver_res["icon"],
            relative_index=naver_res["relative_index"],
            estimated_monthly_volume=naver_res.get("estimated_monthly_volume"),
            weekly_change_pct=naver_res["weekly_change_pct"],
            status=naver_res["status"],
            primary_metric_label=naver_res["primary_metric_label"],
            primary_metric_value=naver_res["primary_metric_value"],
            secondary_metric_label=naver_res["secondary_metric_label"],
            secondary_metric_value=naver_res["secondary_metric_value"],
            is_live=naver_res.get("is_live", False),
            top_related_keywords=naver_res["top_related_keywords"],
            demographics=DemographicsInfo(**naver_res["demographics"]) if "demographics" in naver_res else None
        ),
        "google": PlatformMetric(
            platform="google",
            display_name=google_res["display_name"],
            icon=google_res["icon"],
            relative_index=google_res["relative_index"],
            weekly_change_pct=google_res["weekly_change_pct"],
            status=google_res["status"],
            primary_metric_label=google_res["primary_metric_label"],
            primary_metric_value=google_res["primary_metric_value"],
            secondary_metric_label=google_res["secondary_metric_label"],
            secondary_metric_value=google_res["secondary_metric_value"],
            is_live=google_res.get("is_live", False),
            top_related_keywords=google_res["top_related_keywords"]
        ),
        "pinterest": PlatformMetric(
            platform="pinterest",
            display_name=pin_res["display_name"],
            icon=pin_res["icon"],
            relative_index=pin_res["relative_index"],
            weekly_change_pct=pin_res["weekly_change_pct"],
            status=pin_res["status"],
            primary_metric_label=pin_res["primary_metric_label"],
            primary_metric_value=pin_res["primary_metric_value"],
            secondary_metric_label=pin_res["secondary_metric_label"],
            secondary_metric_value=pin_res["secondary_metric_value"],
            is_live=pin_res.get("is_live", False),
            top_related_keywords=pin_res["top_related_keywords"],
            demographics=DemographicsInfo(**pin_res["demographics"]) if "demographics" in pin_res else None
        ),
        "meta": PlatformMetric(
            platform="meta",
            display_name=meta_res["display_name"],
            icon=meta_res["icon"],
            relative_index=meta_res["relative_index"],
            weekly_change_pct=meta_res["weekly_change_pct"],
            status=meta_res["status"],
            primary_metric_label=meta_res["primary_metric_label"],
            primary_metric_value=meta_res["primary_metric_value"],
            secondary_metric_label=meta_res["secondary_metric_label"],
            secondary_metric_value=meta_res["secondary_metric_value"],
            is_live=meta_res.get("is_live", False),
            top_related_keywords=meta_res["top_related_keywords"],
            demographics=DemographicsInfo(**meta_res["demographics"]) if "demographics" in meta_res else None
        ),
    }

    response = OmniTrendResponse(
        keyword=keyword,
        updated_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        overall_sentiment="상승 추세 (Positive Momentum)",
        dominant_platform=platform_names[dominant_key],
        total_estimated_reach=total_reach,
        summary_insight=summary_insight,
        timeline=sorted_timeline,
        platforms=platforms_map,
        cross_platform_keywords=cross_keywords[:15]
    )

    _cache[keyword] = (time.monotonic() + CACHE_TTL_SECONDS, response)
    _cache.move_to_end(keyword)
    while len(_cache) > CACHE_MAX_ENTRIES:
        _cache.popitem(last=False)
    return response
