import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'
import Layout from '@/components/Layout'
import CountdownTimer from '@/components/CountdownTimer'
import AudioRecorder from '@/components/AudioRecorder'
import { practiceApi } from '@/api/practice'
import { feedbackApi } from '@/api/feedback'
import type { PartId, PracticeSessionGroup, PracticeSessionItem } from '@/types'
import clsx from 'clsx'

type Phase = 'loading' | 'intro' | 'prep' | 'record' | 'submitting' | 'done' | 'error'

const PART_NAMES: Record<number, string> = {
  1: '문장 읽기',
  2: '사진 묘사하기',
  3: '질문에 답하기',
  4: '정보를 활용한 답변',
  5: '의견 제시하기',
}

function PracticeContent() {
  const { partId: partIdStr } = useParams<{ partId: string }>()
  const navigate = useNavigate()
  const partId = Number(partIdStr) as PartId

  const [phase, setPhase] = useState<Phase>('loading')
  const [sessionGroup, setSessionGroup] = useState<PracticeSessionGroup | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [feedbackIds, setFeedbackIds] = useState<number[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  const currentSession: PracticeSessionItem | null =
    sessionGroup?.sessions[currentIndex] ?? null

  useEffect(() => {
    practiceApi.start(partId)
      .then(group => {
        setSessionGroup(group)
        setPhase('intro')
      })
      .catch(err => {
        const code = err.response?.data?.code
        setErrorMsg(code === 'QUESTION_GENERATION_FAILED'
          ? 'AI 문제 생성에 실패했습니다. 잠시 후 다시 시도해주세요.'
          : '연습 세션을 시작할 수 없습니다.')
        setPhase('error')
      })
  }, [partId])

  const startPrep = useCallback(() => setPhase('prep'), [])
  const startRecord = useCallback(() => setPhase('record'), [])

  // 타이머 종료 시 phase만 바꾸고 녹음은 AudioRecorder가 알아서 stop()
  const handleRecordComplete = useCallback(() => {
    setPhase('submitting')
  }, [])

  // AudioRecorder의 onstop 이벤트로 blob 수신 — submitting 단계에서도 컴포넌트가 마운트 상태여야 호출됨
  const handleRecordStop = useCallback((blob: Blob) => {
    setAudioBlob(blob)
  }, [])

  // audioBlob이 설정되면 API 제출 (phase=submitting 보장)
  useEffect(() => {
    if (phase !== 'submitting' || !audioBlob || !currentSession) return

    feedbackApi.submit(currentSession.sessionId, audioBlob)
      .then(fb => {
        const next = [...feedbackIds, fb.feedbackId]
        setFeedbackIds(next)

        if (!sessionGroup) return
        if (currentIndex + 1 < sessionGroup.sessions.length) {
          setCurrentIndex(i => i + 1)
          setAudioBlob(null)
          setPhase('intro')
        } else {
          setPhase('done')
        }
      })
      .catch(() => {
        setErrorMsg('음성 평가 중 오류가 발생했습니다.')
        setPhase('error')
      })
  }, [phase, audioBlob, currentSession])

  if (phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 font-medium">AI가 문제를 생성하고 있습니다...</p>
        <p className="text-sm text-gray-400">최대 8초 정도 소요될 수 있습니다</p>
      </div>
    )
  }

  if (phase === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-2xl">⚠️</div>
        <p className="font-semibold text-gray-800">{errorMsg}</p>
        <button onClick={() => navigate('/dashboard')} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
          돌아가기
        </button>
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl animate-bounce">
          🎉
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">연습 완료!</h2>
          <p className="text-gray-500 mt-1">AI 피드백을 확인해보세요.</p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {feedbackIds.length > 0 && (
            <button
              onClick={() => navigate(`/feedback/${sessionGroup!.sessions[0].sessionId}`)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
            >
              피드백 보기
            </button>
          )}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
          >
            다른 파트 연습하기
          </button>
        </div>
      </div>
    )
  }

  if (!currentSession || !sessionGroup) return null

  const totalCount = sessionGroup.sessions.length
  const isMultiQ = totalCount > 1
  const partName = PART_NAMES[partId] ?? `Part ${partId}`

  return (
    <div className="space-y-5">
      {/* 진행 표시 */}
      {isMultiQ && (
        <div className="flex items-center gap-2">
          {sessionGroup.sessions.map((_, i) => (
            <div key={i} className={clsx(
              'h-1.5 flex-1 rounded-full transition-all duration-500',
              i < currentIndex ? 'bg-indigo-500' :
              i === currentIndex ? 'bg-indigo-300' : 'bg-gray-200'
            )} />
          ))}
          <span className="text-sm text-gray-500 ml-1 shrink-0">{currentIndex + 1}/{totalCount}</span>
        </div>
      )}

      {/* 공통 배경 (Part 3/4/5) */}
      {sessionGroup.contextContent && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-xs font-semibold text-amber-700 mb-2 uppercase tracking-wide">배경 상황</p>
          <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-line">{sessionGroup.contextContent}</p>
        </div>
      )}

      {/* 질문 카드 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full">
            Part {partId} · {partName}
          </span>
          {isMultiQ && currentSession.sequenceNo && (
            <span className="text-xs text-gray-400">Q{currentSession.sequenceNo}</span>
          )}
        </div>

        {/* Part 2: 이미지 */}
        {currentSession.imageUrl && (
          <img
            src={currentSession.imageUrl}
            alt="묘사할 사진"
            className="w-full rounded-xl object-cover max-h-60"
          />
        )}

        <p className="text-gray-800 leading-relaxed text-base">{currentSession.content}</p>

        <div className="flex gap-4 text-sm text-gray-500">
          <span>준비 {currentSession.prepSeconds}초</span>
          <span>·</span>
          <span>답변 {currentSession.responseSeconds}초</span>
        </div>
      </div>

      {/* 타이머 + 녹음 영역 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center gap-6">
        {phase === 'intro' && (
          <>
            <p className="text-gray-600 text-center">준비가 되면 시작 버튼을 누르세요.</p>
            <button
              onClick={startPrep}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors active:scale-95"
            >
              시작하기
            </button>
          </>
        )}

        {phase === 'prep' && (
          <>
            <CountdownTimer
              key={`prep-${currentIndex}`}
              seconds={currentSession.prepSeconds}
              onComplete={startRecord}
              label="준비"
              variant="prep"
            />
            <p className="text-sm text-gray-500">답변을 준비하세요</p>
          </>
        )}

        {phase === 'record' && (
          <CountdownTimer
            key={`rec-${currentIndex}`}
            seconds={currentSession.responseSeconds}
            onComplete={handleRecordComplete}
            label="녹음 중"
            variant="record"
          />
        )}

        {/* record → submitting 전환 시 언마운트 없이 isRecording=false 전달
            → AudioRecorder 내부에서 mr.stop() 호출 → onstop → onStop(blob) */}
        {(phase === 'record' || phase === 'submitting') && (
          <AudioRecorder
            isRecording={phase === 'record'}
            onStop={handleRecordStop}
          />
        )}

        {phase === 'record' && (
          <p className="text-sm text-red-500 font-medium">지금 녹음 중입니다</p>
        )}

        {phase === 'submitting' && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600">AI가 평가하고 있습니다...</p>
            <p className="text-xs text-gray-400">5~15초 정도 소요됩니다</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PracticePage() {
  const { partId } = useParams<{ partId: string }>()
  const partName = PART_NAMES[Number(partId)] ?? `Part ${partId}`

  return (
    <ProtectedRoute>
      <Layout title={partName} showBack>
        <PracticeContent />
      </Layout>
    </ProtectedRoute>
  )
}
