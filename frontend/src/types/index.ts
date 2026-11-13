export interface TimelinePoint {
  date: string;
  naver: number;
  google: number;
  pinterest: number;
  meta: number;
}

export interface DemographicsInfo {
  male_ratio: number;
  female_ratio: number;
  age_groups: Record<string, number>;
}

export interface PlatformMetric {
  platform: 'naver' | 'google' | 'pinterest' | 'meta';
  display_name: string;
  icon: string;
  relative_index: number;
  estimated_monthly_volume?: number;
  weekly_change_pct: number;
  status: 'rising' | 'stable' | 'cooling';
  primary_metric_label: string;
  primary_metric_value: string;
  secondary_metric_label: string;
  secondary_metric_value: string;
  top_related_keywords: string[];
  demographics?: DemographicsInfo;
}

export interface CrossPlatformKeyword {
  keyword: string;
  platform: string;
  relevance: number;
}

export interface OmniTrendResponse {
  keyword: string;
  updated_at: string;
  overall_sentiment: string;
  dominant_platform: string;
  total_estimated_reach: number;
  summary_insight: string;
  timeline: TimelinePoint[];
  platforms: Record<string, PlatformMetric>;
  cross_platform_keywords: CrossPlatformKeyword[];
}
