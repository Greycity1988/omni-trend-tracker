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
