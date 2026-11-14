import React from 'react';
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-3xl max-h-[90vh] rounded-3xl border border-[#26272c] shadow-2xl overflow-hidden flex flex-col"
        style={{ backgroundColor: '#141416' }}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#26272c] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#202126] border border-[#2e2f36] text-[#A8FF1A] rounded-2xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Omni Trend Tracker 활용 가이드
                </h2>
                <span className="text-[10px] font-mono font-bold bg-[#A8FF1A] text-black px-2 py-0.5 rounded-full">
                  USER GUIDE
                </span>
              </div>
              <p className="text-xs text-[#AEAEAE] mt-0.5">
                4대 플랫폼의 데이터 특성과 실무 마케팅/소재 기획 연계 노하우를 안내해 드립니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-[#1a1b1f] hover:bg-[#202126] border border-[#2e2f36] text-[#AEAEAE] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-[#AEAEAE] text-xs leading-relaxed">
          {/* 1. Core Concept Banner */}
          <div className="p-4 rounded-2xl border border-[#26272c] bg-[#1a1b1f] space-y-2">
            <div className="flex items-center space-x-2 text-white font-bold text-sm">
              <Sparkles className="w-4 h-4 text-[#A8FF1A]" />
              <span>왜 단일 플랫폼이 아닌 4대 채널 통합 조회가 필요할까요?</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              각 플랫폼은 이용자 행동(Intent)의 단계가 완전히 다릅니다.
              <strong>네이버</strong>는 즉각적 구매와 가격 비교, <strong>구글</strong>은 심층 정보 탐색과 글로벌 수요,
              <strong>인스타그램</strong>은 시각적 발견과 충동 구매, <strong>핀터레스트</strong>는 시즌 선행 탐색을 대변합니다.
            </p>
          </div>

          {/* 2. Platform Profiles Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5 font-mono">
              <Layers className="w-4 h-4 text-[#A8FF1A]" />
              <span>4대 플랫폼별 데이터 해석 기준</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#1a1b1f] border border-[#26272c] space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span>네이버 데이터랩 (Naver)</span>
                </div>
                <p className="text-[11px] text-[#AEAEAE]">
                  국내 이커머스 최종 구매 전환 의도를 가장 정밀하게 반영하는 표준 지표입니다.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#1a1b1f] border border-[#26272c] space-y-1.5">
                <div className="font-bold text-[#A8FF1A] flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#A8FF1A]" />
                  <span>구글 트렌드 (Google)</span>
                </div>
                <p className="text-[11px] text-[#AEAEAE]">
                  글로벌 관심도 및 기술/정보성 롱테일 검색 수요를 추적하기에 최적화된 지수입니다.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#1a1b1f] border border-[#26272c] space-y-1.5">
                <div className="font-bold text-[#AEAEAE] flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#AEAEAE]" />
                  <span>인스타그램 (Meta)</span>
                </div>
                <p className="text-[11px] text-[#AEAEAE]">
                  비주얼 트렌드와 바이럴 태그 언급량을 기반으로 소구점 확장 아이디어를 도출합니다.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#1a1b1f] border border-[#26272c] space-y-1.5">
                <div className="font-bold text-[#F34238] flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F34238]" />
                  <span>핀터레스트 (Pinterest)</span>
                </div>
                <p className="text-[11px] text-[#AEAEAE]">
                  시즌 시작 1~2개월 전 기획 단계의 무드보드 및 선행 검색 패턴을 포착합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Cross-Suite Practical Workflow */}
          <div className="p-4 rounded-2xl border border-[#26272c] bg-[#1a1b1f] space-y-3">
            <h4 className="font-bold text-white text-xs flex items-center space-x-2 font-mono">
              <Target className="w-4 h-4 text-[#A8FF1A]" />
              <span>Marketing Suite 3단계 연계 추천 루틴</span>
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-start space-x-2">
                <span className="font-bold text-[#A8FF1A] font-mono">01.</span>
                <span><strong>OTT</strong>에서 급상승 키워드와 연령·성별 오디언스 프로필을 확인합니다.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-bold text-[#A8FF1A] font-mono">02.</span>
                <span><strong>CAL</strong>에서 해외 검증된 30일+ 위너 광고 소재의 훅과 카피를 벤치마킹합니다.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-bold text-[#A8FF1A] font-mono">03.</span>
                <span><strong>BEP Master</strong>에서 입점 플랫폼별 손익분기 ROAS와 최대 허용 CPC를 산출하여 입찰 상한선을 잠급니다.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#26272c] bg-[#1a1b1f] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <a
              href={BEP_URL}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono font-bold text-[#A8FF1A] hover:underline flex items-center space-x-1"
            >
              <span>BEP Master 열기</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-[#6E6E6E]">•</span>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono font-bold text-[#AEAEAE] hover:text-white flex items-center space-x-1"
            >
              <span>CAL Lens 열기</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#A8FF1A] hover:bg-[#b8ff33] text-black font-extrabold text-xs transition"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
