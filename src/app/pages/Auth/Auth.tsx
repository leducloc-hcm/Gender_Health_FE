import { Outlet } from 'react-router-dom'

export default function Auth() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center p-4'>
      <div className='absolute top-10 left-10 w-16 h-16 bg-pink-200 rounded-full opacity-30 animate-pulse'></div>
      <div className='absolute bottom-20 right-16 w-12 h-12 bg-rose-200 rounded-full opacity-40 animate-bounce'></div>
      <div className='absolute top-1/3 right-20 w-10 h-10 bg-pink-300 rounded-full opacity-25'></div>

      <Outlet />
    </div>
  )
}
