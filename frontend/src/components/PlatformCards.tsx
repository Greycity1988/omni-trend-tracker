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
      <div className="flex items-center justify-between pb-1 border-b border-[#202126]">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-white">
            플랫폼별 심층 데이터 리포트
          </h3>
          <p className="text-xs text-[#AEAEAE] mt-0.5">
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
              className="rounded-3xl border border-[#26272c] shadow-2xl p-6 space-y-5"
              style={{ backgroundColor: '#141416' }}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#202126]">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl" role="img" aria-label={p.display_name}>
                    {p.icon}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center flex-wrap gap-x-2 gap-y-1">
                      <span>{p.display_name}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${
                          p.is_live
                            ? 'bg-[#A8FF1A] text-black border-transparent shadow-[0_0_8px_rgba(168,255,26,0.3)]'
                            : 'bg-[#202126] text-[#AEAEAE] border-[#2e2f36]'
                        }`}
                      >
                        {p.is_live ? 'LIVE DATA' : 'MOCK PREVIEW'}
                      </span>
                    </h4>
                    <span className="text-[11px] text-[#AEAEAE] font-mono">
                      관심도 지수: <strong className="font-mono text-white">{Math.round(p.relative_index)}/100</strong>
                    </span>
                  </div>
                </div>

                {/* Change Pill */}
                <div
                  className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-mono font-black ${
                    isRising
                      ? 'bg-[#A8FF1A] text-black shadow-[0_0_8px_rgba(168,255,26,0.25)]'
                      : 'bg-[#F34238] text-white shadow-sm'
                  }`}
                >
                  {isRising ? <TrendingUp className="w-3.5 h-3.5 text-black" /> : <TrendingDown className="w-3.5 h-3.5 text-white" />}
                  <span>{p.weekly_change_pct > 0 ? `+${p.weekly_change_pct}%` : `${p.weekly_change_pct}%`}</span>
                </div>
              </div>

              {/* 2 Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1a1b1f] p-3.5 rounded-2xl border border-[#26272c]">
                  <span className="text-[10px] font-bold text-[#AEAEAE] uppercase font-mono tracking-wider block">
                    {p.primary_metric_label}
                  </span>
                  <span className="text-lg sm:text-xl font-black font-mono text-white mt-0.5 block">
                    {p.primary_metric_value}
                  </span>
                </div>

                <div className="bg-[#1a1b1f] p-3.5 rounded-2xl border border-[#26272c]">
                  <span className="text-[10px] font-bold text-[#AEAEAE] uppercase font-mono tracking-wider block">
                    {p.secondary_metric_label}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white mt-1 block truncate">
                    {p.secondary_metric_value}
                  </span>
                </div>
              </div>

              {/* Related Keywords List */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#AEAEAE] uppercase font-mono tracking-wider block">
                  {p.related_keywords_live ? '상위 연관 검색어' : '함께 검색해 볼 조합 (예시)'}
                </span>
                <div className="flex items-center flex-wrap gap-1.5">
                  {p.top_related_keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-[#1a1b1f] text-white border border-[#2e2f36] hover:border-[#A8FF1A] transition-colors"
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
