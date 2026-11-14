export type PlatformKey = 'naver' | 'google' | 'pinterest' | 'meta';

/** One point per month (date is YYYY-MM). null: platform is off or has no value that month. */
export interface TimelinePoint {
  date: string;
  naver: number | null;
  google: number | null;
  pinterest: number | null;
  meta: number | null;
}


export interface PlatformMetric {
  platform: PlatformKey;
  display_name: string;
  icon: string;
  relative_index: number;
  weekly_change_pct: number;
  status: 'rising' | 'stable' | 'cooling';
  primary_metric_label: string;
  primary_metric_value: string;
  secondary_metric_label: string;
  secondary_metric_value: string;
  top_related_keywords: string[];
  /** true only when the trend values came from the platform for this keyword */
  is_live: boolean;
  /** true only when top_related_keywords came from the platform */
  related_keywords_live: boolean;
}

export interface CrossPlatformKeyword {
  keyword: string;
  platform: string;
  /** false: a search combination to try, not something the platform reported */
  is_live: boolean;
}

export interface OmniTrendResponse {
  keyword: string;
  updated_at: string;
  /** Worked out from platforms with live data only: '상승' | '하락' | '혼조' | '판단 불가' */
  overall_sentiment: string;
  dominant_platform: string | null;
  peak_month: string | null;
  summary_insight: string;
  timeline: TimelinePoint[];
  /** Only the platforms the backend has enabled */
  platforms: Partial<Record<PlatformKey, PlatformMetric>>;
  cross_platform_keywords: CrossPlatformKeyword[];
}
