import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { OverviewStats } from './components/OverviewStats';
import { UnifiedTrendChart } from './components/UnifiedTrendChart';
import { PlatformCards } from './components/PlatformCards';
import { RelatedKeywords } from './components/RelatedKeywords';
import { NaverDataLabStudio } from './components/NaverDataLabStudio';
import { GoogleTrendsStudio } from './components/GoogleTrendsStudio';
import { ApiConnectModal } from './components/ApiConnectModal';
import { GuideModal } from './components/GuideModal';
import { FeedbackModal } from './components/FeedbackModal';
import { DonationModal } from './components/DonationModal';
import { SuiteNavigationDrawer } from './components/SuiteNavigationDrawer';
import { SuiteFooter } from './components/SuiteFooter';
import { OTTLogo } from './components/OTTLogo';
import {
  OmniTrendResponse,
  DataLabSearchResponse,
  GoogleTrendsSearchResponse,
  ApiKeysStatus,
  TrendUnit,
} from './types';
import { AlertCircle, Loader2, Sparkles, Layers, Globe } from 'lucide-react';
import { useTheme } from './utils/useTheme';
import { DateRange } from './utils/trendUnit';

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<
    'cross_channel' | 'naver_datalab' | 'google_trends'
  >('cross_channel');

  // Cross-channel search state
  const [keyword, setKeyword] = useState<string>('');
  const [unit, setUnit] = useState<TrendUnit>('month');
  // null: the preset window for the unit (last 30 days / 52 weeks / 12 months)
  const [range, setRange] = useState<DateRange | null>(null);
  // Only the latest request may update the screen (switching units quickly sends several).
  const latestRequest = useRef(0);
  const [data, setData] = useState<OmniTrendResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Precision Studios loading states
  const [isDataLabLoading, setIsDataLabLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  // API Status & Modals
  const [apiStatus, setApiStatus] = useState<ApiKeysStatus | null>(null);
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [isDonationOpen, setIsDonationOpen] = useState<boolean>(false);
  const [isSuiteDrawerOpen, setIsSuiteDrawerOpen] = useState<boolean>(false);

  const fetchKeysStatus = async () => {
    try {
      const res = await fetch('/api/keys/status');
      if (res.ok) {
        const json: ApiKeysStatus = await res.json();
        setApiStatus(json);
      }
    } catch {
      // ignore
    }
  };

  const fetchTrend = async (query: string, period: TrendUnit = unit, chosen: DateRange | null = range) => {
    const requestId = ++latestRequest.current;
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setKeyword(query);

      const params = new URLSearchParams({ unit: period });
      if (chosen) {
        params.set('start', chosen.start);
        params.set('end', chosen.end);
      }
      const res = await fetch(`/api/trend/${encodeURIComponent(query)}?${params}`);
      if (!(res.headers.get('content-type') ?? '').includes('application/json')) {
        throw new Error('데이터 서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요. 직접 실행 중이라면 backend 서버(포트 8000)를 켜 주세요.');
      }
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail && typeof errJson.detail === 'string' ? errJson.detail : `데이터 조회 실패 (HTTP ${res.status})`);
      }
      const json: OmniTrendResponse = await res.json();
      if (requestId === latestRequest.current) setData(json);
    } catch (err: unknown) {
      console.error('Failed to fetch trend:', err);
      let msg = '트렌드 데이터를 불러오는 중 오류가 발생했습니다.';
      if (err instanceof Error) msg = err.message;
      if (requestId === latestRequest.current) setErrorMessage(msg);
    } finally {
      if (requestId === latestRequest.current) setIsLoading(false);
    }
  };

  const handleSearchDataLab = async (payload: {
    start_date: string;
    end_date: string;
    time_unit: 'date' | 'week' | 'month';
    keyword_groups: { group_name: string; keywords: string[] }[];
    device?: string;
    gender?: string;
    ages?: string[];
  }): Promise<DataLabSearchResponse | null> => {
    try {
      setIsDataLabLoading(true);
      const res = await fetch('/api/datalab/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `데이터랩 조회 실패 (HTTP ${res.status})`);
      }
      const resultJson: DataLabSearchResponse = await res.json();
      return resultJson;
    } catch (err: unknown) {
      console.error('DataLab custom search error:', err);
      alert(err instanceof Error ? err.message : '네이버 데이터랩 조회 중 오류가 발생했습니다.');
      return null;
    } finally {
      setIsDataLabLoading(false);
    }
  };

  const handleSearchGoogleTrends = async (payload: {
    keywords: string[];
    timeframe: string;
    geo: string;
    gprop: string;
  }): Promise<GoogleTrendsSearchResponse | null> => {
    try {
      setIsGoogleLoading(true);
      const res = await fetch('/api/google/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `구글 트렌드 조회 실패 (HTTP ${res.status})`);
      }
      return await res.json();
    } catch (err: unknown) {
      console.error('Google Trends error:', err);
      alert(err instanceof Error ? err.message : '구글 트렌드 조회 중 오류가 발생했습니다.');
      return null;
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // No search on page load: each lookup calls the platform APIs (and their quotas),
  // and a page without a data server should not open on an error.
  useEffect(() => {
    fetchKeysStatus();
  }, []);

  return (
    <div className="min-h-screen text-slate-900 dark:text-white flex flex-col font-sans monotone-canvas transition-colors">
      {/* ── Top Navigation ── */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenDonation={() => setIsDonationOpen(true)}
        onOpenSuiteDrawer={() => setIsSuiteDrawerOpen(true)}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* ── Mode Selection Tabs (Sticky Below Header) ── */}
      <div className="border-b border-slate-200 dark:border-[#202126] bg-white/90 dark:bg-[#141416]/90 backdrop-blur-md sticky top-[65px] z-30 transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2.5 overflow-x-auto gap-3">
          <div className="flex items-center space-x-2">
            {/* Tab 1: Cross-Channel Trend */}
            <button
              type="button"
              onClick={() => setActiveTab('cross_channel')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'cross_channel'
                  ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#AEAEAE] dark:hover:text-white dark:hover:bg-[#202126]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-500 dark:text-[#A8FF1A]" />
              <span>크로스 채널 트렌드 통합</span>
            </button>

            {/* Tab 2: Naver DataLab Studio */}
            <button
              type="button"
              onClick={() => setActiveTab('naver_datalab')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'naver_datalab'
                  ? 'bg-[#03C75A] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#AEAEAE] dark:hover:text-white dark:hover:bg-[#202126]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>네이버 데이터랩 정밀 분석</span>
            </button>

            {/* Tab 3: Google Trends Studio */}
            <button
              type="button"
              onClick={() => setActiveTab('google_trends')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'google_trends'
                  ? 'bg-[#4285F4] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#AEAEAE] dark:hover:text-white dark:hover:bg-[#202126]'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>구글 트렌드 정밀 비교</span>
            </button>

          </div>
        </div>
      </div>

      {/* ── Main Dashboard Workspace ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {activeTab === 'cross_channel' && (
          <>
            {/* Search Bar */}
            <SearchBar
              onSearch={(kw) => fetchTrend(kw)}
              isLoading={isLoading}
              currentKeyword={keyword}
              unit={unit}
              range={range}
              onPeriodChange={(nextUnit, nextRange) => {
                setUnit(nextUnit);
                setRange(nextRange);
                // Re-run the current keyword; before the first search just remember the choice.
                if (keyword) fetchTrend(keyword, nextUnit, nextRange);
              }}
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
                  채널별 트렌드 수집 및 지수화 중...
                </p>
              </div>
            )}

            {/* Empty state before the first search */}
            {!data && !isLoading && !errorMessage && (
              <div className="py-16 px-6 flex flex-col items-center justify-center space-y-2 rounded-3xl border border-dashed border-slate-300 bg-white/60 text-center dark:border-[#2e2f36] dark:bg-[#141416]/60 transition-colors">
                <p className="text-sm font-bold text-slate-800 dark:text-white">키워드를 입력하고 검색해 보세요</p>
                <p className="text-xs text-slate-500 dark:text-[#AEAEAE]">
                  네이버와 구글의 검색 관심도를 일·주·월 단위로 한 차트에서 비교합니다. 예: 선크림, 러닝화, 린넨셔츠
                </p>
              </div>
            )}

            {/* Results View */}
            {data && (
              <div className="space-y-8 animate-fadeIn">
                <OverviewStats data={data} />
                <UnifiedTrendChart timeline={data.timeline} keyword={data.keyword} platforms={data.platforms} unit={data.unit} custom={data.custom} start={data.start} end={data.end} />
                <PlatformCards platforms={data.platforms} custom={data.custom} />
                <RelatedKeywords keywords={data.cross_platform_keywords} keyword={data.keyword} />
              </div>
            )}
          </>
        )}

        {/* ── Naver DataLab Precision Studio Mode ── */}
        {activeTab === 'naver_datalab' && (
          <NaverDataLabStudio
            onSearchDataLab={handleSearchDataLab}
            isLoading={isDataLabLoading}
          />
        )}

        {/* ── Google Trends Precision Studio Mode ── */}
        {activeTab === 'google_trends' && (
          <GoogleTrendsStudio
            onSearchGoogleTrends={handleSearchGoogleTrends}
            isLoading={isGoogleLoading}
          />
        )}

      </main>

      {/* ── Global Footer ── */}
      <SuiteFooter
        appName="OTT (Omni Trend Tracker)"
        emblem={<OTTLogo size={36} />}
        privacyUrl="/privacy.html"
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenDonation={() => setIsDonationOpen(true)}
      />

      {/* ── Global Modals ── */}
      <ApiConnectModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        status={apiStatus}
      />
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
