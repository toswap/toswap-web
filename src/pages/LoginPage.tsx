import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function LoginPage() {
  const { checkAuth } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth().then(u => {
      if (!u) return
      if (!u.hasEmail) navigate('/additional-info', { replace: true })
      else navigate('/dashboard', { replace: true })
    })
  }, [])

  const handleKakaoLogin = () => {
    window.location.href = '/oauth2/authorization/kakao'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-indigo-100 p-10 flex flex-col items-center gap-8">

        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-200">
            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">토익 스피킹 연습</h1>
          <p className="text-sm text-gray-500">AI 피드백으로 스피킹 실력을 키워보세요</p>
        </div>

        <div className="w-full space-y-3">
          <button
            onClick={handleKakaoLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl bg-[#FEE500] hover:bg-[#F5DC00] active:scale-[0.98] transition-all font-semibold text-gray-900 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#3C1E1E">
              <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.755 1.698 5.18 4.27 6.617L5.18 21l4.717-3.12C10.563 18.123 11.273 18.2 12 18.2c5.523 0 10-3.477 10-7.8S17.523 3 12 3z"/>
            </svg>
            카카오로 시작하기
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center leading-relaxed">
          로그인 시 서비스 이용약관 및<br/>개인정보 처리방침에 동의하게 됩니다
        </p>
      </div>
    </div>
  )
}
