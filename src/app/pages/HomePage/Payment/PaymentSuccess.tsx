import { CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PaymentSuccess() {
  return (
    <>
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white'>
        <div className='text-center p-12 bg-white shadow-lg rounded-lg'>
          <div className='mb-4'>
            <CheckCircle className='w-32 h-auto text-green-600 mx-auto' />
          </div>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Payment Successful</h1>
          <p className='text-gray-600 mb-6 font-medium'>
            Thank you for your payment. Your transaction has been completed successfully.
          </p>
          <Link
            to='/'
            className='px-4 py-2 rounded-md font-medium transition-all duration-200 bg-pink-600 text-white hover:bg-pink-700'
            style={{ backgroundColor: '#E91E63' }}
          >
            Return Home
          </Link>
        </div>
      </div>
    </>
  )
}
