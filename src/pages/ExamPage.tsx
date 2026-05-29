import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'
import Layout from '@/components/Layout'
import CountdownTimer from '@/components/CountdownTimer'
import AudioRecorder from '@/components/AudioRecorder'
import { examApi } from '@/api/exam'
import { feedbackApi } from '@/api/feedback'
import type { ExamSession, PracticeSessionItem, ExamPartData } from '@/types'
import clsx from 'clsx'

type Phase = 'loading' | 'confirm' | 'ready' | 'prep' | 'record' | 'submitting' | 'done' | 'error'

const PART_NAMES: Record<number, string> = {
  1: '문장 읽기',
  2: '사진 묘사하기',
  3: '질문에 답하기',
  4: '정보를 활용한 답변',
  5: '의견 제시하기',
}

function getAllSessions(examSession: ExamSession): Array<{ part: ExamPartData; session: PracticeSessionItem }> {
  return examSession.parts.flatMap(part =>
    part.sessions.map(session => ({ part, session }))
  )
}

function ExamContent() {
  const navigate = useNavigate()

  const [phase, setPhase] = useState<Phase>('confirm')
  const [examSession, setExamSession] = useState<ExamSession | null>(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [existingExamId, setExistingExamId] = useState<number | null>(null)

  // Flat list of all sessions
  const allSessions = examSession ? getAllSessions(examSession) : []
  const current = allSessions[currentIdx] ?? null
  const totalCount = allSessions.length

  useEffect(() => {
    examApi.getList().then(list => {
      const inProgress = list.find(e => e.status === 'IN_PROGRESS')
      if (inProgress) setExistingExamId(inProgress.examSessionId)
    }).catch(() => {})
  }, [])

  const startExam = useCallback(() => {
    setPhase('loading')
    examApi.start()
      .then(exam => {
        setExamSession(exam)
        setPhase('ready')
      })
      .catch(err => {
        const code = err.response?.data?.code
        if (code === 'EXAM_ALREADY_IN_PROGRESS') {
          setErrorMsg('이미 진행 중인 시험이 있습니다. 포기 후 새로 시작할 수 있습니다.')
        } else {
          setErrorMsg('시험을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.')
        }
        setPhase('error')
      })
  }, [])

  const abandonAndStart = useCallback(async () => {
    if (!existingExamId) return
    try {
      await examApi.abandon(existingExamId)
      setExistingExamId(null)
      startExam()
    } catch {
      setErrorMsg('시험 포기에 실패했습니다.')
      setPhase('error')
    }
  }, [existingExamId, startExam])

  const startPrep = useCallback(() => setPhase('prep'), [])
  const startRecord = useCallback(() => setPhase('record'), [])

  const handleRecordStop = useCallback((blob: Blob) => {
    setAudioBlob(blob)
  }, [])

  const handleRecordComplete = useCallback(() => {
    setPhase('submitting')
  }, [])

  useEffect(() => {
    if (phase !== 'submitting' || !audioBlob || !current) return

    feedbackApi.submit(current.session.sessionId, audioBlob)
      .then(() => {
        if (currentIdx + 1 < totalCount) {
          setCurrentIdx(i => i + 1)
          setAudioBlob(null)
          setPhase('ready')
        } else {
          setPhase('done')
        }
      })
      .catch(() => {
        setErrorMsg('음성 평가 중 오류가 발생했습니다.')
        setPhase('error')
      })
  }, [phase, audioBlob, current, currentIdx, totalCount])

  // ─── Phases ───────────────────────────────────────────────────────────────

  if (phase === 'confirm') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">실전 모의시험</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Part 1부터 5까지 총 11문제를 실제 시험 형식으로 풀어봅니다.<br/>
            시험 시작 후에는 중단하지 않는 것을 권장합니다.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '총 문항', value: '11문제' },
              { label: '파트', value: 'Part 1~5' },
              { label: '예상 시간', value: '약 20분' },
              { label: '결과', value: '예상 점수 산출' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="font-semibold text-gray-800 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
          {existingExamId && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm text-orange-800">
              진행 중인 시험이 있습니다. 새로 시작하려면 기존 시험을 포기해야 합니다.
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
          >
            취소
          </button>
          {existingExamId ? (
            <button
              onClick={abandonAndStart}
              className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
            >
              포기하고 새로 시작
            </button>
          ) : (
            <button
              onClick={startExam}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
            >
              시험 시작
            </button>
          )}
        </div>
      </div>
    )
  }

  if (phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-semibold text-gray-800">시험 문제를 생성하고 있습니다...</p>
        <p className="text-sm text-gray-500">AI가 11개 문제를 준비합니다. 최대 48초 소요됩니다.</p>
      </div>
    )
  }

  if (phase === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-2xl">⚠️</div>
        <p className="font-semibold text-gray-800">{errorMsg}</p>
        <div className="flex gap-3">
          <button onClick={() => navigate('/dashboard')} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
            돌아가기
          </button>
          <button onClick={() => setPhase('confirm')} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl">🎯</div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">시험 완료!</h2>
          <p className="text-gray-500 mt-1">AI가 종합 점수를 계산하고 있습니다.</p>
        </div>
        <button
          onClick={() => navigate(`/exam/${examSession!.examSessionId}/result`)}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
        >
          결과 보기
        </button>
      </div>
    )
  }

  if (!current || !examSession) return null

  const { part, session } = current
  const isPartStart = currentIdx === 0 || allSessions[currentIdx - 1].part.partId !== part.partId

  return (
    <div className="space-y-5">
      {/* 전체 진행바 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>전체 진행도</span>
          <span>{currentIdx + 1} / {totalCount}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentIdx) / totalCount) * 100}%` }}
          />
        </div>
        <div className="flex gap-1 mt-3">
          {examSession.parts.map((p) => (
            <div key={p.partId} className="flex-1 text-center">
              <div className={clsx(
                'h-1 rounded-full mb-1',
                p.partId < part.partId ? 'bg-indigo-500' :
                p.partId === part.partId ? 'bg-indigo-300' : 'bg-gray-200'
              )} />
              <span className={clsx(
                'text-xs',
                p.partId === part.partId ? 'text-indigo-600 font-semibold' : 'text-gray-400'
              )}>
                P{p.partId}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 공통 배경 */}
      {part.contextContent && isPartStart && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-xs font-semibold text-amber-700 mb-2 uppercase tracking-wide">배경 상황</p>
          <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-line">{part.contextContent}</p>
        </div>
      )}

      {/* 질문 카드 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full">
            Part {part.partId} · {PART_NAMES[part.partId]}
          </span>
          {session.sequenceNo && (
            <span className="text-xs text-gray-400">Q{session.sequenceNo}</span>
          )}
        </div>

        {session.imageUrl && (
          <img src={session.imageUrl} alt="묘사할 사진" className="w-full rounded-xl object-cover max-h-60" />
        )}

        <p className="text-gray-800 leading-relaxed">{session.content}</p>

        <div className="flex gap-4 text-sm text-gray-500">
          <span>준비 {session.prepSeconds}초</span>
          <span>·</span>
          <span>답변 {session.responseSeconds}초</span>
        </div>
      </div>

      {/* 타이머 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center gap-6">
        {phase === 'ready' && (
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
              key={`prep-${currentIdx}`}
              seconds={session.prepSeconds}
              onComplete={startRecord}
              label="준비"
              variant="prep"
            />
            <p className="text-sm text-gray-500">답변을 준비하세요</p>
          </>
        )}

        {phase === 'record' && (
          <CountdownTimer
            key={`rec-${currentIdx}`}
            seconds={session.responseSeconds}
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
          </div>
        )}
      </div>
    </div>
  )
}

export default function ExamPage() {
  return (
    <ProtectedRoute>
      <Layout title="실전 모의시험" showBack>
        <ExamContent />
      </Layout>
    </ProtectedRoute>
  )
}
