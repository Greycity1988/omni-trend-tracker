import React, { useEffect } from 'react';
import {
  X,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Terminal,
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
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="플랫폼 API 연동 상태" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
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
                네이버 데이터랩 · 구글 트렌드 연동 현황
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            title="닫기 (Esc)"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-[#AEAEAE] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#202126] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Status Overview Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Naver */}
            <div className={`p-3.5 rounded-2xl border space-y-1 ${
              status?.naver
                ? 'border-emerald-300 bg-emerald-50/70 dark:border-emerald-500/30 dark:bg-emerald-950/20'
                : 'border-amber-300 bg-amber-50/70 dark:border-amber-500/30 dark:bg-amber-950/20'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">네이버 데이터랩</span>
                {status?.naver ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#A8FF1A]" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <span className={`text-[11px] font-mono font-bold block ${status?.naver ? 'text-emerald-700 dark:text-[#A8FF1A]' : 'text-amber-700 dark:text-amber-400'}`}>
                {status?.naver ? '● 실시간 연동 중' : '키 없음 · 예시 데이터'}
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

          </div>

          {/* Guide: Naver DataLab keys */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 dark:border-[#26272c] dark:bg-[#1a1b1f] space-y-3">
            <div className="flex items-center space-x-2">
              <KeyRound className="w-4 h-4 text-[#03C75A]" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                네이버 데이터랩 키 연결하기 (무료)
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#AEAEAE] leading-relaxed">
              구글 트렌드는 키 없이 실제 데이터를 받습니다. 네이버는 키를 넣어야 실제 데이터로 바뀌고, 키가 없으면 예시 데이터로 표시됩니다.
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 dark:text-[#AEAEAE]">
              <li>
                <a
                  href="https://developers.naver.com/apps/#/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 dark:text-[#A8FF1A] font-semibold hover:underline inline-flex items-center gap-1"
                >
                  네이버 개발자 센터 <ExternalLink className="w-3 h-3" />
                </a>
                에서 애플리케이션을 등록하고 사용 API로 ‘데이터랩(검색어 트렌드)’을 고릅니다.
              </li>
              <li>발급된 Client ID와 Client Secret을 <code className="font-mono">backend/.env</code>의 <code className="font-mono">NAVER_CLIENT_ID</code>, <code className="font-mono">NAVER_CLIENT_SECRET</code>에 넣습니다.</li>
              <li>백엔드 서버를 다시 켜면 적용됩니다. 하루 1,000회까지 무료입니다.</li>
            </ol>
          </div>

          {/* Quick Terminal Command Tip */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-100 dark:border-[#26272c] dark:bg-[#101012] flex items-start space-x-3 text-xs">
            <Terminal className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <span className="font-bold text-slate-900 dark:text-white">
                키 파일 만들기
              </span>
              <p className="text-slate-600 dark:text-[#AEAEAE] font-mono text-[11px]">
                <code className="text-emerald-700 dark:text-[#A8FF1A]">cd backend && cp .env.example .env</code> 로 만든 뒤 편집기로 열어 키를 넣습니다. 이 파일은 GitHub에 올리지 마세요.
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
