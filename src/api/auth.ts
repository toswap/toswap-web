import apiClient from './client'
import type { User } from '@/types'

export const authApi = {
  getMe: () => apiClient.get<User>('/auth/me').then(r => r.data),

  logout: () => apiClient.post('/auth/logout'),

  updateProfile: (email: string) =>
    apiClient.patch<User>('/auth/profile', { email }).then(r => r.data),
}
