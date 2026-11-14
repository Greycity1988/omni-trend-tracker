import React, { useState } from 'react';
import { Search, Loader2, Sparkles, TrendingUp } from 'lucide-react';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  isLoading: boolean;
  currentKeyword: string;
}

const POPULAR_KEYWORDS = [
  '선크림',
  '러닝화',
  '린넨셔츠',
  '캠핑의자',
  '오마카세',
  '단백질보충제',
  '기능성베개',
];

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, currentKeyword }) => {
  const [inputVal, setInputVal] = useState(currentKeyword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim());
    }
  };

  const handleChipClick = (kw: string) => {
    setInputVal(kw);
    onSearch(kw);
  };

  return (
    <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-black/[0.06] shadow-lifemed p-6 sm:p-8 space-y-5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/[0.04] border border-black/[0.06] text-xs font-semibold text-ink-secondary mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>크로스 플랫폼 키워드 쿼리량 & 트렌드 인텔리전스</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-primary">
            분석할 키워드를 입력하세요
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary mt-1">
            네이버 검색 지수와 구글 관심도를 한 번에 비교합니다. 인스타그램은 예시 데이터이며, 핀터레스트는 준비 중입니다.
          </p>
        </div>
      </div>

      {/* Main Search Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="키워드 입력 (예: 선크림, 러닝화, 린넨셔츠...)"
            disabled={isLoading}
            className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-full border border-black/[0.08] bg-white text-ink-primary placeholder:text-neutral-400 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all shadow-soft-xs"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !inputVal.trim()}
          className="ml-2.5 sm:ml-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#0A0A0A] hover:bg-neutral-800 text-white font-semibold text-sm tracking-tight transition-all shadow-soft-sm hover:shadow-soft-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-2 flex-shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>플랫폼 데이터 수집 중...</span>
            </>
          ) : (
            <>
              <span>트렌드 통합 분석</span>
              <TrendingUp className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Quick Recommendation Chips */}
      <div className="flex items-center space-x-2 pt-1 overflow-x-auto text-xs">
        <span className="text-ink-muted font-bold flex-shrink-0 text-[11px] uppercase tracking-wider">
          추천 키워드:
        </span>
        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1.5">
          {POPULAR_KEYWORDS.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => handleChipClick(kw)}
              disabled={isLoading}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                inputVal === kw
                  ? 'bg-[#0A0A0A] text-white border-black shadow-soft-xs'
                  : 'bg-white hover:bg-neutral-50 text-ink-secondary hover:text-ink-primary border-black/[0.08] hover:border-black/20'
              }`}
            >
              {kw}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
