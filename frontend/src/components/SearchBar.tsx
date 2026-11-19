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
    <div className="rounded-3xl border border-slate-200 bg-white shadow-xl p-6 sm:p-8 space-y-5 transition-all dark:border-[#26272c] dark:bg-[#141416]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-800 dark:bg-[#202126] dark:border-[#2e2f36] dark:text-[#A8FF1A] mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-[#A8FF1A]" />
            <span>CROSS-PLATFORM QUERY VOLUME & TREND INTELLIGENCE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            분석할 키워드를 입력하세요
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#AEAEAE] mt-1">
            네이버 데이터랩, 구글 트렌드, 메타 인스타그램의 크로스 채널 검색 관심도를 한 번에 비교 분석합니다.
          </p>
        </div>
      </div>

      {/* Main Search Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-[#AEAEAE]" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="키워드 입력 (예: 선크림, 러닝화, 린넨셔츠...)"
            disabled={isLoading}
            className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-full border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-medium focus:outline-none focus:border-emerald-600 dark:border-[#2e2f36] dark:bg-[#1a1b1f] dark:text-white dark:placeholder:text-[#6E6E6E] dark:focus:border-[#A8FF1A] transition-all shadow-inner"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !inputVal.trim()}
          className="ml-2.5 sm:ml-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#A8FF1A] hover:bg-[#b8ff33] text-black font-black text-sm tracking-tight transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-2 flex-shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              <span>수집 중...</span>
            </>
          ) : (
            <>
              <span>트렌드 통합 분석</span>
              <TrendingUp className="w-4 h-4 text-black" />
            </>
          )}
        </button>
      </form>

      {/* Quick Recommendation Chips */}
      <div className="flex items-center space-x-2 pt-1 overflow-x-auto text-xs">
        <span className="text-slate-500 dark:text-[#AEAEAE] font-mono font-bold flex-shrink-0 text-[11px] uppercase tracking-wider">
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
                  ? 'bg-[#A8FF1A] text-black font-black border-transparent shadow-[0_0_8px_rgba(168,255,26,0.3)]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200 dark:bg-[#1a1b1f] dark:hover:bg-[#202126] dark:text-[#AEAEAE] dark:hover:text-white dark:border-[#2e2f36]'
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
