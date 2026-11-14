from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class KeywordTrendRequest(BaseModel):
    keyword: str
    timeframe: str = "today 12-m"
    geo: str = "KR"

class TimelinePoint(BaseModel):
    date: str  # YYYY-MM
    # None when the platform is disabled or has no value for that month
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
    weekly_change_pct: float  # change against the previous period (month for Naver, week for Google)
    status: str  # "rising", "stable", "cooling"
    primary_metric_label: str
    primary_metric_value: str
    secondary_metric_label: str
    secondary_metric_value: str
    top_related_keywords: List[str]
    demographics: Optional[DemographicsInfo] = None
    is_live: bool = False  # True only when the trend values came from the platform for this keyword
    related_keywords_live: bool = False  # True only when top_related_keywords came from the platform

class OmniTrendResponse(BaseModel):
    keyword: str
    updated_at: str
    # The four fields below are worked out from platforms with live data only
    overall_sentiment: str
    dominant_platform: Optional[str] = None
    peak_month: Optional[str] = None  # YYYY-MM
    summary_insight: str
    timeline: List[TimelinePoint]
    platforms: Dict[str, PlatformMetric]
    cross_platform_keywords: List[Dict[str, Any]]
