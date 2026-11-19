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
    <div className="rounded-3xl border border-slate-200 bg-white shadow-xl p-6 sm:p-8 space-y-6 dark:border-[#26272c] dark:bg-[#141416] transition-colors">
      <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-[#202126]">
        <Users2 className="w-5 h-5 text-emerald-600 dark:text-[#A8FF1A]" />
        <div>
          <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            타겟 오디언스 성별 및 연령대 분포
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#AEAEAE] mt-0.5">
            네이버 데이터랩 및 소셜 인구통계 기반 탐색 고객 프로필
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gender Breakdown */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 dark:bg-[#1a1b1f] dark:border-[#26272c] space-y-4 transition-colors">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
            <span>성별 탐색 비중</span>
            <span className="font-mono text-slate-500 dark:text-[#AEAEAE]">Gender Ratio</span>
          </div>

          {/* Bar */}
          <div className="h-4 w-full bg-slate-200 dark:bg-[#202126] rounded-full overflow-hidden flex transition-colors">
            <div
              style={{ width: `${demo.male_ratio}%` }}
              className="bg-slate-700 dark:bg-white h-full transition-all duration-500"
              title={`남성 ${demo.male_ratio}%`}
            />
            <div
              style={{ width: `${demo.female_ratio}%` }}
              className="bg-emerald-500 dark:bg-[#A8FF1A] h-full transition-all duration-500"
              title={`여성 ${demo.female_ratio}%`}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700 dark:bg-white" />
              <span className="text-slate-500 dark:text-[#AEAEAE]">남성</span>
              <strong className="font-mono text-slate-900 dark:text-white">{demo.male_ratio}%</strong>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-[#A8FF1A]" />
              <span className="text-slate-500 dark:text-[#AEAEAE]">여성</span>
              <strong className="font-mono text-emerald-700 dark:text-[#A8FF1A]">{demo.female_ratio}%</strong>
            </div>
          </div>
        </div>

        {/* Age Groups Breakdown */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 dark:bg-[#1a1b1f] dark:border-[#26272c] space-y-3 transition-colors">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
            <span>연령대별 관심도 분포</span>
            <span className="font-mono text-slate-500 dark:text-[#AEAEAE]">Age Distribution</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {Object.entries(demo.age_groups).map(([age, pct]) => (
              <div key={age} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-[#AEAEAE] font-medium">{age}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{pct}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-[#202126] rounded-full overflow-hidden transition-colors">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-emerald-500 dark:bg-[#A8FF1A] rounded-full transition-all duration-500"
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
