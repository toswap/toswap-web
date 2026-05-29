import clsx from 'clsx'

interface ScoreItemProps {
  label: string
  score: number
  maxScore?: number
}

function ScoreBar({ label, score, maxScore = 10 }: ScoreItemProps) {
  const pct = (score / maxScore) * 100
  const color =
    score >= 8 ? 'bg-green-500' :
    score >= 6 ? 'bg-indigo-500' :
    score >= 4 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-20 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={clsx('h-full rounded-full transition-all duration-700', color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-semibold text-gray-800 w-8 text-right">{score}</span>
    </div>
  )
}

interface ScoreCardProps {
  scorePronunciation: number
  scoreIntonation: number
  scoreGrammar: number
  scoreVocabulary: number
  scoreFluency: number
  scoreContent: number
  scoreOverall: number
  toeicLevel: string
}

export default function ScoreCard(props: ScoreCardProps) {
  const { scoreOverall, toeicLevel } = props

  const overallColor =
    scoreOverall >= 8 ? 'text-green-600' :
    scoreOverall >= 6 ? 'text-indigo-600' :
    scoreOverall >= 4 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">종합 점수</p>
          <p className={clsx('text-4xl font-bold', overallColor)}>{scoreOverall}<span className="text-lg font-normal text-gray-400">/10</span></p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">예상 레벨</p>
          <p className="text-sm font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">{toeicLevel}</p>
        </div>
      </div>

      <div className="space-y-3">
        <ScoreBar label="발음" score={props.scorePronunciation} />
        <ScoreBar label="억양" score={props.scoreIntonation} />
        <ScoreBar label="문법" score={props.scoreGrammar} />
        <ScoreBar label="어휘" score={props.scoreVocabulary} />
        <ScoreBar label="유창성" score={props.scoreFluency} />
        <ScoreBar label="내용" score={props.scoreContent} />
      </div>
    </div>
  )
}
