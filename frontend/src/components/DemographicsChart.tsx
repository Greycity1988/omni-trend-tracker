import React from 'react';
import { DemographicsInfo } from '../types';
import { Users2 } from 'lucide-react';

interface DemographicsChartProps {
  naverDemo?: DemographicsInfo;
  pinterestDemo?: DemographicsInfo;
  metaDemo?: DemographicsInfo;
}

export const DemographicsChart: React.FC<DemographicsChartProps> = ({
  naverDemo,
  pinterestDemo,
  metaDemo,
}) => {
  const demo = naverDemo || metaDemo || pinterestDemo;

  if (!demo) return null;

  return (
    <div className="bg-surface rounded-3xl border border-line shadow-soft-sm p-6 sm:p-8 space-y-6">
      <div className="flex items-center space-x-2.5 pb-4 border-b border-line/60">
        <Users2 className="w-5 h-5 text-accent" />
        <div>
          <h3 className="text-lg font-bold tracking-tight text-ink-primary">
            타겟 오디언스 성별 및 연령대 분포
          </h3>
          <p className="text-xs text-ink-secondary mt-0.5">
            네이버 데이터랩 및 소셜 인구통계 기반 탐색 고객 프로필
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gender Breakdown */}
        <div className="bg-canvas-subtle/50 p-5 rounded-2xl border border-line space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-ink-primary">
            <span>성별 탐색 비중</span>
            <span className="font-mono text-ink-muted">Gender Ratio</span>
          </div>

          {/* Bar */}
          <div className="h-4 w-full bg-line rounded-full overflow-hidden flex">
            <div
              style={{ width: `${demo.male_ratio}%` }}
              className="bg-accent h-full transition-all duration-500"
              title={`남성 ${demo.male_ratio}%`}
            />
            <div
              style={{ width: `${demo.female_ratio}%` }}
              className="bg-accent-mint h-full transition-all duration-500"
              title={`여성 ${demo.female_ratio}%`}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="text-ink-secondary">남성</span>
              <strong className="font-mono text-ink-primary">{demo.male_ratio}%</strong>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-mint" />
              <span className="text-ink-secondary">여성</span>
              <strong className="font-mono text-ink-primary">{demo.female_ratio}%</strong>
            </div>
          </div>
        </div>

        {/* Age Groups Breakdown */}
        <div className="bg-canvas-subtle/50 p-5 rounded-2xl border border-line space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-ink-primary">
            <span>연령대별 관심도 분포</span>
            <span className="font-mono text-ink-muted">Age Distribution</span>
          </div>

          <div className="space-y-2 pt-1">
            {Object.entries(demo.age_groups).map(([age, pct]) => (
              <div key={age} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-secondary font-medium">{age}</span>
                  <span className="font-mono font-bold text-ink-primary">{pct}%</span>
                </div>
                <div className="h-2 w-full bg-line rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-accent rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
