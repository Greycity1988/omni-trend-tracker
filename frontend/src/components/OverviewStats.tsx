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
      ? 'text-emerald-600 dark:text-[#A8FF1A]'
      : data.overall_sentiment === '하락'
        ? 'text-rose-600 dark:text-[#F34238]'
        : 'text-slate-900 dark:text-white';

  return (
    <div className="space-y-4">
      {/* 4 KPI Metrics Grid - Dual Mode Family Look */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Peak Month */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xl p-5 dark:border-[#26272c] dark:bg-[#141416] flex flex-col justify-between space-y-2 transition-colors">
          <div className="flex items-center justify-between">
            <span className="tracking-wider text-[11px] font-bold text-slate-500 dark:text-[#AEAEAE] font-mono uppercase">
              PEAK MONTH
            </span>
            <CalendarDays className="w-4 h-4 text-slate-400 dark:text-[#AEAEAE]" />
          </div>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900 dark:text-white">
              {data.peak_month ?? '–'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-[#AEAEAE] font-mono mt-1 pt-1 border-t border-slate-100 dark:border-[#202126]">
            최근 1년 중 최고 관심도 구간
          </div>
        </div>

        {/* Metric 2: Dominant Channel (Signal Highlight) */}
        <div className="rounded-3xl border border-emerald-500/40 bg-white shadow-xl p-5 dark:border-[#A8FF1A]/40 dark:bg-[#141416] flex flex-col justify-between space-y-2 relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 dark:bg-[#A8FF1A]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <span className="tracking-wider text-[11px] font-bold text-emerald-700 dark:text-[#A8FF1A] font-mono uppercase flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#A8FF1A] shadow-[0_0_6px_#A8FF1A]" />
              <span>DOMINANT CHANNEL</span>
            </span>
            <Target className="w-4 h-4 text-emerald-600 dark:text-[#A8FF1A]" />
          </div>
          <div className="flex items-baseline space-x-1.5 mt-2 relative z-10">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-700 dark:text-[#A8FF1A]">
              {data.dominant_platform ?? '–'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-[#AEAEAE] mt-1 pt-1 border-t border-slate-100 dark:border-[#202126] relative z-10">
            관심도 지수 최다 쿼리 채널
          </div>
        </div>

        {/* Metric 3: Momentum Status */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xl p-5 dark:border-[#26272c] dark:bg-[#141416] flex flex-col justify-between space-y-2 transition-colors">
          <div className="flex items-center justify-between">
            <span className="tracking-wider text-[11px] font-bold text-slate-500 dark:text-[#AEAEAE] font-mono uppercase">
              MOMENTUM STATUS
            </span>
            <Flame className="w-4 h-4 text-slate-400 dark:text-[#AEAEAE]" />
          </div>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className={`text-2xl sm:text-3xl font-black tracking-tight ${momentumColor}`}>
              {data.overall_sentiment}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-[#AEAEAE] mt-1 pt-1 border-t border-slate-100 dark:border-[#202126]">
            직전 구간 대비 모멘텀 변화율
          </div>
        </div>

        {/* Metric 4: Live Data Channels */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xl p-5 dark:border-[#26272c] dark:bg-[#141416] flex flex-col justify-between space-y-2 transition-colors">
          <div className="flex items-center justify-between">
            <span className="tracking-wider text-[11px] font-bold text-slate-500 dark:text-[#AEAEAE] font-mono uppercase">
              LIVE DATA CHANNELS
            </span>
            <TrendingUp className="w-4 h-4 text-slate-700 dark:text-white" />
          </div>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900 dark:text-white">
              {liveNames.length} / {channels.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-[#AEAEAE] font-mono">채널</span>
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-[#A8FF1A] font-bold mt-1 pt-1 border-t border-slate-100 dark:border-[#202126]">
            {liveNames.length > 0 ? `실제 연동: ${liveNames.join(' • ')}` : '공식 API 연결 대기'}
          </div>
        </div>
      </div>

      {/* Synthesis Insight Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-xl p-5 dark:border-[#26272c] dark:bg-[#141416] flex items-start space-x-3.5 transition-colors">
        <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 dark:bg-[#202126] dark:border-[#2e2f36] flex items-center justify-center text-emerald-700 dark:text-[#A8FF1A] flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
            CROSS-CHANNEL SYNTHESIS INSIGHT
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#AEAEAE] mt-1 leading-relaxed">
            {data.summary_insight}
          </p>
        </div>
      </div>
    </div>
  );
};
