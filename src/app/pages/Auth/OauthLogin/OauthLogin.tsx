import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function OauthLogin() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  useEffect(() => {
    const access_token = params.get('access_token') as string
    const refresh_token = params.get('refresh_token') as string
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    navigate('/customer/dashboard')
  }, [params, navigate])
  return <div>OauthLogin</div>
}
