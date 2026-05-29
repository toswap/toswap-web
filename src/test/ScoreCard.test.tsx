import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ScoreCard from '@/components/ScoreCard'

const defaultProps = {
  scorePronunciation: 7,
  scoreIntonation: 6,
  scoreGrammar: 8,
  scoreVocabulary: 7,
  scoreFluency: 6,
  scoreContent: 8,
  scoreOverall: 7,
  toeicLevel: '중고급 (Advanced)',
}

describe('ScoreCard', () => {
  it('종합 점수를 표시한다', () => {
    render(<ScoreCard {...defaultProps} />)
    expect(screen.getByText('종합 점수')).toBeInTheDocument()
    const overalls = screen.getAllByText('7')
    expect(overalls.length).toBeGreaterThan(0)
  })

  it('toeicLevel을 표시한다', () => {
    render(<ScoreCard {...defaultProps} />)
    expect(screen.getByText('중고급 (Advanced)')).toBeInTheDocument()
  })

  it('모든 점수 라벨을 렌더링한다', () => {
    render(<ScoreCard {...defaultProps} />)
    expect(screen.getByText('발음')).toBeInTheDocument()
    expect(screen.getByText('억양')).toBeInTheDocument()
    expect(screen.getByText('문법')).toBeInTheDocument()
    expect(screen.getByText('어휘')).toBeInTheDocument()
    expect(screen.getByText('유창성')).toBeInTheDocument()
    expect(screen.getByText('내용')).toBeInTheDocument()
  })

  it('점수 8 이상은 초록색 바를 사용한다', () => {
    const { container } = render(<ScoreCard {...defaultProps} scoreGrammar={9} />)
    expect(container.querySelector('.bg-green-500')).toBeInTheDocument()
  })

  it('점수 3 이하는 빨간색 바를 사용한다', () => {
    const { container } = render(<ScoreCard {...defaultProps} scoreOverall={2} scoreFluency={2} />)
    expect(container.querySelector('.bg-red-500')).toBeInTheDocument()
  })
})
