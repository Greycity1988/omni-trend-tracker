import React from 'react';
import { OmniTrendResponse } from '../types';
import { Flame, Target, Users, TrendingUp, Sparkles } from 'lucide-react';

interface OverviewStatsProps {
  data: OmniTrendResponse;
}

export const OverviewStats: React.FC<OverviewStatsProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      {/* 4 KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-surface rounded-2xl border border-line p-5 shadow-soft-xs hover:shadow-soft-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="tracking-wider text-[11px] font-bold text-ink-muted uppercase">
              TOTAL ESTIMATED VOLUME
            </span>
            <Users className="w-4 h-4 text-ink-muted" />
          </div>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-ink-primary">
              {data.total_estimated_reach.toLocaleString()}
            </span>
            <span className="text-xs text-ink-secondary">건+</span>
          </div>
          <div className="text-[11px] text-ink-muted mt-1">
            네이버 검색 + 인스타 버즈 합산
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface rounded-2xl border border-line p-5 shadow-soft-xs hover:shadow-soft-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="tracking-wider text-[11px] font-bold text-ink-muted uppercase">
              DOMINANT CHANNEL
            </span>
            <Target className="w-4 h-4 text-accent-mint" />
          </div>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-accent">
              {data.dominant_platform}
            </span>
          </div>
          <div className="text-[11px] text-accent-mint font-semibold mt-1">
            현재 가장 활발한 유입 채널
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface rounded-2xl border border-line p-5 shadow-soft-xs hover:shadow-soft-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="tracking-wider text-[11px] font-bold text-ink-muted uppercase">
              MOMENTUM STATUS
            </span>
            <Flame className="w-4 h-4 text-status-naver" />
          </div>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-700">
              상승 모멘텀
            </span>
          </div>
          <div className="text-[11px] text-ink-muted mt-1">
            전월 대비 다채널 동반 상승
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-surface rounded-2xl border border-line p-5 shadow-soft-xs hover:shadow-soft-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="tracking-wider text-[11px] font-bold text-ink-muted uppercase">
              CHANNELS AUDITED
            </span>
            <TrendingUp className="w-4 h-4 text-accent" />
          </div>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-ink-primary">
              4 / 4
            </span>
            <span className="text-xs text-ink-secondary">채널</span>
          </div>
          <div className="text-[11px] text-ink-muted mt-1">
            네이버 • 구글 • 핀터 • 인스타
          </div>
        </div>
      </div>

      {/* Synthesis Insight Banner */}
      <div className="bg-surface rounded-2xl border border-line p-5 shadow-soft-xs flex items-start space-x-3.5">
        <div className="w-9 h-9 rounded-xl bg-accent/5 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-accent-mint" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
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
