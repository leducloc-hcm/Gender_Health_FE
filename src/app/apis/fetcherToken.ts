import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
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
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/refresh-token`, {
            refresh_token: refreshToken
          })

          if (response.data?.result?.access_token) {
            localStorage.setItem('access_token', response.data.result.access_token)

            if (response.data.result?.refresh_token) {
              localStorage.setItem('refresh_token', response.data.result.refresh_token)
            }

            originalRequest.headers.Authorization = `Bearer ${response.data.result.access_token}`

            return api(originalRequest)
          }
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')

        window.location.href = '/auth/login'

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
