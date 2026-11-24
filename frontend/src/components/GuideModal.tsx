import React, { useEffect } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  Layers,
  ExternalLink,
  Target,
} from 'lucide-react';
import { CAL_URL, BEP_URL } from '../constants/links';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="사용 가이드" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl max-h-[90vh] rounded-3xl border border-slate-200 bg-white dark:border-[#26272c] dark:bg-[#141416] shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white transition-colors">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-[#26272c] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-slate-100 border border-slate-200 text-emerald-700 dark:bg-[#202126] dark:border-[#2e2f36] dark:text-[#A8FF1A] rounded-2xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Omni Trend Tracker 활용 가이드
                </h2>
                <span className="text-[10px] font-mono font-bold bg-[#A8FF1A] text-black px-2 py-0.5 rounded-full">
                  USER GUIDE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#AEAEAE] mt-0.5">
                네이버·구글 두 채널의 데이터 특성과 마케팅·소재 기획에 쓰는 방법을 안내합니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-800 dark:bg-[#1a1b1f] dark:hover:bg-[#202126] dark:border-[#2e2f36] dark:text-[#AEAEAE] dark:hover:text-white transition-colors cursor-pointer"
            title="닫기 (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-600 dark:text-[#AEAEAE] text-xs leading-relaxed">
          {/* 1. Core Concept Banner */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 dark:border-[#26272c] dark:bg-[#1a1b1f] space-y-2">
            <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-[#A8FF1A]" />
              <span>왜 네이버와 구글을 함께 봐야 할까요?</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              두 검색 엔진은 이용자 행동(Intent)의 단계가 다릅니다.
              <strong>네이버</strong>는 국내 구매와 가격 비교, <strong>구글</strong>은 정보 탐색과 유튜브·해외 수요를 대변합니다.
              두 곡선이 같이 움직이면 수요가 넓게 퍼진 것이고, 한쪽만 오르면 특정 경로에서 생긴 관심입니다.
              일·주·월 단위를 바꿔 보면 하루짜리 화제인지 계절 수요인지 구분할 수 있습니다.
            </p>
          </div>

          {/* 2. Platform Profiles Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5 font-mono">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-[#A8FF1A]" />
              <span>채널별 데이터 해석 기준</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-[#1a1b1f] dark:border-[#26272c] space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white" />
                  <span>네이버 데이터랩 (Naver)</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[#AEAEAE]">
                  국내 이커머스 최종 구매 전환 의도를 가장 정밀하게 반영하는 표준 지표입니다.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-[#1a1b1f] dark:border-[#26272c] space-y-1.5">
                <div className="font-bold text-emerald-700 dark:text-[#A8FF1A] flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-[#A8FF1A]" />
                  <span>구글 트렌드 (Google)</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[#AEAEAE]">
                  정보 탐색과 롱테일 검색 수요를 봅니다. 통합 화면은 한국(KR) 기준이고, 구글 스튜디오에서 지역과 유튜브·쇼핑 검색을 고를 수 있습니다.
                </p>
              </div>

            </div>
          </div>

          {/* 3. Cross-Suite Practical Workflow */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 dark:border-[#26272c] dark:bg-[#1a1b1f] space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center space-x-2 font-mono">
              <Target className="w-4 h-4 text-emerald-600 dark:text-[#A8FF1A]" />
              <span>Marketing Suite 3단계 연계 추천 루틴</span>
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-start space-x-2">
                <span className="font-bold text-emerald-700 dark:text-[#A8FF1A] font-mono">01.</span>
                <span><strong>OTT</strong>에서 급상승 키워드와 채널별 관심도 흐름을 확인합니다. 성별·연령별 비교는 네이버 데이터랩 스튜디오에서 필터로 볼 수 있습니다.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-bold text-emerald-700 dark:text-[#A8FF1A] font-mono">02.</span>
                <span><strong>CAL</strong>에서 해외 검증된 30일+ 위너 광고 소재의 훅과 카피를 벤치마킹합니다.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-bold text-emerald-700 dark:text-[#A8FF1A] font-mono">03.</span>
                <span><strong>BEP Master</strong>에서 입점 플랫폼별 손익분기 ROAS와 최대 허용 CPC를 산출하여 입찰 상한선을 잠급니다.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 dark:border-[#26272c] dark:bg-[#1a1b1f] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <a
              href={BEP_URL}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono font-bold text-emerald-700 dark:text-[#A8FF1A] hover:underline flex items-center space-x-1"
            >
              <span>BEP Master 열기</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-400 dark:text-[#6E6E6E]">•</span>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono font-bold text-slate-600 dark:text-[#AEAEAE] hover:text-slate-900 dark:hover:text-white flex items-center space-x-1"
            >
              <span>CAL Lens 열기</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#A8FF1A] hover:bg-[#b8ff33] text-black font-extrabold text-xs transition cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
