import axios from 'axios'

export const fetcher = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// fetcher.interceptors.request.use((config) => {
//   const token = localStorage.getItem('access_token')
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// fetcher.interceptors.request.use((config) => {
//   config.headers = {
//     ...config.headers,
//     accessToken: token ? `${token}` : "",
//   }

//   return config;
// })
