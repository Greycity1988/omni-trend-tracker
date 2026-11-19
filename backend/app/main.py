import asyncio
import datetime
import os
import threading
from contextlib import asynccontextmanager
import time
import unicodedata
from collections import OrderedDict, defaultdict, deque
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from .config import (
    ALLOWED_ORIGINS,
    ENABLED_PLATFORMS,
    NAVER_CLIENT_ID,
    NAVER_CLIENT_SECRET,
    META_ACCESS_TOKEN,
    PINTEREST_ACCESS_TOKEN,
)
from .models import (
    OmniTrendResponse,
    TimelinePoint,
    PlatformMetric,
    DataLabSearchRequest,
    DataLabSearchResponse,
    GoogleTrendsSearchRequest,
    GoogleTrendsSearchResponse,
    MetaPrecisionSearchRequest,
    MetaPrecisionSearchResponse,
)
from .services.naver import fetch_naver_trend, search_naver_datalab_custom
from .services.google import fetch_google_trend, search_google_trends_custom
from .services.pinterest import fetch_pinterest_trend
from .services.meta import fetch_meta_trend, search_meta_precision_custom

@asynccontextmanager
async def lifespan(_app):
    # Renew the Meta token in the background when it is close to expiring (needs META_APP_ID and
    # META_APP_SECRET). Off the startup path so a slow Graph API never delays the server.
    from .services.meta import check_and_auto_renew_token
    threading.Thread(target=check_and_auto_renew_token, daemon=True).start()
    yield


app = FastAPI(
    lifespan=lifespan,
    title="Omni Trend Tracker API",
    description="Cross-platform Keyword & Trend Intelligence (Naver DataLab, Google Trends, Pinterest, Meta)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

MAX_KEYWORD_LENGTH = 40
CACHE_TTL_SECONDS = 600
CACHE_MAX_ENTRIES = 200
RATE_LIMIT_LOOKUPS = 10   # uncached lookups per client per window (each one calls the external platform APIs)
RATE_LIMIT_WINDOW_SECONDS = 60

_cache: "OrderedDict[str, tuple]" = OrderedDict()
_lookups: dict = {}

# Resolved at call time so tests can replace the fetchers
def _fetch_meta(keyword: str):
    try:
        return fetch_meta_trend(keyword, live=bool(META_ACCESS_TOKEN and os.getenv("ENABLE_LIVE_META", "1") == "1"))
    except TypeError:
        return fetch_meta_trend(keyword)

FETCHERS = {
    "naver": lambda keyword: fetch_naver_trend(keyword),
    "google": lambda keyword: fetch_google_trend(keyword),
    "pinterest": lambda keyword: fetch_pinterest_trend(keyword),
    "meta": _fetch_meta,
}
PLATFORM_NAMES = {
    "naver": "네이버 데이터랩",
    "google": "구글 트렌드",
    "pinterest": "핀터레스트",
    "meta": "인스타그램",
}
PLATFORM_TAGS = {"naver": "네이버", "google": "구글", "pinterest": "핀터", "meta": "인스타"}


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

def merge_monthly_timeline(results: dict) -> list:
    """One point per month. Platforms report on different dates (monthly, weekly), so each
    platform's values are averaged within the month; a month a platform has no value for stays None."""
    months = defaultdict(lambda: defaultdict(list))
    for name, res in results.items():
        for item in res.get("timeline", []):
            months[item["date"][:7]][name].append(item["value"])
    return [
        TimelinePoint(date=month, **{name: round(sum(v) / len(v), 1) for name, v in months[month].items()})
        for month in sorted(months)
    ]


def find_peak_month(timeline: list, live: dict):
    """Month with the highest average index across live platforms, or None without live data."""
    best = None
    for point in timeline:
        values = [getattr(point, name) for name in live if getattr(point, name) is not None]
        if values and (best is None or sum(values) / len(values) > best[0]):
            best = (sum(values) / len(values), point.date)
    return best[1] if best else None


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

    # Run the enabled platform fetchers concurrently in parallel threads
    fetched = await asyncio.gather(
        *(asyncio.to_thread(FETCHERS[name], keyword) for name in ENABLED_PLATFORMS)
    )
    results = dict(zip(ENABLED_PLATFORMS, fetched))
    # Everything said about the keyword as a whole rests on live platforms only
    live = {name: res for name, res in results.items() if res.get("is_live")}

    timeline = merge_monthly_timeline(results)

    dominant_key = max(live, key=lambda name: live[name]["relative_index"]) if live else None
    peak_month = find_peak_month(timeline, live)

    changes = [res["weekly_change_pct"] for res in live.values()]
    if not changes:
        overall_sentiment = "판단 불가"
    elif all(c > 0 for c in changes):
        overall_sentiment = "상승"
    elif all(c < 0 for c in changes):
        overall_sentiment = "하락"
    else:
        overall_sentiment = "채널별 상이"

    if live:
        change_text = ", ".join(
            f"{PLATFORM_NAMES[name]} {res['weekly_change_pct']:+}%" for name, res in live.items()
        )
        summary_insight = (
            f"'{keyword}' 실제 데이터 기준, 최근 관심도 지수가 가장 높은 채널은 "
            f"{PLATFORM_NAMES[dominant_key]}({int(live[dominant_key]['relative_index'])}점)입니다. "
            f"직전 구간 대비 변화: {change_text}."
        )
        if peak_month:
            summary_insight += f" 최근 1년 중 관심도가 가장 높았던 달은 {peak_month}입니다."
        example_names = [PLATFORM_NAMES[name] for name in results if name not in live]
        if example_names:
            summary_insight += f" 예시 데이터 채널({', '.join(example_names)})은 이 요약에 반영하지 않았습니다."
    else:
        summary_insight = (
            "지금은 실제 데이터를 받아온 채널이 없습니다. "
            "아래 수치는 화면 구성을 보여 주는 예시 데이터이며 실제 측정값이 아닙니다."
        )

    # Cross-platform combined keywords
    cross_keywords = []
    seen = set()
    for name, res in results.items():
        for kw in res.get("top_related_keywords", []):
            if kw not in seen:
                seen.add(kw)
                cross_keywords.append({
                    "keyword": kw,
                    "platform": PLATFORM_TAGS[name],
                    "is_live": res.get("related_keywords_live", False),
                })

    response = OmniTrendResponse(
        keyword=keyword,
        updated_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        overall_sentiment=overall_sentiment,
        dominant_platform=PLATFORM_NAMES[dominant_key] if dominant_key else None,
        peak_month=peak_month,
        summary_insight=summary_insight,
        timeline=timeline,
        platforms={
            name: PlatformMetric(**{k: v for k, v in res.items() if k in PlatformMetric.model_fields})
            for name, res in results.items()
        },
        cross_platform_keywords=cross_keywords[:15]
    )

    # If core live platforms had a temporary network glitch, use short 5s TTL instead of 600s
    # Naver only counts when its keys are set: without keys it is always example data, and
    # treating that as a glitch would turn the cache off and re-query Google on every search.
    retry_soon = {"google"} | ({"naver"} if NAVER_CLIENT_ID and NAVER_CLIENT_SECRET else set())
    has_fallback = any(
        not res.get("is_live", False)
        for name, res in results.items()
        if name in retry_soon
    )
    ttl = 5 if has_fallback else CACHE_TTL_SECONDS
    _cache[keyword] = (time.monotonic() + ttl, response)
    _cache.move_to_end(keyword)
    while len(_cache) > CACHE_MAX_ENTRIES:
        _cache.popitem(last=False)
    return response


def check_studio_request(request: Request, words: list) -> None:
    """Studio searches call the external APIs every time (no cache), so they share the lookup limit."""
    if len(words) > 30:
        raise HTTPException(status_code=400, detail="키워드가 너무 많습니다.")
    for word in words:
        if not isinstance(word, str) or len(word) > MAX_KEYWORD_LENGTH:
            raise HTTPException(status_code=400, detail=f"키워드는 {MAX_KEYWORD_LENGTH}자 이하로 입력해주세요.")
    check_rate_limit(request.client.host if request.client else "unknown")


def studio_error(label: str, err: Exception) -> HTTPException:
    # The detail goes to the browser: never include the exception text (it can carry request URLs).
    print(f"[{label} error] {type(err).__name__}")
    return HTTPException(status_code=500, detail=f"{label} 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")


@app.post("/api/datalab/search", response_model=DataLabSearchResponse)
async def datalab_search(req: DataLabSearchRequest, request: Request):
    """Naver DataLab multi-topic search query identical to datalab.naver.com."""
    check_studio_request(request, [g.group_name for g in req.keyword_groups] + [k for g in req.keyword_groups for k in g.keywords])
    try:
        res = search_naver_datalab_custom(
            start_date=req.start_date,
            end_date=req.end_date,
            time_unit=req.time_unit,
            keyword_groups=[{"group_name": g.group_name, "keywords": g.keywords} for g in req.keyword_groups],
            device=req.device,
            gender=req.gender,
            ages=req.ages,
        )
        return res
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise studio_error("데이터랩", e)


@app.post("/api/google/search", response_model=GoogleTrendsSearchResponse)
async def google_trends_search(req: GoogleTrendsSearchRequest, request: Request):
    """Google Trends multi-keyword comparison query (1~5 keywords)."""
    check_studio_request(request, req.keywords)
    try:
        res = search_google_trends_custom(
            keywords=req.keywords,
            timeframe=req.timeframe,
            geo=req.geo,
            gprop=req.gprop,
        )
        return res
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise studio_error("구글 트렌드", e)


@app.post("/api/meta/search", response_model=MetaPrecisionSearchResponse)
async def meta_precision_search(req: MetaPrecisionSearchRequest, request: Request):
    """Meta Instagram Ads Archive multi-keyword & brand intelligence search."""
    check_studio_request(request, req.keywords)
    try:
        res = search_meta_precision_custom(
            keywords=req.keywords,
            country=req.country,
            status=req.status,
            publisher_platform=req.publisher_platform,
        )
        return res
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise studio_error("인스타그램 광고", e)


@app.get("/api/keys/status")
async def keys_status():
    """Returns the live connection status of each platform API."""
    return {
        "naver": bool(NAVER_CLIENT_ID and NAVER_CLIENT_SECRET),
        "google": True,
        "meta": bool(META_ACCESS_TOKEN),
        "pinterest": bool(PINTEREST_ACCESS_TOKEN),
    }
