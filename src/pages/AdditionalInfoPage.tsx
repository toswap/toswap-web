import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'

export default function AdditionalInfoPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { setUser } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) {
      setError('올바른 이메일 형식을 입력해주세요.')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      const user = await authApi.updateProfile(email)
      setUser(user)
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      const code = err.response?.data?.code
      if (code === 'EMAIL_ALREADY_EXISTS') setError('이미 사용 중인 이메일입니다.')
      else setError('이메일 등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-indigo-100 p-10 flex flex-col gap-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">이메일을 입력해주세요</h1>
          <p className="text-sm text-gray-500">카카오 계정에서 이메일을 가져올 수 없었습니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              placeholder="example@email.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm transition-all"
              autoFocus
              required
            />
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold transition-all active:scale-[0.98]"
          >
            {isLoading ? '등록 중...' : '계속하기'}
          </button>
        </form>
      </div>
    </div>
  )
}
