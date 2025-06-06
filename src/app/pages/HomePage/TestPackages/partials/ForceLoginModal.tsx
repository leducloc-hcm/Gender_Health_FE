import { Button } from '@/app/components/ui/button'
import { Card, CardContent } from '@/app/components/ui/card'
import { LogIn, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type ForceLoginModalProps = {
  handleCloseModal: () => void
}

export default function ForceLoginModal({ handleCloseModal }: ForceLoginModalProps) {
  const navigate = useNavigate()

  return (
    <>
      <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
        <Card className='w-full max-w-md mx-auto shadow-2xl border-0 bg-white relative'>
          <button
            onClick={handleCloseModal}
            className='absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors'
          >
            <X className='w-4 h-4 text-gray-600' />
          </button>

          <CardContent className='p-8 text-center'>
            <div className='w-20 h-20 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <LogIn className='w-10 h-10 text-pink-600' />
            </div>

            <h2 className='text-2xl font-bold text-gray-900 mb-3'>Login Required</h2>

            <p className='text-gray-600 mb-6 leading-relaxed'>
              To book test packages, <br /> please log in to your account.
            </p>

            <div className='space-y-3'>
              <Button
                onClick={() => navigate('/auth/login')}
                className='w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200'
              >
                <LogIn className='w-4 h-4 mr-2' />
                Login to Continue
              </Button>

              <Button
                variant='outline'
                onClick={handleCloseModal}
                className='w-full py-3 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg'
              >
                Maybe Later
              </Button>
            </div>

            <p className='text-sm text-gray-500 mt-4'>
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/auth/register')}
                className='text-pink-600 hover:text-pink-700 font-medium hover:underline'
              >
                Sign up here
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
