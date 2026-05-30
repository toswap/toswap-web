import apiClient from './client'
import type { Feedback } from '@/types'

export const feedbackApi = {
  submit: (sessionId: number, audioBlob: Blob) => {
    if (audioBlob.size === 0) {
      return Promise.reject(new Error('마이크 권한이 없거나 녹음에 실패했습니다.'))
    }
    const form = new FormData()
    form.append('sessionId', String(sessionId))
    form.append('audio', audioBlob, 'recording.webm')
    return apiClient
      .post<Feedback>('/feedbacks', form)
      .then(r => r.data)
  },

  getById: (feedbackId: number) =>
    apiClient.get<Feedback>(`/feedbacks/${feedbackId}`).then(r => r.data),

  getBySession: (sessionId: number) =>
    apiClient.get<Feedback>(`/feedbacks/session/${sessionId}`).then(r => r.data),
}
