export const apiLogin = axios.create({
  baseURL: 'http://52.221.179.12:4000',
  headers: {
    'Content-Type': 'application/json'
  }
})
