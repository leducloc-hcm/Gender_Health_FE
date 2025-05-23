import axios, { type AxiosInstance } from 'axios'
import { BASE_URL } from '../constants/index.js'

const fetcher: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// fetcher.interceptors.request.use((config) => {
//   config.headers = {
//     ...config.headers,
//     accessToken: token ? `${token}` : "",
//   }

//   return config;
// })

export default fetcher;

