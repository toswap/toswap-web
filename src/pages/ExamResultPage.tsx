import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'
import Layout from '@/components/Layout'
import { examApi } from '@/api/exam'
import type { ExamResult } from '@/types'
import clsx from 'clsx'

const LEVEL_LABELS: Record<number, string> = {
  1: 'Level 1',
  2: 'Level 2',
  3: 'Level 3',
  4: 'Level 4',
  5: 'Level 5',
  6: 'Level 6',
  7: 'Level 7',
  8: 'Level 8 (최고)',
}

const PART_NAMES: Record<number, string> = {
  1: '문장 읽기', 2: '사진 묘사', 3: '질문 답변', 4: '정보 활용', 5: '의견 제시',
}

function ScoreGauge({ score }: { score: number }) {
  const max = 200
  const pct = (score / max) * 100
  const color = score >= 160 ? 'text-green-600' : score >= 120 ? 'text-indigo-600' : score >= 80 ? 'text-yellow-600' : 'text-red-600'
  const barColor = score >= 160 ? 'bg-green-500' : score >= 120 ? 'bg-indigo-500' : score >= 80 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className="text-center space-y-3">
      <p className="text-sm text-gray-500">예상 TOEIC Speaking 점수</p>
      <p className={clsx('text-6xl font-black', color)}>{score}</p>
      <p className="text-gray-400 text-sm">/ 200점</p>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mt-2">
        <div
          className={clsx('h-full rounded-full transition-all duration-1000', barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>0</span>
        <span>100</span>
        <span>200</span>
      </div>
    </div>
  )
}

function ExamResultContent() {
  const { examSessionId: idStr } = useParams<{ examSessionId: string }>()
  const navigate = useNavigate()
  const examSessionId = Number(idStr)

  const [result, setResult] = useState<ExamResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPolling, setIsPolling] = useState(false)

  const fetchResult = () => {
    examApi.getResult(examSessionId)
      .then(r => {
        setResult(r)
        if (r.status === 'EVALUATING') setIsPolling(true)
        else setIsPolling(false)
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchResult()
  }, [examSessionId])

  // Poll while evaluating
  useEffect(() => {
    if (!isPolling) return
    const id = setInterval(fetchResult, 3000)
    return () => clearInterval(id)
  }, [isPolling, examSessionId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!result) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-600">결과를 불러올 수 없습니다.</p>
        <button onClick={() => navigate('/dashboard')} className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition-colors">
          돌아가기
        </button>
      </div>
    )
  }

  if (result.status === 'EVALUATING') {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-semibold text-gray-800">AI가 종합 점수를 계산하고 있습니다...</p>
        <p className="text-sm text-gray-500">잠시만 기다려주세요. 자동으로 업데이트됩니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 점수 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        {result.predictedScore != null ? (
          <ScoreGauge score={result.predictedScore} />
        ) : (
          <p className="text-center text-gray-500">점수 계산 중...</p>
        )}
        {result.predictedLevel != null && (
          <div className="text-center mt-4">
            <span className="text-sm font-semibold text-indigo-700 bg-indigo-50 px-4 py-1.5 rounded-full">
              {LEVEL_LABELS[result.predictedLevel] ?? `Level ${result.predictedLevel}`}
            </span>
          </div>
        )}
      </div>

      {/* 파트별 결과 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h3 className="font-semibold text-gray-800">파트별 완료 현황</h3>
        {result.partResults.map((pr) => (
          <div key={pr.partId} className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-24 shrink-0">Part {pr.partId} · {PART_NAMES[pr.partId]}</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${(pr.completedSessions / pr.totalSessions) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 w-12 text-right shrink-0">
              {pr.completedSessions}/{pr.totalSessions}
            </span>
          </div>
        ))}
      </div>

      {/* 완료 시각 */}
      {result.completedAt && (
        <p className="text-xs text-center text-gray-400">
          완료: {new Date(result.completedAt).toLocaleString('ko-KR')}
        </p>
      )}

      {/* 버튼 */}
      <div className="flex gap-3 pb-4">
        <button
          onClick={() => navigate('/history')}
          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
        >
          기록 보기
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
        >
          다시 연습하기
        </button>
      </div>
    </div>
  )
}

export default function ExamResultPage() {
  return (
    <ProtectedRoute>
      <Layout title="시험 결과" showBack>
        <ExamResultContent />
      </Layout>
    </ProtectedRoute>
  )
}
