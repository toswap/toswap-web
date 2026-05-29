import apiClient from './client'
import type { ExamSession, ExamSessionStatus, ExamResult, ExamListItem } from '@/types'

export const examApi = {
  start: () =>
    apiClient.post<ExamSession>('/exam-sessions').then(r => r.data),

  getStatus: (examSessionId: number) =>
    apiClient.get<ExamSessionStatus>(`/exam-sessions/${examSessionId}`).then(r => r.data),

  getResult: (examSessionId: number) =>
    apiClient.get<ExamResult>(`/exam-sessions/${examSessionId}/result`).then(r => r.data),

  getList: () =>
    apiClient.get<ExamListItem[]>('/exam-sessions').then(r => r.data),

  abandon: (examSessionId: number) =>
    apiClient.patch(`/exam-sessions/${examSessionId}/abandon`),
}
