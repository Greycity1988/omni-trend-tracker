import React from 'react';
import {
  X,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Terminal,
  Instagram,
} from 'lucide-react';
import { ApiKeysStatus } from '../types';

interface ApiConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: ApiKeysStatus | null;
}

export const ApiConnectModal: React.FC<ApiConnectModalProps> = ({
  isOpen,
  onClose,
  status,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[90vh] rounded-3xl border border-slate-200 bg-white dark:border-[#26272c] dark:bg-[#141416] shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white transition-colors">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-[#202126] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-[#202126] dark:text-[#A8FF1A] flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">
                플랫폼 API 연동 및 실제 데이터 가이드
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#AEAEAE]">
                네이버·구글·인스타그램·핀터레스트 공식 API 실시간 연동 현황
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-[#AEAEAE] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#202126] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Status Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Naver */}
            <div className="p-3.5 rounded-2xl border border-emerald-300 bg-emerald-50/70 dark:border-emerald-500/30 dark:bg-emerald-950/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">네이버 데이터랩</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#A8FF1A]" />
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-[#A8FF1A] block">
                {status?.naver ? '● 실시간 연동 중' : '미연동'}
              </span>
            </div>

            {/* Google */}
            <div className="p-3.5 rounded-2xl border border-emerald-300 bg-emerald-50/70 dark:border-emerald-500/30 dark:bg-emerald-950/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">구글 트렌드</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#A8FF1A]" />
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-[#A8FF1A] block">
                ● 실시간 수집 중
              </span>
            </div>

            {/* Instagram */}
            <div className={`p-3.5 rounded-2xl border space-y-1 ${
              status?.meta
                ? 'border-emerald-300 bg-emerald-50/70 dark:border-emerald-500/30 dark:bg-emerald-950/20'
                : 'border-amber-300 bg-amber-50/70 dark:border-amber-500/30 dark:bg-amber-950/20'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">인스타그램</span>
                {status?.meta ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <span className="text-[11px] font-mono font-bold block">
                {status?.meta ? '● 실시간 연동 중' : '예시 미리보기'}
              </span>
            </div>

            {/* Pinterest */}
            <div className={`p-3.5 rounded-2xl border space-y-1 ${
              status?.pinterest
                ? 'border-emerald-300 bg-emerald-50/70 dark:border-emerald-500/30 dark:bg-emerald-950/20'
                : 'border-amber-300 bg-amber-50/70 dark:border-amber-500/30 dark:bg-amber-950/20'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">핀터레스트</span>
                {status?.pinterest ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <span className="text-[11px] font-mono font-bold block">
                {status?.pinterest ? '● 실시간 연동 중' : '예시 미리보기'}
              </span>
            </div>
          </div>

          {/* Guide 1: Instagram Real Token Setup */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 dark:border-[#26272c] dark:bg-[#1a1b1f] space-y-3">
            <div className="flex items-center space-x-2">
              <Instagram className="w-4 h-4 text-pink-600" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                인스타그램 (Meta Graph API) 실시간 연동 가이드
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#AEAEAE] leading-relaxed">
              Meta Graph API를 연동하면 해시태그별 실제 공개 게시물 수와 반응(좋아요·댓글) 지표를 실시간으로 집계할 수 있습니다.
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 dark:text-[#AEAEAE]">
              <li>
                <a
                  href="https://developers.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-600 dark:text-[#A8FF1A] hover:underline inline-flex items-center gap-1"
                >
                  Meta for Developers <ExternalLink className="w-3 h-3" />
                </a>
                에서 앱 생성 (유형: ‘비즈니스’ 또는 ‘소비자’)
              </li>
              <li>인스타그램 프로페셔널(비즈니스/크리에이터 무료 전환) 계정과 페이스북 페이지를 연결합니다.</li>
              <li>
                <a
                  href="https://developers.facebook.com/tools/explorer/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-600 dark:text-[#A8FF1A] hover:underline inline-flex items-center gap-1"
                >
                  그래프 API 탐색기 <ExternalLink className="w-3 h-3" />
                </a>
                에서 <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#26272c] font-mono">instagram_basic</code>, <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#26272c] font-mono">pages_show_list</code> 권한을 체크하고 토큰을 생성합니다.
              </li>
              <li>
                발급받은 토큰을 로컬 <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#26272c] font-mono">.env</code> 파일의 <code className="font-mono text-emerald-700 dark:text-[#A8FF1A]">META_ACCESS_TOKEN</code>에 넣고 저장하면 즉시 활성화됩니다!
              </li>
            </ol>
          </div>

          {/* Guide 2: Pinterest Real Token Setup */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 dark:border-[#26272c] dark:bg-[#1a1b1f] space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-base">📌</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                핀터레스트 트렌드 (Pinterest API v5) 실시간 연동 가이드
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#AEAEAE] leading-relaxed">
              Pinterest Developers에서 v5 Trends API 액세스 토큰을 발급받아 연동할 수 있습니다.
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 dark:text-[#AEAEAE]">
              <li>
                <a
                  href="https://developers.pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-600 dark:text-[#A8FF1A] hover:underline inline-flex items-center gap-1"
                >
                  Pinterest Developers Portal <ExternalLink className="w-3 h-3" />
                </a>
                에서 앱 생성
              </li>
              <li>OAuth 2.0 또는 장기 액세스 토큰(Access Token) 발급</li>
              <li>
                로컬 <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#26272c] font-mono">.env</code>의 <code className="font-mono text-emerald-700 dark:text-[#A8FF1A]">PINTEREST_ACCESS_TOKEN</code>에 붙여넣기 후 저장
              </li>
            </ol>
          </div>

          {/* Quick Terminal Command Tip */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-100 dark:border-[#26272c] dark:bg-[#101012] flex items-start space-x-3 text-xs">
            <Terminal className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <span className="font-bold text-slate-900 dark:text-white">
                Mac에서 바로 .env 파일 편집하기
              </span>
              <p className="text-slate-600 dark:text-[#AEAEAE] font-mono text-[11px]">
                터미널에서 <code className="text-emerald-700 dark:text-[#A8FF1A]">open ~/Downloads/omni-trend-tracker/backend/.env</code> 명령어를 입력하면 텍스트 편집기가 열립니다.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-[#202126] bg-slate-50 dark:bg-[#141416] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-black hover:opacity-90 transition cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
