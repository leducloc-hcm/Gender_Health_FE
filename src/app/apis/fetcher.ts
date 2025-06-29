import axios from 'axios'

export const fetcher = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

fetcher.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

fetcher.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const refreshResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/refresh-token`, {
            refresh_token: refreshToken
          })
          const newAccessToken = refreshResponse.data.access_token
          const newRefreshToken = refreshResponse.data.refresh_token
          if (newAccessToken) {
            localStorage.setItem('access_token', newAccessToken)
            localStorage.setItem('refresh_token', newRefreshToken)
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return fetcher(originalRequest)
          }
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_role')
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)
