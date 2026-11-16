import React from 'react';
import { CrossPlatformKeyword } from '../types';
import { Tag } from 'lucide-react';

interface RelatedKeywordsProps {
  keywords: CrossPlatformKeyword[];
  keyword: string;
}

export const RelatedKeywords: React.FC<RelatedKeywordsProps> = ({ keywords, keyword }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-xl p-6 sm:p-8 space-y-5 dark:border-[#26272c] dark:bg-[#141416] transition-colors">
      <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-[#202126]">
        <Tag className="w-5 h-5 text-emerald-600 dark:text-[#A8FF1A]" />
        <div>
          <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            크로스 플랫폼 연관 키워드 & 카피 추천
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#AEAEAE] mt-0.5">
            ‘{keyword}’ 연관 키워드. ‘실제’는 플랫폼이 알려 준 연관 검색어, ‘예시’는 함께 검색해 볼 조합입니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {keywords.map((item, idx) => {
          let platformBadge = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#202126] dark:text-[#AEAEAE] dark:border-[#2e2f36]';
          if (item.platform === '네이버') platformBadge = 'bg-slate-100 text-slate-900 border-slate-300 dark:bg-[#1a1b1f] dark:text-white dark:border-white/20';
          if (item.platform === '구글') platformBadge = 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-[#1a1b1f] dark:text-[#A8FF1A] dark:border-[#A8FF1A]/30';
          if (item.platform === '인스타') platformBadge = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#1a1b1f] dark:text-[#AEAEAE] dark:border-[#AEAEAE]/30';
          if (item.platform === '핀터') platformBadge = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-[#1a1b1f] dark:text-[#F34238] dark:border-[#F34238]/30';

          return (
            <div
              key={idx}
              className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-[#26272c] dark:bg-[#1a1b1f] dark:hover:border-[#3e404a] transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${platformBadge}`}>
                  {item.platform}
                </span>
                <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-[#AEAEAE]">
                  {item.is_live ? '실제' : '예시'}
                </span>
              </div>
              <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-[#A8FF1A] transition-colors truncate" title={item.keyword}>
                {item.keyword}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
