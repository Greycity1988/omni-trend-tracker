import React from 'react';
import { PlatformMetric } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PlatformCardsProps {
  platforms: Record<string, PlatformMetric>;
}

export const PlatformCards: React.FC<PlatformCardsProps> = ({ platforms }) => {
  const platformList = Object.values(platforms);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-ink-primary">
            플랫폼별 심층 데이터 리포트
          </h3>
          <p className="text-xs text-ink-secondary mt-0.5">
            채널별 쿼리 볼륨, 사용자 특성 및 상위 연관 키워드 상세 분석
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platformList.map((p) => {
          const isRising = p.weekly_change_pct >= 0;

          return (
            <div
              key={p.platform}
              className="bg-surface rounded-3xl border border-line shadow-soft-xs hover:shadow-soft-sm transition-all p-6 space-y-5"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-line/60">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl" role="img" aria-label={p.display_name}>
                    {p.icon}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-ink-primary">{p.display_name}</h4>
                    <span className="text-[11px] text-ink-muted font-medium">
                      관심도 지수: <strong className="font-mono text-ink-primary">{int(p.relative_index)}/100</strong>
                    </span>
                  </div>
                </div>

                {/* Change Pill */}
                <div
                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold ${
                    isRising
                      ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-700 border border-rose-500/20'
                  }`}
                >
                  {isRising ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{p.weekly_change_pct > 0 ? `+${p.weekly_change_pct}%` : `${p.weekly_change_pct}%`}</span>
                </div>
              </div>

              {/* 2 Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-canvas-subtle/60 p-3.5 rounded-2xl border border-line">
                  <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block">
                    {p.primary_metric_label}
                  </span>
                  <span className="text-lg sm:text-xl font-extrabold font-mono text-ink-primary mt-0.5 block">
                    {p.primary_metric_value}
                  </span>
                </div>

                <div className="bg-canvas-subtle/60 p-3.5 rounded-2xl border border-line">
                  <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block">
                    {p.secondary_metric_label}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-ink-primary mt-1 block truncate">
                    {p.secondary_metric_value}
                  </span>
                </div>
              </div>

              {/* Related Keywords List */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block">
                  상위 연관 검색어 & 태그
                </span>
                <div className="flex items-center flex-wrap gap-1.5">
                  {p.top_related_keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl text-xs font-medium bg-canvas-subtle text-ink-secondary border border-line hover:border-line-strong transition-colors"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function int(val: number): number {
  return Math.round(val);
}
