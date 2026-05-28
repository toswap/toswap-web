import axios from 'axios'

/**
 * 기본 Axios 인스턴스
 * - baseURL: Vite proxy를 통해 /api → http://localhost:8080/api 로 전달
 * - 401 응답 시 로그인 페이지로 리다이렉트
 */
const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,   // 쿠키(JWT refresh token) 포함
  headers: {
    'Content-Type': 'application/json',
  },
})

// 응답 인터셉터 — 인증 만료 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/'
    }
    return Promise.reject(error)
  },
)

export default apiClient
