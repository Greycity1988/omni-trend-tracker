import React from 'react';
import { PlatformMetric } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PlatformCardsProps {
  platforms: Partial<Record<string, PlatformMetric>>;
}

export const PlatformCards: React.FC<PlatformCardsProps> = ({ platforms }) => {
  const platformList = Object.values(platforms).filter((p): p is PlatformMetric => Boolean(p));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-ink-primary">
            플랫폼별 심층 데이터 리포트
          </h3>
          <p className="text-xs text-ink-secondary mt-0.5">
            채널별 관심도 지수와 연관 키워드. ‘예시 데이터’ 카드는 실제 측정값이 아닙니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platformList.map((p) => {
          const isRising = p.weekly_change_pct >= 0;

          return (
            <div
              key={p.platform}
              className="bg-white/85 backdrop-blur-xl rounded-3xl border border-black/[0.06] shadow-lifemed hover:shadow-soft-md transition-all p-6 space-y-5"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.05]">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl" role="img" aria-label={p.display_name}>
                    {p.icon}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-ink-primary flex items-center flex-wrap gap-x-2 gap-y-1">
                      <span>{p.display_name}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          p.is_live
                            ? 'bg-[#0A0A0A] text-white'
                            : 'bg-black/[0.04] text-neutral-600 border border-black/[0.08]'
                        }`}
                      >
                        {p.is_live ? '실제 데이터' : '예시 데이터'}
                      </span>
                    </h4>
                    <span className="text-[11px] text-ink-muted font-medium">
                      관심도 지수: <strong className="font-mono text-ink-primary">{int(p.relative_index)}/100</strong>
                    </span>
                  </div>
                </div>

                {/* Change Pill */}
                <div
                  className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-mono font-semibold ${
                    isRising
                      ? 'bg-violet-50 text-violet-700 border border-violet-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {isRising ? <TrendingUp className="w-3.5 h-3.5 text-violet-600" /> : <TrendingDown className="w-3.5 h-3.5 text-rose-600" />}
                  <span>{p.weekly_change_pct > 0 ? `+${p.weekly_change_pct}%` : `${p.weekly_change_pct}%`}</span>
                </div>
              </div>

              {/* 2 Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-50/70 p-3.5 rounded-2xl border border-black/[0.04]">
                  <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block">
                    {p.primary_metric_label}
                  </span>
                  <span className="text-lg sm:text-xl font-extrabold font-mono text-ink-primary mt-0.5 block">
                    {p.primary_metric_value}
                  </span>
                </div>

                <div className="bg-neutral-50/70 p-3.5 rounded-2xl border border-black/[0.04]">
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
                  {p.related_keywords_live ? '상위 연관 검색어' : '함께 검색해 볼 조합 (예시)'}
                </span>
                <div className="flex items-center flex-wrap gap-1.5">
                  {p.top_related_keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-100/70 text-ink-secondary border border-black/[0.04] hover:border-black/20 hover:bg-neutral-100 transition-colors"
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
