from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class KeywordTrendRequest(BaseModel):
    keyword: str
    timeframe: str = "today 12-m"
    geo: str = "KR"

class TimelinePoint(BaseModel):
    date: str  # YYYY-MM
    naver: Optional[float] = None
    google: Optional[float] = None
    pinterest: Optional[float] = None
    meta: Optional[float] = None

class DemographicsInfo(BaseModel):
    male_ratio: float
    female_ratio: float
    age_groups: Dict[str, float]

class PlatformMetric(BaseModel):
    platform: str
    display_name: str
    icon: str
    relative_index: float  # 0 to 100
    weekly_change_pct: float
    status: str
    primary_metric_label: str
    primary_metric_value: str
    secondary_metric_label: str
    secondary_metric_value: str
    top_related_keywords: List[str]
    demographics: Optional[DemographicsInfo] = None
    is_live: bool = False
    related_keywords_live: bool = False

class OmniTrendResponse(BaseModel):
    keyword: str
    updated_at: str
    overall_sentiment: str
    dominant_platform: Optional[str] = None
    peak_month: Optional[str] = None
    summary_insight: str
    timeline: List[TimelinePoint]
    platforms: Dict[str, PlatformMetric]
    cross_platform_keywords: List[Dict[str, Any]]

# --- Naver DataLab Advanced Multi-Group Search Models ---
class KeywordGroupItem(BaseModel):
    group_name: str
    keywords: List[str]

class DataLabSearchRequest(BaseModel):
    start_date: str                 # "YYYY-MM-DD"
    end_date: str                   # "YYYY-MM-DD"
    time_unit: str = "month"        # "date" | "week" | "month"
    keyword_groups: List[KeywordGroupItem]
    device: Optional[str] = None    # "pc" | "mo" | None
    gender: Optional[str] = None    # "m" | "f" | None
    ages: Optional[List[str]] = None # ["1", "2", ...]

class DataLabDataPoint(BaseModel):
    period: str
    ratio: float

class DataLabGroupResult(BaseModel):
    title: str
    keywords: List[str]
    data: List[DataLabDataPoint]
    peak_period: Optional[str] = None
    peak_ratio: Optional[float] = None
    latest_ratio: Optional[float] = None
    change_pct: Optional[float] = None

class DataLabSearchResponse(BaseModel):
    start_date: str
    end_date: str
    time_unit: str
    results: List[DataLabGroupResult]
    is_live: bool

# --- Google Trends Multi-Keyword Precision Models ---
class GoogleTrendsSearchRequest(BaseModel):
    keywords: List[str]                  # 1 to 5 keywords
    timeframe: str = "today 12-m"        # "now 1-d", "now 7-d", "today 1-m", "today 3-m", "today 12-m", "today 5-y"
    geo: str = "KR"                      # "KR", "KR-11", "KR-41", "", "US", "JP"
    gprop: str = ""                      # "", "youtube", "froogle", "news"

class GoogleTrendsDataPoint(BaseModel):
    period: str
    values: Dict[str, float]

class GoogleKeywordSummary(BaseModel):
    keyword: str
    peak_period: Optional[str] = None
    peak_value: float = 0.0
    average_value: float = 0.0
    latest_value: float = 0.0
    change_pct: float = 0.0
    related_queries: List[str] = []

class GoogleTrendsSearchResponse(BaseModel):
    timeframe: str
    geo: str
    gprop: str
    keywords: List[str]
    timeline: List[GoogleTrendsDataPoint]
    summaries: Dict[str, GoogleKeywordSummary]
    is_live: bool

# --- Meta Instagram Multi-Keyword Precision Models ---
class MetaPrecisionSearchRequest(BaseModel):
    keywords: List[str]                  # 1 to 5 keywords / brands
    country: str = "KR"                  # "KR", "US", "JP", "ALL"
    status: str = "ALL"                  # "ACTIVE", "ALL"
    publisher_platform: str = "INSTAGRAM" # "INSTAGRAM", "ALL"

class MetaAdvertiserPage(BaseModel):
    page_name: str
    ad_count: int

class MetaKeywordAdSummary(BaseModel):
    keyword: str
    total_ads_found: int
    activity_score: float
    top_advertisers: List[MetaAdvertiserPage]
    timeline: List[Dict[str, Any]]
    sample_page_names: List[str]

class MetaPrecisionSearchResponse(BaseModel):
    keywords: List[str]
    country: str
    status: str
    results: List[MetaKeywordAdSummary]
    is_live: bool
    notice: Optional[str] = None

