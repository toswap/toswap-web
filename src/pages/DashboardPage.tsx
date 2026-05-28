import { useNavigate } from 'react-router-dom'

const PARTS = [
  { id: 1, label: 'Part 1', title: '문장 읽기',         desc: '주어진 문장을 큰 소리로 읽으세요.',                   questions: 2,  prepSec: 45,  respSec: 45  },
  { id: 2, label: 'Part 2', title: '사진 묘사하기',      desc: '사진 속 상황을 영어로 묘사하세요.',                   questions: 1,  prepSec: 30,  respSec: 45  },
  { id: 3, label: 'Part 3', title: '질문에 답하기',      desc: '세 개의 질문에 즉흥적으로 답하세요.',                  questions: 3,  prepSec: 3,   respSec: 15  },
  { id: 4, label: 'Part 4', title: '정보를 활용한 답변', desc: '제공된 정보를 바탕으로 세 개의 질문에 답하세요.',       questions: 3,  prepSec: 30,  respSec: 30  },
  { id: 5, label: 'Part 5', title: '해결책 제안',        desc: '문제 상황을 듣고 해결책을 제안하세요.',               questions: 1,  prepSec: 30,  respSec: 60  },
  { id: 6, label: 'Part 6', title: '의견 제시하기',      desc: '주어진 주제에 대해 자신의 의견을 말하세요.',           questions: 1,  prepSec: 15,  respSec: 60  },
] as const

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">🎙 토익 스피킹 연습</h1>
        <button
          onClick={() => navigate('/history')}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          연습 이력 보기
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">파트 선택</h2>
        <p className="text-gray-500 mb-8">연습하고 싶은 파트를 선택하세요.</p>

        <div className="grid gap-4">
          {PARTS.map((part) => (
            <button
              key={part.id}
              onClick={() => navigate(`/practice/${part.id}`)}
              className="bg-white rounded-xl border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all p-5 text-left flex items-center gap-5"
            >
              <span className="text-3xl font-extrabold text-indigo-200 w-14 shrink-0">
                {part.label}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{part.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{part.desc}</p>
              </div>
              <div className="text-right text-xs text-gray-400 shrink-0">
                <p>{part.questions}문항</p>
                <p>답변 {part.respSec}초</p>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
