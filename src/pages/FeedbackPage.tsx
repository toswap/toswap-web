import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'
import Layout from '@/components/Layout'
import ScoreCard from '@/components/ScoreCard'
import { feedbackApi } from '@/api/feedback'
import { practiceApi } from '@/api/practice'
import type { Feedback, PracticeSessionDetail } from '@/types'

const PART_NAMES: Record<number, string> = {
  1: '문장 읽기',
  2: '사진 묘사하기',
  3: '질문에 답하기',
  4: '정보를 활용한 답변',
  5: '의견 제시하기',
}

function FeedbackContent() {
  const { sessionId: sessionIdStr } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const sessionId = Number(sessionIdStr)

  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [sessionDetail, setSessionDetail] = useState<PracticeSessionDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      feedbackApi.getBySession(sessionId),
      practiceApi.getSession(sessionId),
    ])
      .then(([fb, session]) => {
        setFeedback(fb)
        setSessionDetail(session)
      })
      .catch(() => setError('피드백을 불러올 수 없습니다.'))
      .finally(() => setIsLoading(false))
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !feedback) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-600">{error || '피드백이 없습니다.'}</p>
        <button onClick={() => navigate(-1)} className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition-colors">
          돌아가기
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 질문 원문 */}
      {sessionDetail && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full">
              Part {sessionDetail.partId} · {PART_NAMES[sessionDetail.partId]}
            </span>
          </div>
          {sessionDetail.contextContent && (
            <div className="bg-amber-50 rounded-xl p-3 mb-3">
              <p className="text-xs text-amber-700 font-medium mb-1">배경 상황</p>
              <p className="text-xs text-amber-900 leading-relaxed">{sessionDetail.contextContent}</p>
            </div>
          )}
          {sessionDetail.imageUrl && (
            <img src={sessionDetail.imageUrl} alt="문제 사진" className="w-full rounded-xl object-cover max-h-48 mb-3" />
          )}
          <p className="text-gray-800 text-sm leading-relaxed">{sessionDetail.content}</p>
        </div>
      )}

      {/* 점수 카드 */}
      <ScoreCard
        scorePronunciation={feedback.scorePronunciation}
        scoreIntonation={feedback.scoreIntonation}
        scoreGrammar={feedback.scoreGrammar}
        scoreVocabulary={feedback.scoreVocabulary}
        scoreFluency={feedback.scoreFluency}
        scoreContent={feedback.scoreContent}
        scoreOverall={feedback.scoreOverall}
        toeicLevel={feedback.toeicLevel}
      />

      {/* 전사 텍스트 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-base">📝</span>내 답변 텍스트
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 italic">
          "{feedback.transcript}"
        </p>
      </div>

      {/* 잘한 점 */}
      {feedback.strengths.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-base">✅</span>잘한 점
          </h3>
          <ul className="space-y-2">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="text-green-500 mt-0.5 shrink-0">•</span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 개선 사항 */}
      {feedback.improvements.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-base">💪</span>개선 사항
          </h3>
          <div className="space-y-4">
            {feedback.improvements.map((item, i) => (
              <div key={i} className="rounded-xl border border-orange-100 bg-orange-50 p-4 space-y-2">
                <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full">
                  {item.area}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">{item.issue}</p>
                <div className="border-t border-orange-100 pt-2">
                  <p className="text-xs font-medium text-orange-700 mb-1">개선 방법</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 전체 코멘트 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-base">🤖</span>AI 종합 평가
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">{feedback.detailedComment}</p>
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-3 pb-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
        >
          다시 연습하기
        </button>
        <button
          onClick={() => navigate('/history')}
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
        >
          기록 보기
        </button>
      </div>
    </div>
  )
}

export default function FeedbackPage() {
  return (
    <ProtectedRoute>
      <Layout title="AI 피드백" showBack>
        <FeedbackContent />
      </Layout>
    </ProtectedRoute>
  )
}
