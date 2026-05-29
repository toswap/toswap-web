import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import AdditionalInfoPage from '@/pages/AdditionalInfoPage'
import DashboardPage from '@/pages/DashboardPage'
import PracticePage from '@/pages/PracticePage'
import FeedbackPage from '@/pages/FeedbackPage'
import HistoryPage from '@/pages/HistoryPage'
import ExamPage from '@/pages/ExamPage'
import ExamResultPage from '@/pages/ExamResultPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/additional-info" element={<AdditionalInfoPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/practice/:partId" element={<PracticePage />} />
        <Route path="/feedback/:sessionId" element={<FeedbackPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/exam/:examSessionId/result" element={<ExamResultPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
