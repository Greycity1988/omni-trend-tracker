import React from 'react';
import { CrossPlatformKeyword } from '../types';
import { Tag } from 'lucide-react';

interface RelatedKeywordsProps {
  keywords: CrossPlatformKeyword[];
  keyword: string;
}

export const RelatedKeywords: React.FC<RelatedKeywordsProps> = ({ keywords, keyword }) => {
  return (
    <div
      className="rounded-3xl border border-[#26272c] shadow-2xl p-6 sm:p-8 space-y-5"
      style={{ backgroundColor: '#141416' }}
    >
      <div className="flex items-center space-x-2.5 pb-4 border-b border-[#202126]">
        <Tag className="w-5 h-5 text-[#A8FF1A]" />
        <div>
          <h3 className="text-lg font-bold tracking-tight text-white">
            크로스 플랫폼 연관 키워드 & 카피 추천
          </h3>
          <p className="text-xs text-[#AEAEAE] mt-0.5">
            ‘{keyword}’ 연관 키워드. ‘실제’는 플랫폼이 알려 준 연관 검색어, ‘예시’는 함께 검색해 볼 조합입니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {keywords.map((item, idx) => {
          let platformBadge = 'bg-[#202126] text-[#AEAEAE] border-[#2e2f36]';
          if (item.platform === '네이버') platformBadge = 'bg-[#1a1b1f] text-white border-white/20';
          if (item.platform === '구글') platformBadge = 'bg-[#1a1b1f] text-[#A8FF1A] border-[#A8FF1A]/30';
          if (item.platform === '인스타') platformBadge = 'bg-[#1a1b1f] text-[#AEAEAE] border-[#AEAEAE]/30';
          if (item.platform === '핀터') platformBadge = 'bg-[#1a1b1f] text-[#F34238] border-[#F34238]/30';

          return (
            <div
              key={idx}
              className="p-3.5 rounded-2xl border border-[#26272c] bg-[#1a1b1f] hover:border-[#3e404a] transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${platformBadge}`}>
                  {item.platform}
                </span>
                <span className="text-[10px] font-mono font-semibold text-[#AEAEAE]">
                  {item.is_live ? '실제' : '예시'}
                </span>
              </div>
              <div className="font-bold text-xs text-white group-hover:text-[#A8FF1A] transition-colors truncate" title={item.keyword}>
                {item.keyword}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
