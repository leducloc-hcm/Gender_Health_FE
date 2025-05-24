import { fetcher } from '@/app/apis/fetcher'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    const token = searchParams.get('token')
    const data = {
      email_verify_token: token
    }
    console.log('token: ', token)
    if (!token) {
      navigate('/auth/login', { replace: true })
      return
    }
    const verifyTokenEmail = async () => {
      try {
        const response = await fetcher.post('/users/verify-email', data)
        if (response.status === 200) {
          setStatus('verified')
          navigate('/auth/login', { replace: true })
          toast.success('Email verified successfully!', {
            position: 'top-right',
            autoClose: 5000
          })
        } else {
          setStatus('failed')
          navigate('/auth/login', { replace: true })
          toast.error('Email verification failed. Please try again.', {
            position: 'top-right',
            autoClose: 5000
          })
        }
      } catch (error) {
        setStatus('failed')
        navigate('/auth/login', { replace: true })
        if (error instanceof Error) {
          toast.error(error.message, {
            position: 'top-right',
            autoClose: 500
          })
        } else {
          toast.error('An unexpected error occurred. Please try again.', {
            position: 'top-right',
            autoClose: 500
          })
        }
      }
    }
    verifyTokenEmail()
  }, [navigate, searchParams])
  return <div>VerifyEmail</div>
}

export default VerifyEmail
