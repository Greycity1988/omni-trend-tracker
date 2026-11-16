import React from 'react';
import {
  MessageSquare,
  Coffee,
  HelpCircle,
  TrendingUp,
  Menu,
} from 'lucide-react';
import { Theme } from '../utils/useTheme';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onOpenGuide?: () => void;
  onOpenFeedback?: () => void;
  onOpenDonation?: () => void;
  onOpenSuiteDrawer?: () => void;
  onOpenApiModal?: () => void;
  theme?: Theme;
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  onOpenFeedback,
  onOpenDonation,
  onOpenSuiteDrawer,
  onOpenApiModal,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="border-b sticky top-0 z-40 shadow-sm transition-colors bg-white border-slate-200 dark:bg-[#141416] dark:border-[#26272c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Identity */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white font-mono font-black text-sm tracking-tighter shadow-inner flex-shrink-0 dark:bg-[#000000] dark:border-[#26272c]">
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-[#A8FF1A]" strokeWidth={2.5} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2 flex-wrap">
              <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                Omni Trend Tracker
              </h1>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#A8FF1A] text-black tracking-wide uppercase font-mono shadow-[0_0_8px_rgba(168,255,26,0.3)]">
                Cross-Channel
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#AEAEAE] tracking-tight font-medium hidden sm:block truncate">
              네이버 데이터랩 • 구글 트렌드 • 메타 인스타그램 크로스 채널 인텔리전스
            </p>
          </div>
        </div>

        {/* English Pill Buttons & Theme Toggle */}
        <div className="flex items-center flex-wrap gap-2">
          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 transition shadow-sm cursor-pointer whitespace-nowrap dark:bg-[#202126] dark:hover:bg-[#2c2d33] dark:text-white dark:border-[#2e2f36]"
              title="사용 가이드 및 데이터 해석 기준 보기"
            >
              <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-600 dark:text-[#A8FF1A]" strokeWidth={2} />
              <span>Guide</span>
            </button>
          )}

          {onOpenFeedback && (
            <button
              type="button"
              onClick={onOpenFeedback}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 transition shadow-sm cursor-pointer whitespace-nowrap dark:bg-[#202126] dark:hover:bg-[#2c2d33] dark:text-white dark:border-[#2e2f36]"
              title="새로운 기능 제안 및 건의사항 남기기"
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-slate-500 dark:text-[#AEAEAE]" strokeWidth={2} />
              <span>Feedback</span>
            </button>
          )}

          {onOpenDonation && (
            <button
              type="button"
              onClick={onOpenDonation}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 transition shadow-sm cursor-pointer whitespace-nowrap dark:bg-[#202126] dark:hover:bg-[#2c2d33] dark:text-white dark:border-[#2e2f36]"
              title="개발자에게 커피 한 잔 후원하기"
            >
              <Coffee className="w-3.5 h-3.5 mr-1.5 text-amber-500 dark:text-[#AEAEAE]" strokeWidth={2} />
              <span>Coffee</span>
            </button>
          )}

          {onOpenApiModal && (
            <button
              type="button"
              onClick={onOpenApiModal}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 transition shadow-sm cursor-pointer whitespace-nowrap dark:bg-[#202126] dark:hover:bg-[#2c2d33] dark:text-white dark:border-[#2e2f36]"
              title="플랫폼 API 연동 상태 및 실제 데이터 연결"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#A8FF1A] mr-1.5 shadow-[0_0_6px_#03C75A]" />
              <span>API 연동</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          {theme && onToggleTheme && (
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          )}

          {/* Suite Drawer Trigger Button */}
          {onOpenSuiteDrawer && (
            <button
              type="button"
              onClick={onOpenSuiteDrawer}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 transition shadow-sm ml-1 cursor-pointer whitespace-nowrap dark:bg-[#202126] dark:hover:bg-[#2c2d33] dark:text-white dark:border-[#2e2f36]"
              title="마케팅 스위트 전체 서비스 이동"
            >
              <Menu className="w-4 h-4 mr-1.5 text-slate-800 dark:text-[#A8FF1A]" />
              <span>Suite</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
