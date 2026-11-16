import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { OverviewStats } from './components/OverviewStats';
import { UnifiedTrendChart } from './components/UnifiedTrendChart';
import { PlatformCards } from './components/PlatformCards';
import { DemographicsChart } from './components/DemographicsChart';
import { RelatedKeywords } from './components/RelatedKeywords';
import { GuideModal } from './components/GuideModal';
import { FeedbackModal } from './components/FeedbackModal';
import { DonationModal } from './components/DonationModal';
import { SuiteNavigationDrawer } from './components/SuiteNavigationDrawer';
import { OmniTrendResponse } from './types';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useTheme } from './utils/useTheme';

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [keyword, setKeyword] = useState<string>('선크림');
  const [data, setData] = useState<OmniTrendResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals state
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [isDonationOpen, setIsDonationOpen] = useState<boolean>(false);
  const [isSuiteDrawerOpen, setIsSuiteDrawerOpen] = useState<boolean>(false);

  const fetchTrend = async (query: string) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setKeyword(query);

      const res = await fetch(`/api/trend/${encodeURIComponent(query)}`);
      // The public page has no data server yet: /api answers with the host's HTML 404.
      if (!(res.headers.get('content-type') ?? '').includes('application/json')) {
        throw new Error('데이터 서버가 연결되어 있지 않아 조회할 수 없습니다. 로컬 백엔드 서버(포트 8000)를 가동해 주세요.');
      }
      if (!res.ok) {
        throw new Error(`데이터 조회 실패 (HTTP ${res.status})`);
      }
      const json: OmniTrendResponse = await res.json();
      setData(json);
    } catch (err: unknown) {
      console.error('Failed to fetch trend:', err);
      let msg = '트렌드 데이터를 불러오는 중 오류가 발생했습니다.';
      if (err instanceof Error) msg = err.message;
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrend('선크림');
  }, []);

  return (
    <div className="min-h-screen text-slate-900 dark:text-white flex flex-col font-sans monotone-canvas transition-colors">
      {/* ── Top Navigation ── */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenDonation={() => setIsDonationOpen(true)}
        onOpenSuiteDrawer={() => setIsSuiteDrawerOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* ── Main Dashboard Workspace ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Search Bar */}
        <SearchBar
          onSearch={(kw) => fetchTrend(kw)}
          isLoading={isLoading}
          currentKeyword={keyword}
        />

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-5 rounded-3xl border border-red-300 dark:border-[#F34238]/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-red-50 text-red-900 dark:bg-[#141416] dark:text-white transition-colors">
            <div className="flex items-start space-x-3.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600 dark:text-[#F34238]" />
              <div className="text-xs sm:text-sm space-y-1">
                <span className="font-bold">분석 처리 알림: </span>
                <span className="text-red-700 dark:text-[#AEAEAE]">{errorMessage}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => fetchTrend(keyword)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white dark:bg-[#F34238] dark:hover:bg-[#d8352c] transition-colors flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
            >
              다시 시도 (데이터 불러오기)
            </button>
          </div>
        )}

        {/* Loading Spinner State */}
        {isLoading && !data && (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-[#26272c] dark:bg-[#141416] transition-colors">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-[#A8FF1A]" />
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#AEAEAE] font-mono font-medium">
              네이버, 구글, 핀터레스트, 인스타그램 트렌드 수집 및 지수화 중...
            </p>
          </div>
        )}

        {/* Results View */}
        {data && (
          <div className="space-y-8 animate-fadeIn">
            <OverviewStats data={data} />
            <UnifiedTrendChart timeline={data.timeline} keyword={data.keyword} platforms={data.platforms} />
            <PlatformCards platforms={data.platforms} />
            <DemographicsChart
              naverDemo={data.platforms.naver?.demographics}
              pinterestDemo={data.platforms.pinterest?.demographics}
              metaDemo={data.platforms.meta?.demographics}
            />
            <RelatedKeywords keywords={data.cross_platform_keywords} keyword={data.keyword} />
          </div>
        )}
      </main>

      {/* ── Global Footer ── */}
      <footer className="mt-auto border-t border-slate-200 py-8 text-center text-xs text-slate-500 space-y-1.5 transition-colors bg-white dark:border-[#26272c] dark:bg-[#141416] dark:text-[#AEAEAE]">
        <p className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
          OTT — Omni Trend Tracker • Multi-channel Trend & Volume Intelligence
        </p>
        <p className="text-xs text-slate-500 dark:text-[#AEAEAE] font-mono">
          Naver DataLab • Google Trends • Meta Instagram • ACV · CAL · BEP Master 패밀리 스위트
        </p>
      </footer>

      {/* ── Global Modals ── */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
      <SuiteNavigationDrawer
        isOpen={isSuiteDrawerOpen}
        onClose={() => setIsSuiteDrawerOpen(false)}
        currentApp="ott"
      />
    </div>
  );
};

export default App;
