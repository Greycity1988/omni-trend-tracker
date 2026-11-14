import React, { useState, useEffect } from 'react';
import {
  X,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Send,
  Clock,
} from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LocalFeedback {
  id: string;
  category: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

const GITHUB_ISSUES_URL = 'https://github.com/Greycity1988/omni-trend-tracker/issues/new';
const STORAGE_KEY = 'ott_user_feedbacks';

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'write' | 'list'>('write');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [category, setCategory] = useState('신규 분석 채널 추가');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [feedbacks, setFeedbacks] = useState<LocalFeedback[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFeedbacks(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newFeedback: LocalFeedback = {
      id: Date.now().toString(),
      category,
      title: title.trim(),
      content: content.trim(),
      author: author.trim() || '익명 마케터',
      createdAt: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };

    const updated = [newFeedback, ...feedbacks];
    setFeedbacks(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Reports are received on GitHub Issues; this page only prepares the issue and keeps a local copy
    const issueTitle = encodeURIComponent(`[${category}] ${newFeedback.title}`);
    const issueBody = encodeURIComponent(
      `• 분류: ${category}\n• 작성자: ${newFeedback.author}\n\n${newFeedback.content}\n\n— OTT 건의 창에서 작성`
    );
    window.open(`${GITHUB_ISSUES_URL}?title=${issueTitle}&body=${issueBody}`, '_blank', 'noopener,noreferrer');

    // Reset form
    setTitle('');
    setContent('');
    setSuccessMessage('GitHub 이슈 작성 화면을 새 탭으로 열었습니다. GitHub에서 등록을 눌러야 접수됩니다.');
    setTimeout(() => setSuccessMessage(null), 4000);
    setActiveTab('list');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface rounded-3xl shadow-soft-lg border border-line w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-6 border-b border-line flex items-center justify-between bg-surface flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-accent text-white rounded-2xl shadow-soft-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-ink-primary">
                  기능 제안 및 건의사항
                </h2>
                <span className="text-[10px] font-mono font-semibold bg-canvas-subtle text-ink-secondary border border-line px-2 py-0.5 rounded-full">
                  Feedback & Issues
                </span>
              </div>
              <p className="text-xs text-ink-secondary mt-0.5">
                신규 플랫폼 연동 요청, 수치 오차 제보, 개선 아이디어를 편하게 남겨주세요.
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

        {/* Quick Contact Bar */}
        <div className="px-6 py-3 bg-canvas-subtle border-b border-line flex flex-wrap items-center justify-end gap-3 text-xs flex-shrink-0">
          <a
            href={GITHUB_ISSUES_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1 text-ink-secondary hover:text-ink-primary font-medium hover:underline text-[11px]"
          >
            <span>GitHub 이슈 등록</span>
            <ExternalLink className="w-3 h-3 text-ink-muted" />
          </a>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 pb-2 border-b border-line flex items-center space-x-3 bg-surface flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'write'
                ? 'bg-accent text-white shadow-2xs'
                : 'text-ink-secondary hover:text-ink-primary hover:bg-canvas-subtle'
            }`}
          >
            건의사항 작성하기
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'bg-accent text-white shadow-2xs'
                : 'text-ink-secondary hover:text-ink-primary hover:bg-canvas-subtle'
            }`}
          >
            접수된 건의 내역 ({feedbacks.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {successMessage && (
            <div className="p-3.5 bg-accent text-white rounded-xl text-xs font-medium flex items-center space-x-2 animate-fadeIn shadow-soft-sm">
              <CheckCircle2 className="w-4 h-4 text-accent-mint flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {activeTab === 'write' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                    구분 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-line bg-surface text-ink-primary text-xs focus:outline-none focus:border-accent"
                  >
                    <option value="신규 분석 채널 추가">신규 분석 채널 추가 (틱톡, 유튜브 등)</option>
                    <option value="데이터 이상/오차 제보">데이터 이상/오차 제보</option>
                    <option value="ACV 연동 제안">ACV(광고 소재 검수 도구) 연동 제안</option>
                    <option value="대시보드 UI/UX 개선">대시보드 UI/UX 개선 아이디어</option>
                    <option value="기타 의견">기타 제안 및 문의</option>
                  </select>
                </div>

                {/* Author Name */}
                <div>
                  <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                    작성자 / 소속 (선택)
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="예: 그로스 마케터, 브랜드 담당자"
                    className="w-full px-3 py-2 rounded-xl border border-line bg-surface text-ink-primary text-xs focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                  건의 제목 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 유튜브 쇼핑 검색 트렌드 지표도 추가해 주세요"
                  className="w-full px-3 py-2 rounded-xl border border-line bg-surface text-ink-primary text-xs focus:outline-none focus:border-accent"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                  상세 내용 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="구체적인 상황이나 원하시는 기능 형태를 적어주시면 개발에 큰 도움이 됩니다."
                  className="w-full px-3 py-2.5 rounded-xl border border-line bg-surface text-ink-primary text-xs focus:outline-none focus:border-accent leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-white font-semibold text-xs shadow-soft-xs transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>GitHub 이슈로 등록하기</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {feedbacks.length === 0 ? (
                <div className="p-8 text-center space-y-2 border border-dashed border-line rounded-2xl bg-canvas-subtle/40">
                  <MessageSquare className="w-8 h-8 text-ink-muted mx-auto" />
                  <div className="text-xs font-semibold text-ink-primary">
                    아직 등록된 건의사항이 없습니다.
                  </div>
                  <p className="text-[11px] text-ink-muted">
                    첫 번째 개선 의견을 남겨주시면 빠르게 검토하겠습니다!
                  </p>
                </div>
              ) : (
                feedbacks.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-line bg-surface shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                        {item.category}
                      </span>
                      <div className="flex items-center space-x-1 text-[11px] text-ink-muted">
                        <Clock className="w-3 h-3" />
                        <span>{item.createdAt}</span>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-ink-primary">{item.title}</div>
                    <p className="text-xs text-ink-secondary leading-relaxed whitespace-pre-wrap">
                      {item.content}
                    </p>
                    <div className="text-[11px] text-ink-muted pt-1 border-t border-line/60 flex items-center justify-between">
                      <span>작성자: {item.author}</span>
                      <span className="text-ink-muted font-semibold">이 브라우저에 저장된 기록</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-line bg-canvas-subtle flex items-center justify-between text-xs text-ink-muted flex-shrink-0">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>건의는 GitHub 이슈로 접수됩니다</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-ink-secondary hover:text-ink-primary hover:bg-canvas border border-line transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
