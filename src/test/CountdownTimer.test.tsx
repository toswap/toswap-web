import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import CountdownTimer from '@/components/CountdownTimer'

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('초기 초 값을 표시한다', () => {
    render(<CountdownTimer seconds={10} onComplete={vi.fn()} />)
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('1초 후 카운트다운된다', () => {
    render(<CountdownTimer seconds={10} onComplete={vi.fn()} />)
    act(() => { vi.advanceTimersByTime(1000) })
    expect(screen.getByText('9')).toBeInTheDocument()
  })

  it('0이 되면 onComplete를 호출한다', () => {
    const onComplete = vi.fn()
    render(<CountdownTimer seconds={1} onComplete={onComplete} />)
    act(() => { vi.advanceTimersByTime(1000) })
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('label이 있을 때 표시된다', () => {
    render(<CountdownTimer seconds={30} onComplete={vi.fn()} label="준비" />)
    expect(screen.getByText('준비')).toBeInTheDocument()
  })

  it('record variant는 빨간색 스타일을 사용한다', () => {
    const { container } = render(
      <CountdownTimer seconds={30} onComplete={vi.fn()} label="녹음 중" variant="record" />
    )
    expect(container.querySelector('.text-red-600')).toBeInTheDocument()
  })
})
