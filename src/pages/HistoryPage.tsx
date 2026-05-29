import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'
import Layout from '@/components/Layout'
import { practiceApi } from '@/api/practice'
import type { PracticeHistoryItem, SessionStatus } from '@/types'
import clsx from 'clsx'

const PART_NAMES: Record<number, string> = {
  1: '문장 읽기',
  2: '사진 묘사하기',
  3: '질문에 답하기',
  4: '정보를 활용한 답변',
  5: '의견 제시하기',
}

const PART_ICONS: Record<number, string> = {
  1: '📖', 2: '🖼️', 3: '💬', 4: '📋', 5: '💡',
}

function StatusBadge({ status }: { status: SessionStatus }) {
  const map: Record<SessionStatus, { label: string; className: string }> = {
    DONE:       { label: '완료', className: 'bg-green-100 text-green-700' },
    PENDING:    { label: '미완료', className: 'bg-gray-100 text-gray-600' },
    PROCESSING: { label: '평가 중', className: 'bg-blue-100 text-blue-700' },
    ERROR:      { label: '오류', className: 'bg-red-100 text-red-700' },
  }
  const { label, className } = map[status]
  return (
    <span className={clsx('text-xs font-semibold px-2.5 py-0.5 rounded-full', className)}>
      {label}
    </span>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function HistoryContent() {
  const navigate = useNavigate()
  const [items, setItems] = useState<PracticeHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    practiceApi.getHistory()
      .then(setItems)
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="text-5xl">📭</div>
        <p className="text-gray-600 font-medium">아직 연습 기록이 없습니다.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          연습 시작하기
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <button
          key={`${item.partId}-${item.firstSessionId}`}
          onClick={() => {
            if (item.overallStatus === 'DONE') {
              navigate(`/feedback/${item.firstSessionId}`)
            }
          }}
          className={clsx(
            'w-full bg-white rounded-2xl border border-gray-100 p-5 text-left flex items-center gap-4 transition-all',
            item.overallStatus === 'DONE'
              ? 'hover:border-indigo-200 hover:shadow-sm active:scale-[0.99] cursor-pointer'
              : 'cursor-default opacity-80'
          )}
        >
          <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-xl shrink-0">
            {PART_ICONS[item.partId]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-semibold text-indigo-500">Part {item.partId}</span>
              <span className="font-medium text-gray-900 text-sm">{PART_NAMES[item.partId]}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>{formatDate(item.createdAt)}</span>
              <span>·</span>
              <span>{item.completedQuestions}/{item.totalQuestions} 완료</span>
            </div>
          </div>
          <div className="shrink-0">
            <StatusBadge status={item.overallStatus} />
          </div>
        </button>
      ))}
    </div>
  )
}

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <Layout title="연습 기록">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">연습 기록</h2>
            <p className="text-sm text-gray-500 mt-0.5">나의 스피킹 연습 이력입니다.</p>
          </div>
          <HistoryContent />
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
