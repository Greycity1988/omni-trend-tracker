import React from 'react';
import {
  MessageSquare,
  Coffee,
  HelpCircle,
  TrendingUp,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  onOpenGuide?: () => void;
  onOpenFeedback?: () => void;
  onOpenDonation?: () => void;
  onOpenSuiteDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  onOpenFeedback,
  onOpenDonation,
  onOpenSuiteDrawer,
}) => {
  return (
    <header
      className="border-b border-[#26272c] sticky top-0 z-40 shadow-xl"
      style={{ backgroundColor: '#141416' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Identity */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-[#000000] border border-[#26272c] flex items-center justify-center text-white font-mono font-black text-sm tracking-tighter shadow-inner flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-[#A8FF1A]" strokeWidth={2.5} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2 flex-wrap">
              <h1 className="text-base font-extrabold text-white tracking-tight whitespace-nowrap">
                Omni Trend Tracker
              </h1>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#A8FF1A] text-black tracking-wide uppercase font-mono shadow-[0_0_8px_rgba(168,255,26,0.3)]">
                Cross-Channel
              </span>
            </div>
            <p className="text-[11px] text-[#AEAEAE] tracking-tight font-medium hidden sm:block truncate">
              네이버 데이터랩 • 구글 트렌드 • 메타 인스타그램 크로스 채널 인텔리전스
            </p>
          </div>
        </div>

        {/* English Pill Buttons (Image 6 reference) */}
        <div className="flex items-center flex-wrap gap-2">
          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-full text-white bg-[#202126] hover:bg-[#2c2d33] border border-[#2e2f36] transition shadow-sm"
              title="사용 가이드 및 데이터 해석 기준 보기"
            >
              <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-[#A8FF1A]" strokeWidth={2} />
              Guide
            </button>
          )}

          {onOpenFeedback && (
            <button
              type="button"
              onClick={onOpenFeedback}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-full text-white bg-[#202126] hover:bg-[#2c2d33] border border-[#2e2f36] transition shadow-sm"
              title="새로운 기능 제안 및 건의사항 남기기"
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-[#AEAEAE]" strokeWidth={2} />
              Feedback
            </button>
          )}

          {onOpenDonation && (
            <button
              type="button"
              onClick={onOpenDonation}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-full text-white bg-[#202126] hover:bg-[#2c2d33] border border-[#2e2f36] transition shadow-sm"
              title="개발자에게 커피 한 잔 후원하기"
            >
              <Coffee className="w-3.5 h-3.5 mr-1.5 text-[#AEAEAE]" strokeWidth={2} />
              Coffee
            </button>
          )}

          {/* Suite Drawer Trigger Button */}
          {onOpenSuiteDrawer && (
            <button
              type="button"
              onClick={onOpenSuiteDrawer}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-full text-white bg-[#202126] hover:bg-[#2c2d33] border border-[#2e2f36] transition shadow-sm ml-1 cursor-pointer"
              title="마케팅 스위트 전체 서비스 이동"
            >
              <Menu className="w-4 h-4 mr-1.5 text-[#A8FF1A]" />
              <span>Suite</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
