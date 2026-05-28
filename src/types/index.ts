// ── 사용자 ────────────────────────────────────────────────
export interface User {
  id: number
  email: string
  name: string
  provider: 'google' | 'kakao'
}

// ── 문제 ─────────────────────────────────────────────────
export type PartId = 1 | 2 | 3 | 4 | 5 | 6

export interface Question {
  id: number
  partId: PartId
  text: string        // 문제 지문 / 질문 텍스트
  imageUrl?: string   // Part 2: 사진 URL
  prepSeconds: number
  responseSeconds: number
}

// ── 연습 세션 ──────────────────────────────────────────────
export interface PracticeSession {
  id: number
  partId: PartId
  questionId: number
  status: 'pending' | 'processing' | 'done' | 'error'
  createdAt: string
}

// ── AI 피드백 ──────────────────────────────────────────────
export interface FeedbackScore {
  pronunciation: number  // 0–100
  grammar:       number
  vocabulary:    number
  fluency:       number
  content:       number
  overall:       number
}

export interface Feedback {
  id: number
  sessionId: number
  score: FeedbackScore
  transcript: string          // Gemini가 인식한 텍스트
  strengths: string[]
  improvements: string[]
  detailedComment: string
  createdAt: string
}
