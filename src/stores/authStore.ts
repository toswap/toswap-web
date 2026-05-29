import { create } from 'zustand'
import { authApi } from '@/api/auth'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  isLoading: boolean
  isChecked: boolean
  checkAuth: () => Promise<User | null>
  logout: () => Promise<void>
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isChecked: false,

  checkAuth: async () => {
    set({ isLoading: true })
    try {
      const user = await authApi.getMe()
      set({ user, isChecked: true, isLoading: false })
      return user
    } catch {
      set({ user: null, isChecked: true, isLoading: false })
      return null
    }
  },

  logout: async () => {
    await authApi.logout()
    set({ user: null, isChecked: false })
    window.location.href = '/'
  },

  setUser: (user) => set({ user }),
}))
