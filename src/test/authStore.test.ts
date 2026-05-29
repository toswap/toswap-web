import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act } from '@testing-library/react'

vi.mock('@/api/auth', () => ({
  authApi: {
    getMe: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn(),
  },
}))

import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/api/auth'

const mockUser = {
  id: 1,
  name: '홍길동',
  email: 'hong@example.com',
  profileImageUrl: null,
  provider: 'kakao' as const,
  hasEmail: true,
}

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isChecked: false, isLoading: false })
    vi.clearAllMocks()
  })

  it('초기 상태는 user가 null이다', () => {
    const { user } = useAuthStore.getState()
    expect(user).toBeNull()
  })

  it('checkAuth 성공 시 user가 설정된다', async () => {
    vi.mocked(authApi.getMe).mockResolvedValue(mockUser)
    await act(async () => {
      await useAuthStore.getState().checkAuth()
    })
    expect(useAuthStore.getState().user).toEqual(mockUser)
    expect(useAuthStore.getState().isChecked).toBe(true)
  })

  it('checkAuth 실패 시 user가 null로 유지된다', async () => {
    vi.mocked(authApi.getMe).mockRejectedValue(new Error('401'))
    await act(async () => {
      await useAuthStore.getState().checkAuth()
    })
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().isChecked).toBe(true)
  })

  it('setUser로 유저를 직접 설정할 수 있다', () => {
    useAuthStore.getState().setUser(mockUser)
    expect(useAuthStore.getState().user).toEqual(mockUser)
  })
})
