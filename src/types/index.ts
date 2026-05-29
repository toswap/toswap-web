// ── 사용자 ────────────────────────────────────────────────
export interface User {
  id: number
  name: string
  email: string | null
  profileImageUrl: string | null
  provider: 'kakao' | 'google'
  hasEmail: boolean
}

// ── 파트 ─────────────────────────────────────────────────
export type PartId = 1 | 2 | 3 | 4 | 5

// ── 연습 세션 ─────────────────────────────────────────────
export type SessionStatus = 'PENDING' | 'PROCESSING' | 'DONE' | 'ERROR'

export interface PracticeSessionItem {
  sessionId: number
  questionId: number
  sequenceNo: number | null
  content: string
  imageUrl: string | null
  prepSeconds: number
  responseSeconds: number
}

export interface PracticeSessionGroup {
  partId: PartId
  questionGroupId: number | null
  contextContent: string | null
  sessions: PracticeSessionItem[]
}

export interface PracticeSessionDetail {
  sessionId: number
  status: SessionStatus
  partId: PartId
  sequenceNo: number | null
  questionGroupId: number | null
  contextContent: string | null
  questionId: number
  content: string
  imageUrl: string | null
  prepSeconds: number
  responseSeconds: number
  createdAt: string
}

export interface PracticeHistoryItem {
  partId: PartId
  firstSessionId: number
  questionGroupId: number | null
  overallStatus: SessionStatus
  totalQuestions: number
  completedQuestions: number
  createdAt: string
}

// ── 피드백 ────────────────────────────────────────────────
export interface ImprovementItem {
  area: string
  issue: string
  suggestion: string
}

export interface Feedback {
  feedbackId: number
  sessionId: number
  transcript: string
  scorePronunciation: number
  scoreIntonation: number
  scoreGrammar: number
  scoreVocabulary: number
  scoreFluency: number
  scoreContent: number
  scoreOverall: number
  toeicLevel: string
  strengths: string[]
  improvements: ImprovementItem[]
  detailedComment: string
  evaluatedAt: string
}

// ── 시험 세션 ─────────────────────────────────────────────
export type ExamStatus = 'IN_PROGRESS' | 'EVALUATING' | 'COMPLETED' | 'ABANDONED'

export interface ExamPartData {
  partId: PartId
  questionGroupId: number | null
  contextContent: string | null
  sessions: PracticeSessionItem[]
}

export interface ExamSession {
  examSessionId: number
  parts: ExamPartData[]
}

export interface ExamSessionStatusItem {
  sessionId: number
  sequenceNo: number | null
  questionContent: string
  status: SessionStatus
}

export interface ExamSessionStatusPart {
  partId: PartId
  questionGroupId: number | null
  contextContent: string | null
  totalSessions: number
  completedSessions: number
  sessions: ExamSessionStatusItem[]
}

export interface ExamSessionStatus {
  examSessionId: number
  status: ExamStatus
  startedAt: string
  totalSessions: number
  completedSessions: number
  parts: ExamSessionStatusPart[]
}

export interface ExamPartResult {
  partId: PartId
  totalSessions: number
  completedSessions: number
  averageScore: number | null
}

export interface ExamResult {
  examSessionId: number
  status: ExamStatus
  predictedScore: number | null
  predictedLevel: number | null
  completedAt: string | null
  totalSessions: number
  completedSessions: number
  partResults: ExamPartResult[]
}

export interface ExamListItem {
  examSessionId: number
  status: ExamStatus
  predictedScore: number | null
  predictedLevel: number | null
  startedAt: string
  completedAt: string | null
}
