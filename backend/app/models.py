from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class KeywordTrendRequest(BaseModel):
    keyword: str
    timeframe: str = "today 12-m"
    geo: str = "KR"

class TimelinePoint(BaseModel):
    date: str
    naver: float
    google: float
    pinterest: float
    meta: float

class DemographicsInfo(BaseModel):
    male_ratio: float
    female_ratio: float
    age_groups: Dict[str, float]

class PlatformMetric(BaseModel):
    platform: str
    display_name: str
    icon: str
    relative_index: float  # 0 to 100
    estimated_monthly_volume: Optional[int] = None
    weekly_change_pct: float
    status: str  # "rising", "stable", "cooling"
    primary_metric_label: str
    primary_metric_value: str
    secondary_metric_label: str
    secondary_metric_value: str
    top_related_keywords: List[str]
    demographics: Optional[DemographicsInfo] = None
    sample_items: Optional[List[Dict[str, Any]]] = None

class OmniTrendResponse(BaseModel):
    keyword: str
    updated_at: str
    overall_sentiment: str
    dominant_platform: str
    total_estimated_reach: int
    summary_insight: str
    timeline: List[TimelinePoint]
    platforms: Dict[str, PlatformMetric]
    cross_platform_keywords: List[Dict[str, Any]]
