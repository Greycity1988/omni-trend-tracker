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
    <div
      className="rounded-3xl border border-[#26272c] shadow-2xl p-6 sm:p-8 space-y-5 transition-all"
      style={{ backgroundColor: '#141416' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#202126] border border-[#2e2f36] text-xs font-mono font-bold text-[#A8FF1A] mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#A8FF1A]" />
            <span>CROSS-PLATFORM QUERY VOLUME & TREND INTELLIGENCE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            분석할 키워드를 입력하세요
          </h2>
          <p className="text-xs sm:text-sm text-[#AEAEAE] mt-1">
            네이버 검색 지수와 구글 관심도를 한 번에 비교합니다. 인스타그램은 예시 데이터이며, 핀터레스트는 준비 중입니다.
          </p>
        </div>
      </div>

      {/* Main Search Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AEAEAE]" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="키워드 입력 (예: 선크림, 러닝화, 린넨셔츠...)"
            disabled={isLoading}
            className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-full border border-[#2e2f36] bg-[#1a1b1f] text-white placeholder:text-[#6E6E6E] text-sm sm:text-base font-medium focus:outline-none focus:border-[#A8FF1A] transition-all shadow-inner"
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
        <span className="text-[#AEAEAE] font-mono font-bold flex-shrink-0 text-[11px] uppercase tracking-wider">
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
                  : 'bg-[#1a1b1f] hover:bg-[#202126] text-[#AEAEAE] hover:text-white border-[#2e2f36]'
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
