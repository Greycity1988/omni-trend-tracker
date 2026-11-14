import React from 'react';
import {
  Github,
  ExternalLink,
  BookOpen,
  MessageSquare,
  Coffee,
  Sparkles,
} from 'lucide-react';
import { OTTLogo } from './OTTLogo';

interface HeaderProps {
  onOpenGuide?: () => void;
  onOpenFeedback?: () => void;
  onOpenDonation?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  onOpenFeedback,
  onOpenDonation,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-line/90 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 sm:space-x-3.5">
          <div className="p-1 rounded-2xl bg-canvas hover:bg-canvas-subtle border border-line transition-all flex-shrink-0">
            <OTTLogo size={42} showText={false} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold tracking-wider text-accent bg-accent-light px-2 py-0.5 rounded-md border border-accent/15">
                OTT
              </span>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-ink-primary">
                Omni Trend Tracker
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-canvas-subtle border border-line text-ink-secondary">
                v1.1 Pro
              </span>
            </div>
            <p className="text-[11px] text-ink-muted hidden sm:block">
              네이버 데이터랩 • 구글 트렌드 • 핀터레스트 • 메타 인스타그램 4대 채널 크로스 인텔리전스
            </p>
          </div>
        </div>

        {/* Action Buttons & Ecosystem Nav */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Guide Modal Button */}
          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-surface hover:bg-canvas-subtle border border-line text-xs font-semibold text-ink-secondary hover:text-ink-primary transition-all cursor-pointer shadow-2xs"
              title="사용 가이드 및 데이터 해석 기준 보기"
            >
              <BookOpen className="w-3.5 h-3.5 text-accent" />
              <span className="hidden md:inline">가이드</span>
            </button>
          )}

          {/* Feedback Modal Button */}
          {onOpenFeedback && (
            <button
              type="button"
              onClick={onOpenFeedback}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-surface hover:bg-canvas-subtle border border-line text-xs font-semibold text-ink-secondary hover:text-ink-primary transition-all cursor-pointer shadow-2xs"
              title="기능 제안 및 건의사항 남기기"
            >
              <MessageSquare className="w-3.5 h-3.5 text-accent" />
              <span className="hidden md:inline">건의하기</span>
            </button>
          )}

          {/* Donation Modal Button */}
          {onOpenDonation && (
            <button
              type="button"
              onClick={onOpenDonation}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#FFDD00]/15 hover:bg-[#FFDD00]/25 text-amber-900 dark:text-amber-300 border border-amber-300/40 dark:border-amber-700/40 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="개발자 커피 후원하기"
            >
              <Coffee className="w-3.5 h-3.5 text-amber-600 dark:text-[#FFDD00]" />
              <span className="hidden sm:inline">커피 후원</span>
            </button>
          )}

          {/* ACV Inter-service Link Switcher */}
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-accent text-white hover:bg-accent/90 border border-accent text-xs font-bold transition-all shadow-soft-xs cursor-pointer ml-1"
            title="32대 매체 430+ 지면 광고 소재 규격 자동 검수 도구(ACV)로 이동"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent-mint" />
            <span className="font-mono">ACV</span>
            <span className="hidden lg:inline font-sans font-semibold">소재 검수</span>
            <ExternalLink className="w-3 h-3 text-white/80" />
          </a>

          {/* GitHub Link */}
          <a
            href="https://github.com/Greycity1988/omni-trend-tracker"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center space-x-1.5 p-2 rounded-xl bg-surface hover:bg-canvas-subtle border border-line text-ink-secondary hover:text-ink-primary transition-all shadow-2xs"
            title="GitHub 저장소"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
