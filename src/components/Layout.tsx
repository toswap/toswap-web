import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import clsx from 'clsx'

interface Props {
  children: React.ReactNode
  title?: string
  showBack?: boolean
}

export default function Layout({ children, title, showBack }: Props) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const isDashboard = location.pathname === '/dashboard'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                aria-label="뒤로가기"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <button
              onClick={() => navigate('/dashboard')}
              className={clsx(
                'font-bold text-indigo-600 flex items-center gap-1.5',
                isDashboard ? 'text-lg' : 'text-base'
              )}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span>토익 스피킹</span>
            </button>
            {title && <span className="text-gray-400">/</span>}
            {title && <span className="text-gray-700 font-medium text-sm">{title}</span>}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/history')}
              className={clsx(
                'text-sm transition-colors',
                location.pathname === '/history'
                  ? 'text-indigo-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              기록
            </button>
            {user && (
              <div className="flex items-center gap-2">
                {user.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt={user.name} className="w-7 h-7 rounded-full" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600">
                    {user.name.charAt(0)}
                  </div>
                )}
                <button onClick={logout} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
