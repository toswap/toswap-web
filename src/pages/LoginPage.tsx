/**
 * 로그인 페이지
 * Google / Kakao 소셜 로그인 버튼만 제공합니다.
 * OAuth2 흐름은 Spring Boot 서버(/oauth2/authorization/*)가 처리합니다.
 */
export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = '/oauth2/authorization/google'
  }

  const handleKakaoLogin = () => {
    window.location.href = '/oauth2/authorization/kakao'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6">

        {/* 로고 / 타이틀 */}
        <div className="text-center">
          <div className="text-4xl mb-2">🎙</div>
          <h1 className="text-2xl font-bold text-gray-900">토익 스피킹 연습</h1>
          <p className="text-sm text-gray-500 mt-1">AI 피드백으로 스피킹 실력을 키워보세요</p>
        </div>

        {/* 소셜 로그인 버튼 */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            {/* Google 로고 */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google로 계속하기
          </button>

          <button
            onClick={handleKakaoLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#FEE500] hover:bg-[#F5DC00] transition-colors font-medium text-gray-900"
          >
            {/* Kakao 로고 */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#3C1E1E">
              <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.755 1.698 5.18 4.27 6.617L5.18 21l4.717-3.12C10.563 18.123 11.273 18.2 12 18.2c5.523 0 10-3.477 10-7.8S17.523 3 12 3z"/>
            </svg>
            카카오로 계속하기
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center">
          로그인 시 서비스 이용약관에 동의하게 됩니다
        </p>
      </div>
    </div>
  )
}
