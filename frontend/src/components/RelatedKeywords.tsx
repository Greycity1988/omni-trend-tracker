import React from 'react';
import { CrossPlatformKeyword } from '../types';
import { Tag } from 'lucide-react';

interface RelatedKeywordsProps {
  keywords: CrossPlatformKeyword[];
  keyword: string;
}

interface PlatformStyleConfig {
  badge: string;
  dotColor: string;
  hoverBorder: string;
  hoverText: string;
}

const PLATFORM_STYLES: Record<string, PlatformStyleConfig> = {
  '네이버': {
    badge: 'bg-[#03C75A]/10 text-[#03C75A] border-[#03C75A]/30 dark:bg-[#03C75A]/15 dark:text-[#03C75A] dark:border-[#03C75A]/40',
    dotColor: 'bg-[#03C75A]',
    hoverBorder: 'hover:border-[#03C75A]/60 dark:hover:border-[#03C75A]/60',
    hoverText: 'group-hover:text-[#03C75A] dark:group-hover:text-[#03C75A]',
  },
  '구글': {
    badge: 'bg-[#4285F4]/10 text-[#4285F4] border-[#4285F4]/30 dark:bg-[#4285F4]/15 dark:text-[#6ba3ff] dark:border-[#4285F4]/40',
    dotColor: 'bg-[#4285F4]',
    hoverBorder: 'hover:border-[#4285F4]/60 dark:hover:border-[#4285F4]/60',
    hoverText: 'group-hover:text-[#4285F4] dark:group-hover:text-[#6ba3ff]',
  },
};

const DEFAULT_STYLE: PlatformStyleConfig = {
  badge: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#202126] dark:text-[#AEAEAE] dark:border-[#2e2f36]',
  dotColor: 'bg-slate-400',
  hoverBorder: 'hover:border-slate-400 dark:hover:border-slate-500',
  hoverText: 'group-hover:text-slate-900 dark:group-hover:text-white',
};

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
          const style = PLATFORM_STYLES[item.platform] || DEFAULT_STYLE;

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border border-slate-200 bg-slate-50 ${style.hoverBorder} dark:border-[#26272c] dark:bg-[#1a1b1f] transition-all flex flex-col justify-between space-y-2 group shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center space-x-1.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${style.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${style.dotColor} shadow-sm flex-shrink-0`} />
                  <span>{item.platform}</span>
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    item.is_live
                      ? 'font-bold bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-[#A8FF1A] dark:border-emerald-800/40'
                      : 'font-medium bg-slate-100 text-slate-500 border-slate-200 dark:bg-[#202126] dark:text-[#AEAEAE] dark:border-[#2e2f36]'
                  }`}
                >
                  {item.is_live ? '실제' : '예시'}
                </span>
              </div>
              <div
                className={`font-bold text-xs text-slate-900 ${style.hoverText} dark:text-white transition-colors truncate`}
                title={item.keyword}
              >
                {item.keyword}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
