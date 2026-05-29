import apiClient from './client'
import type { PartId, PracticeSessionGroup, PracticeSessionDetail, PracticeHistoryItem } from '@/types'

export const practiceApi = {
  start: (partId: PartId) =>
    apiClient.post<PracticeSessionGroup>('/practice-sessions', { partId }).then(r => r.data),

  getSession: (sessionId: number) =>
    apiClient.get<PracticeSessionDetail>(`/practice-sessions/${sessionId}`).then(r => r.data),

  getHistory: () =>
    apiClient.get<PracticeHistoryItem[]>('/practice-sessions').then(r => r.data),
}
