import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    checkAuth: vi.fn().mockResolvedValue(null),
    isChecked: true,
    user: null,
  }),
}))

import LoginPage from '@/pages/LoginPage'

describe('LoginPage', () => {
  it('로그인 타이틀이 표시된다', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>)
    expect(screen.getByText('토익 스피킹 연습')).toBeInTheDocument()
  })

  it('카카오 로그인 버튼이 표시된다', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>)
    expect(screen.getByText('카카오로 시작하기')).toBeInTheDocument()
  })

  it('카카오 버튼 클릭 시 OAuth URL로 이동한다', () => {
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    })
    render(<MemoryRouter><LoginPage /></MemoryRouter>)
    fireEvent.click(screen.getByText('카카오로 시작하기'))
    expect(window.location.href).toBe('/oauth2/authorization/kakao')
  })
})
