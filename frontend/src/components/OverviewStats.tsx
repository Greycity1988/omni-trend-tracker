import React from 'react';
import { OmniTrendResponse } from '../types';
import { Flame, Target, CalendarDays, TrendingUp, Sparkles } from 'lucide-react';

interface OverviewStatsProps {
  data: OmniTrendResponse;
}

const CHANNEL_SHORT_NAMES: Record<string, string> = {
  naver: '네이버',
  google: '구글',
  pinterest: '핀터',
  meta: '인스타',
};

export const OverviewStats: React.FC<OverviewStatsProps> = ({ data }) => {
  const channels = Object.entries(data.platforms);
  const liveNames = channels.filter(([, p]) => p?.is_live).map(([key]) => CHANNEL_SHORT_NAMES[key] ?? key);
  const momentumColor =
    data.overall_sentiment === '상승'
      ? 'text-violet-600'
      : data.overall_sentiment === '하락'
        ? 'text-rose-600'
        : 'text-ink-primary';

  return (
    <div className="space-y-4">
      {/* 4 KPI Metrics Grid - Lifemed Style (Image 0 & 1) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Peak Month */}
        <div className="bg-white/85 backdrop-blur-xl rounded-2xl border border-black/[0.06] p-5 shadow-soft-xs hover:shadow-soft-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="tracking-wider text-[11px] font-bold text-ink-muted uppercase">
              PEAK MONTH
            </span>
            <CalendarDays className="w-4 h-4 text-ink-muted" />
          </div>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-ink-primary">
              {data.peak_month ?? '–'}
            </span>
          </div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">
            최근 1년 중 관심도가 가장 높았던 달
          </div>
        </div>

        {/* Metric 2: Dominant Channel */}
        <div className="bg-white/85 backdrop-blur-xl rounded-2xl border border-black/[0.06] p-5 shadow-soft-xs hover:shadow-soft-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="tracking-wider text-[11px] font-bold text-ink-muted uppercase">
              DOMINANT CHANNEL
            </span>
            <Target className="w-4 h-4 text-violet-500" />
          </div>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-violet-700">
              {data.dominant_platform ?? '–'}
            </span>
          </div>
          <div className="text-[11px] text-violet-600 font-medium mt-1">
            최근 관심도 지수가 가장 높은 채널
          </div>
        </div>

        {/* Metric 3: Momentum Status */}
        <div className="bg-white/85 backdrop-blur-xl rounded-2xl border border-black/[0.06] p-5 shadow-soft-xs hover:shadow-soft-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="tracking-wider text-[11px] font-bold text-ink-muted uppercase">
              MOMENTUM STATUS
            </span>
            <Flame className="w-4 h-4 text-violet-500" />
          </div>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className={`text-xl sm:text-2xl font-bold tracking-tight ${momentumColor}`}>
              {data.overall_sentiment}
            </span>
          </div>
          <div className="text-[11px] text-ink-muted mt-1">
            실제 데이터 채널의 직전 구간 대비 변화
          </div>
        </div>

        {/* Metric 4: Live Data Channels - Lifemed Signature Soft Sage Card (Image 1 style) */}
        <div className="bg-[#E8F7F0] rounded-2xl border border-[#A7F3D0] p-5 shadow-soft-xs hover:shadow-soft-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="tracking-wider text-[11px] font-bold text-[#065F46]/80 uppercase">
              LIVE DATA CHANNELS
            </span>
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#065F46]">
              {liveNames.length} / {channels.length}
            </span>
            <span className="text-xs text-[#065F46]/80 font-medium">채널</span>
          </div>
          <div className="text-[11px] text-[#065F46] font-bold mt-1">
            {liveNames.length > 0 ? `실제 데이터: ${liveNames.join(' • ')}` : '실제 데이터 없음 (전부 예시)'}
          </div>
        </div>
      </div>

      {/* Synthesis Insight Banner */}
      <div className="bg-white/85 backdrop-blur-xl rounded-2xl border border-black/[0.06] p-5 shadow-soft-xs flex items-start space-x-3.5">
        <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-200/80 flex items-center justify-center text-violet-600 flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
            통합 트렌드 인텔리전스 브리프
          </h4>
          <p className="text-xs sm:text-sm text-ink-primary mt-1 leading-relaxed">
            {data.summary_insight}
          </p>
        </div>
      </div>
    </div>
  );
};
