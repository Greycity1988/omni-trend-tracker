import React from 'react';
import { CrossPlatformKeyword } from '../types';
import { Tag } from 'lucide-react';

interface RelatedKeywordsProps {
  keywords: CrossPlatformKeyword[];
  keyword: string;
}

export const RelatedKeywords: React.FC<RelatedKeywordsProps> = ({ keywords, keyword }) => {
  return (
    <div className="bg-surface rounded-3xl border border-line shadow-soft-sm p-6 sm:p-8 space-y-5">
      <div className="flex items-center space-x-2.5 pb-4 border-b border-line/60">
        <Tag className="w-5 h-5 text-accent" />
        <div>
          <h3 className="text-lg font-bold tracking-tight text-ink-primary">
            크로스 플랫폼 연관 키워드 & 카피 추천
          </h3>
          <p className="text-xs text-ink-secondary mt-0.5">
            ‘{keyword}’ 연관 키워드. ‘실제’는 플랫폼이 알려 준 연관 검색어, ‘예시’는 함께 검색해 볼 조합입니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {keywords.map((item, idx) => {
          let platformColor = 'bg-accent/5 text-accent border-accent/20';
          if (item.platform === '네이버') platformColor = 'bg-[#03C75A]/10 text-[#03C75A] border-[#03C75A]/20';
          if (item.platform === '구글') platformColor = 'bg-[#4285F4]/10 text-[#4285F4] border-[#4285F4]/20';
          if (item.platform === '인스타') platformColor = 'bg-[#E1306C]/10 text-[#E1306C] border-[#E1306C]/20';
          if (item.platform === '핀터') platformColor = 'bg-[#E60023]/10 text-[#E60023] border-[#E60023]/20';

          return (
            <div
              key={idx}
              className="p-3.5 rounded-2xl border border-line bg-canvas-subtle/50 hover:bg-surface hover:border-line-strong hover:shadow-soft-xs transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${platformColor}`}>
                  {item.platform}
                </span>
                <span className="text-[10px] font-semibold text-ink-muted">
                  {item.is_live ? '실제' : '예시'}
                </span>
              </div>
              <div className="font-bold text-xs text-ink-primary group-hover:text-accent transition-colors truncate" title={item.keyword}>
                {item.keyword}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
