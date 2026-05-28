import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage    from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import PracticePage  from '@/pages/PracticePage'
import FeedbackPage  from '@/pages/FeedbackPage'
import HistoryPage   from '@/pages/HistoryPage'

/**
 * 애플리케이션 라우터 최상위 컴포넌트
 *
 * 라우트 구조:
 *   /              → 로그인 페이지
 *   /dashboard     → 파트 선택 / 대시보드
 *   /practice/:partId → 연습 세션
 *   /feedback/:sessionId → AI 피드백 결과
 *   /history       → 연습 이력
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                       element={<LoginPage />} />
        <Route path="/dashboard"              element={<DashboardPage />} />
        <Route path="/practice/:partId"       element={<PracticePage />} />
        <Route path="/feedback/:sessionId"    element={<FeedbackPage />} />
        <Route path="/history"                element={<HistoryPage />} />
        {/* 정의되지 않은 경로는 로그인으로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
