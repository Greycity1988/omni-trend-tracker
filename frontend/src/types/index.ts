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
  /** Worked out from platforms with live data only: '상승' | '하락' | '채널별 상이' | '판단 불가' */
  overall_sentiment: string;
  dominant_platform: string | null;
  peak_month: string | null;
  summary_insight: string;
  timeline: TimelinePoint[];
  /** Only the platforms the backend has enabled */
  platforms: Partial<Record<PlatformKey, PlatformMetric>>;
  cross_platform_keywords: CrossPlatformKeyword[];
}

// ── Naver DataLab Advanced Multi-topic Types ──
export interface DataLabKeywordGroupInput {
  id: string;
  groupName: string;
  keywordsString: string;
}

export interface DataLabDataPoint {
  period: string;
  ratio: number;
}

export interface DataLabGroupResult {
  title: string;
  keywords: string[];
  data: DataLabDataPoint[];
  peak_period?: string;
  peak_ratio?: number;
  latest_ratio?: number;
  change_pct?: number;
}

export interface DataLabSearchResponse {
  start_date: string;
  end_date: string;
  time_unit: 'date' | 'week' | 'month';
  results: DataLabGroupResult[];
  is_live: boolean;
}

export interface ApiKeysStatus {
  naver: boolean;
  google: boolean;
  meta: boolean;
  pinterest: boolean;
}

// ── Google Trends Precision Studio Types ──
export interface GoogleTrendsDataPoint {
  period: string;
  values: Record<string, number>;
}

export interface GoogleKeywordSummary {
  keyword: string;
  peak_period?: string;
  peak_value: number;
  average_value: number;
  latest_value: number;
  change_pct: number;
  related_queries: string[];
}

export interface GoogleTrendsSearchResponse {
  timeframe: string;
  geo: string;
  gprop: string;
  keywords: string[];
  timeline: GoogleTrendsDataPoint[];
  summaries: Record<string, GoogleKeywordSummary>;
  is_live: boolean;
}

// ── Meta Instagram Precision Studio Types ──
export interface MetaAdvertiserPage {
  page_name: string;
  ad_count: number;
}

export interface MetaKeywordAdSummary {
  keyword: string;
  total_ads_found: number;
  activity_score: number;
  top_advertisers: MetaAdvertiserPage[];
  timeline: { period: string; count: number }[];
  sample_page_names: string[];
}

export interface MetaPrecisionSearchResponse {
  keywords: string[];
  country: string;
  status: string;
  results: MetaKeywordAdSummary[];
  is_live: boolean;
  notice?: string;
}

