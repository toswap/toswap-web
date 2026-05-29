import { useNavigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import type { PartId } from '@/types'

interface PartInfo {
  id: PartId
  label: string
  title: string
  desc: string
  questions: number
  prepSec: number
  respSec: string
  icon: string
}

const PARTS: PartInfo[] = [
  {
    id: 1,
    label: 'Part 1',
    title: '문장 읽기',
    desc: '주어진 문장을 큰 소리로 정확하게 읽으세요.',
    questions: 2,
    prepSec: 45,
    respSec: '45초',
    icon: '📖',
  },
  {
    id: 2,
    label: 'Part 2',
    title: '사진 묘사하기',
    desc: '사진 속 상황을 영어로 상세히 묘사하세요.',
    questions: 1,
    prepSec: 45,
    respSec: '30초',
    icon: '🖼️',
  },
  {
    id: 3,
    label: 'Part 3',
    title: '질문에 답하기',
    desc: '설문 상황에서 3개의 질문에 즉흥적으로 답하세요.',
    questions: 3,
    prepSec: 3,
    respSec: '15–30초',
    icon: '💬',
  },
  {
    id: 4,
    label: 'Part 4',
    title: '정보를 활용한 답변',
    desc: '제공된 일정/문서를 보고 3개의 질문에 답하세요.',
    questions: 3,
    prepSec: 3,
    respSec: '15–30초',
    icon: '📋',
  },
  {
    id: 5,
    label: 'Part 5',
    title: '의견 제시하기',
    desc: '주어진 주제에 대해 근거를 들어 의견을 말하세요.',
    questions: 2,
    prepSec: 45,
    respSec: '60초',
    icon: '💡',
  },
]

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">파트 선택</h2>
            <p className="text-gray-500 mt-1">연습하고 싶은 파트를 선택하세요.</p>
          </div>

          <div className="grid gap-3">
            {PARTS.map((part) => (
              <button
                key={part.id}
                onClick={() => navigate(`/practice/${part.id}`)}
                className="bg-white rounded-2xl border border-gray-100 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-50 active:scale-[0.99] transition-all p-5 text-left flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center text-xl shrink-0 transition-colors">
                  {part.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {part.label}
                    </span>
                    <span className="font-semibold text-gray-900">{part.title}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{part.desc}</p>
                </div>
                <div className="text-right text-xs text-gray-400 shrink-0 space-y-0.5">
                  <p className="font-medium">{part.questions}문항</p>
                  <p>답변 {part.respSec}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-6">
            <button
              onClick={() => navigate('/exam')}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl p-5 text-left flex items-center gap-4 active:scale-[0.99] transition-all shadow-lg shadow-indigo-200"
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
                🎯
              </div>
              <div className="flex-1">
                <p className="font-bold text-white">실전 모의시험</p>
                <p className="text-sm text-indigo-200 mt-0.5">Part 1~5 · 11문제 · 예상 점수 산출</p>
              </div>
              <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
