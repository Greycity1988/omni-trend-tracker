import React from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  Layers,
  CheckCircle2,
  ExternalLink,
  Target,
} from 'lucide-react';
import { ACV_URL } from '../constants/links';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface rounded-3xl shadow-soft-lg border border-line w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-6 border-b border-line flex items-center justify-between bg-surface flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-accent text-white rounded-2xl shadow-soft-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-ink-primary">
                  Omni Trend Tracker 활용 가이드
                </h2>
                <span className="text-[10px] font-mono font-semibold bg-canvas-subtle text-ink-secondary border border-line px-2 py-0.5 rounded-full">
                  User Guide
                </span>
              </div>
              <p className="text-xs text-ink-secondary mt-0.5">
                4대 플랫폼의 데이터 특성과 실무 마케팅/소재 기획 연계 노하우를 안내해 드립니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-ink-muted hover:text-ink-primary hover:bg-canvas-subtle transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-ink-secondary text-xs leading-relaxed">
          {/* 1. Core Concept Banner */}
          <div className="p-4 rounded-2xl border border-line bg-canvas-subtle/60 space-y-2">
            <div className="flex items-center space-x-2 text-ink-primary font-bold text-sm">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>왜 단일 플랫폼이 아닌 4대 채널 통합 조회가 필요할까요?</span>
            </div>
            <p className="leading-relaxed">
              소비자의 구매 여정은 한 곳에서만 일어나지 않습니다. 
              <strong>핀터레스트</strong>에서 2~3달 전 영감을 모으고, <strong>인스타그램</strong>에서 최신 트렌드를 확인한 뒤, <strong>네이버와 구글</strong>에서 가격과 스펙을 검색하여 최종 구매합니다. 
              Omni Trend Tracker는 이 전체 퍼널(Funnel)을 하나의 화면에서 비교할 수 있도록 설계되었습니다.
            </p>
          </div>

          {/* 2. Platform Intelligence Matrix */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-ink-primary uppercase tracking-wider flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-accent" />
              <span>4대 플랫폼별 데이터 해석 기준</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Naver */}
              <div className="p-4 rounded-2xl border border-line bg-surface shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-bold text-ink-primary">
                    <span className="text-base">🟩</span>
                    <span>네이버 데이터랩 (Naver)</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    실제 구매 의도
                  </span>
                </div>
                <p className="text-[11.5px] text-ink-muted">
                  국내 최대 쇼핑·검색 포털 데이터입니다. 검색 지수(0~100)는 기간 내 최다 검색량을 100으로 환산한 비율이며, 실제 이커머스 장바구니 전환 및 구매 직전 탐색 볼륨을 가장 정밀하게 대변합니다.
                </p>
              </div>

              {/* Google */}
              <div className="p-4 rounded-2xl border border-line bg-surface shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-bold text-ink-primary">
                    <span className="text-base">🌐</span>
                    <span>구글 트렌드 (Google)</span>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                    국내 & 글로벌 관심도
                  </span>
                </div>
                <p className="text-[11.5px] text-ink-muted">
                  한국 및 전 세계 사용자의 정보 탐색 추이를 나타냅니다. 52주 시계열 분석을 통해 대중적 브랜드 인지도 및 정보성 검색어의 추세를 확인하기에 적합합니다.
                </p>
              </div>

              {/* Pinterest */}
              <div className="p-4 rounded-2xl border border-line bg-surface shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-bold text-ink-primary">
                    <span className="text-base">📌</span>
                    <span>핀터레스트 트렌드 (Pinterest)</span>
                  </div>
                  <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                    2~3개월 선행 지표
                  </span>
                </div>
                <p className="text-[11.5px] text-ink-muted">
                  패션, 뷰티, 인테리어, 라이프스타일 상품의 <strong>선행 수요(Early Signal)</strong>를 포착합니다. 소비자가 실제 쇼핑하기 2~3달 전 보드를 만들고 핀을 저장하는 시점에 검색량이 급등합니다.
                </p>
              </div>

              {/* Meta */}
              <div className="p-4 rounded-2xl border border-line bg-surface shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-bold text-ink-primary">
                    <span className="text-base">📸</span>
                    <span>메타 인스타그램 (Meta)</span>
                  </div>
                  <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                    소셜 버즈 & 바이럴
                  </span>
                </div>
                <p className="text-[11.5px] text-ink-muted">
                  인스타그램 누적 해시태그 및 일간 신규 피드 볼륨입니다. 피드 인증샷, 인플루언서 협찬, 바이럴 확산 속도를 측정하여 유행의 실시간 파급력을 측정합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Practical Workflow: OTT to ACV */}
          <div className="p-5 rounded-2xl border border-line bg-gradient-to-br from-surface to-canvas-subtle shadow-2xs space-y-3">
            <div className="flex items-center space-x-2 text-ink-primary font-bold text-sm">
              <Target className="w-4 h-4 text-accent" />
              <span>실무 마케팅 워크플로우 (OTT 트렌드 발굴 ➔ ACV 소재 검수)</span>
            </div>

            <div className="space-y-2.5 text-xs text-ink-secondary">
              <div className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-ink-primary">선행 키워드 발굴 (OTT)</strong>
                  <p className="text-ink-muted text-[11.5px]">
                    핀터레스트와 인스타그램 지표에서 급상승(`Rising`)하는 시즈널 키워드(예: 린넨셔츠, 장마대비, 크리스마스 선물)를 2달 전에 미리 선점합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-ink-primary">소재 기획 및 제작</strong>
                  <p className="text-ink-muted text-[11.5px]">
                    포착된 연관 검색어와 성별/연령대 데모그래픽 비율을 토대로 타겟층에 최적화된 배너 및 숏폼 소재를 제작합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-ink-primary">광고 규격 원클릭 검수 (ACV)</strong>
                  <p className="text-ink-muted text-[11.5px]">
                    제작된 광고 이미지를 <strong>ACV(광고 소재 검수 도구)</strong>에 올려 네이버, 카카오, 메타, 구글 등 32대 매체 430개 공식 지면 규격 및 텍스트 20% 세이프존을 100% 브라우저 로컬에서 안전하게 자동 검수합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* ACV Link Banner */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-line/80">
              <span className="text-[11.5px] text-ink-muted">
                소재 검수가 필요하신가요? 검수 도구로 바로 이동하실 수 있습니다.
              </span>
              <a
                href={ACV_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-accent hover:bg-accent/90 text-white font-semibold text-xs shadow-2xs transition-all flex-shrink-0"
              >
                <span>ACV 검수 도구 열기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-line bg-canvas-subtle flex items-center justify-between text-xs text-ink-muted flex-shrink-0">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent-mint" />
            <span>상시 최신 매체 가이드라인과 트렌드 알고리즘 동기화</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-ink-secondary hover:text-ink-primary hover:bg-canvas border border-line transition-colors cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
