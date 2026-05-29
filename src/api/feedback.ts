import apiClient from './client'
import type { Feedback } from '@/types'

export const feedbackApi = {
  submit: (sessionId: number, audioBlob: Blob) => {
    const form = new FormData()
    form.append('sessionId', String(sessionId))
    form.append('audio', audioBlob, 'recording.webm')
    // Content-Type 헤더를 직접 지정하지 않음 — axios가 FormData를 감지해
    // multipart/form-data; boundary=... 를 자동으로 설정해야 서버가 파싱 가능
    return apiClient
      .post<Feedback>('/feedbacks', form)
      .then(r => r.data)
  },

  getById: (feedbackId: number) =>
    apiClient.get<Feedback>(`/feedbacks/${feedbackId}`).then(r => r.data),

  getBySession: (sessionId: number) =>
    apiClient.get<Feedback>(`/feedbacks/session/${sessionId}`).then(r => r.data),
}
