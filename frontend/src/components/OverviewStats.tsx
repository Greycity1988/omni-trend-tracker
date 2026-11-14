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
      ? 'text-[#A8FF1A]'
      : data.overall_sentiment === '하락'
        ? 'text-[#F34238]'
        : 'text-white';

  return (
    <div className="space-y-4">
      {/* 4 KPI Metrics Grid - Monotone Family Look */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Peak Month */}
        <div
          className="rounded-3xl border border-[#26272c] p-5 shadow-2xl flex flex-col justify-between space-y-2"
          style={{ backgroundColor: '#141416' }}
        >
          <div className="flex items-center justify-between">
            <span className="tracking-wider text-[11px] font-bold text-[#AEAEAE] font-mono uppercase">
              PEAK MONTH
            </span>
            <CalendarDays className="w-4 h-4 text-[#AEAEAE]" />
          </div>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-white">
              {data.peak_month ?? '–'}
            </span>
          </div>
          <div className="text-[11px] text-[#AEAEAE] font-mono mt-1 pt-1 border-t border-[#202126]">
            최근 1년 중 최고 관심도 구간
          </div>
        </div>

        {/* Metric 2: Dominant Channel (Runway Signal Highlight) */}
        <div
          className="rounded-3xl border border-[#A8FF1A]/40 p-5 shadow-2xl flex flex-col justify-between space-y-2 relative overflow-hidden"
          style={{ backgroundColor: '#141416' }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#A8FF1A]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <span className="tracking-wider text-[11px] font-bold text-[#A8FF1A] font-mono uppercase flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#A8FF1A] shadow-[0_0_6px_#A8FF1A]" />
              <span>DOMINANT CHANNEL</span>
            </span>
            <Target className="w-4 h-4 text-[#A8FF1A]" />
          </div>
          <div className="flex items-baseline space-x-1.5 mt-2 relative z-10">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-[#A8FF1A]">
              {data.dominant_platform ?? '–'}
            </span>
          </div>
          <div className="text-[11px] text-[#AEAEAE] mt-1 pt-1 border-t border-[#202126] relative z-10">
            관심도 지수 최다 쿼리 채널
          </div>
        </div>

        {/* Metric 3: Momentum Status */}
        <div
          className="rounded-3xl border border-[#26272c] p-5 shadow-2xl flex flex-col justify-between space-y-2"
          style={{ backgroundColor: '#141416' }}
        >
          <div className="flex items-center justify-between">
            <span className="tracking-wider text-[11px] font-bold text-[#AEAEAE] font-mono uppercase">
              MOMENTUM STATUS
            </span>
            <Flame className="w-4 h-4 text-[#AEAEAE]" />
          </div>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className={`text-2xl sm:text-3xl font-black tracking-tight ${momentumColor}`}>
              {data.overall_sentiment}
            </span>
          </div>
          <div className="text-[11px] text-[#AEAEAE] mt-1 pt-1 border-t border-[#202126]">
            직전 구간 대비 모멘텀 변화율
          </div>
        </div>

        {/* Metric 4: Live Data Channels */}
        <div
          className="rounded-3xl border border-[#26272c] p-5 shadow-2xl flex flex-col justify-between space-y-2"
          style={{ backgroundColor: '#141416' }}
        >
          <div className="flex items-center justify-between">
            <span className="tracking-wider text-[11px] font-bold text-[#AEAEAE] font-mono uppercase">
              LIVE DATA CHANNELS
            </span>
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-white">
              {liveNames.length} / {channels.length}
            </span>
            <span className="text-xs text-[#AEAEAE] font-mono">채널</span>
          </div>
          <div className="text-[11px] text-[#A8FF1A] font-bold mt-1 pt-1 border-t border-[#202126]">
            {liveNames.length > 0 ? `실제 연동: ${liveNames.join(' • ')}` : '공식 API 연결 대기'}
          </div>
        </div>
      </div>

      {/* Synthesis Insight Banner */}
      <div
        className="rounded-3xl border border-[#26272c] p-5 shadow-2xl flex items-start space-x-3.5"
        style={{ backgroundColor: '#141416' }}
      >
        <div className="w-9 h-9 rounded-2xl bg-[#202126] border border-[#2e2f36] flex items-center justify-center text-[#A8FF1A] flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
            CROSS-CHANNEL SYNTHESIS INSIGHT
          </h4>
          <p className="text-xs sm:text-sm text-[#AEAEAE] mt-1 leading-relaxed">
            {data.summary_insight}
          </p>
        </div>
      </div>
    </div>
  );
};
