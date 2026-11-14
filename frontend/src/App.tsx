import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { OverviewStats } from './components/OverviewStats';
import { UnifiedTrendChart } from './components/UnifiedTrendChart';
import { PlatformCards } from './components/PlatformCards';
import { RelatedKeywords } from './components/RelatedKeywords';
import { GuideModal } from './components/GuideModal';
import { FeedbackModal } from './components/FeedbackModal';
import { DonationModal } from './components/DonationModal';
import { OmniTrendResponse } from './types';
import { AlertCircle, Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const [keyword, setKeyword] = useState<string>('선크림');
  const [data, setData] = useState<OmniTrendResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals state
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [isDonationOpen, setIsDonationOpen] = useState<boolean>(false);

  const fetchTrend = async (query: string) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setKeyword(query);

      const res = await fetch(`/api/trend/${encodeURIComponent(query)}`);
      // The public page has no data server yet: /api answers with the host's HTML 404.
      if (!(res.headers.get('content-type') ?? '').includes('application/json')) {
        throw new Error('데이터 서버가 연결되어 있지 않아 조회할 수 없습니다. 공개 페이지의 조회 기능은 준비 중입니다.');
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
    <div className="min-h-screen bg-canvas text-ink-primary font-sans antialiased flex flex-col selection:bg-accent/15 selection:text-accent">
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenDonation={() => setIsDonationOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Search Bar */}
        <SearchBar
          onSearch={(kw) => fetchTrend(kw)}
          isLoading={isLoading}
          currentKeyword={keyword}
        />

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start space-x-3 text-rose-800 shadow-soft-xs">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-status-fail" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold">분석 처리 오류: </span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Loading Spinner State */}
        {isLoading && !data && (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p className="text-xs sm:text-sm text-ink-secondary font-medium">
              네이버, 구글, 인스타그램 트렌드 수집 중...
            </p>
          </div>
        )}

        {/* Results View */}
        {data && (
          <div className="space-y-8 animate-fadeIn">
            <OverviewStats data={data} />
            <UnifiedTrendChart timeline={data.timeline} keyword={data.keyword} platforms={data.platforms} />
            <PlatformCards platforms={data.platforms} />
            <RelatedKeywords keywords={data.cross_platform_keywords} keyword={data.keyword} />
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-line bg-surface/80 backdrop-blur-sm py-10 text-center text-xs text-ink-muted space-y-2 flex flex-col items-center justify-center">
        <p className="font-semibold text-ink-primary text-sm tracking-tight">
          Omni Trend Tracker • Multi-channel Trend & Volume Intelligence
        </p>
        <p className="text-xs text-ink-secondary font-medium">
          Naver DataLab • Google Trends • Meta Instagram
        </p>
        <p className="text-[11px] text-ink-muted">
          Created with passion in 2026 by Owen O. Magnus
        </p>
      </footer>

      {/* Global Modals */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
    </div>
  );
};
export default App;
