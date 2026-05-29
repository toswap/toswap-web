import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isChecked, isLoading, checkAuth } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isChecked) {
      checkAuth().then((u) => {
        if (!u) navigate('/', { replace: true })
        else if (!u.hasEmail) navigate('/additional-info', { replace: true })
      })
    }
  }, [isChecked, checkAuth, navigate])

  if (isLoading || !isChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
