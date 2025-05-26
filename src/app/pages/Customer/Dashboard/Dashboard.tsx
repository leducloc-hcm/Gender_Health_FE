import { Button } from '@/app/components/ui/button'
import { BookOpen, Heart, MessageCircle } from 'lucide-react'

export default function Dashboard() {
  return (
    <div>Dashboard</div>
    // <div className='flex flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-pink-50/30 via-white to-rose-50/30'>
    //   {/* Stats Cards */}
    //   <div className='grid auto-rows-min gap-6 md:grid-cols-3'>
    //     <div className='group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
    //       <div className='absolute inset-0 bg-gradient-to-br from-white/10 to-transparent' />
    //       <div className='relative flex items-center gap-4'>
    //         <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm'>
    //           <Heart className='h-7 w-7' />
    //         </div>
    //         <div>
    //           <h3 className='font-bold text-lg'>Cycle Tracking</h3>
    //           <p className='text-pink-100 text-sm'>Next period in 5 days</p>
    //           <div className='mt-2 h-1 w-16 bg-white/30 rounded-full'>
    //             <div className='h-1 w-12 bg-white rounded-full' />
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className='group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
    //       <div className='absolute inset-0 bg-gradient-to-br from-white/10 to-transparent' />
    //       <div className='relative flex items-center gap-4'>
    //         <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm'>
    //           <BookOpen className='h-7 w-7' />
    //         </div>
    //         <div>
    //           <h3 className='font-bold text-lg'>Health Articles</h3>
    //           <p className='text-blue-100 text-sm'>3 new articles today</p>
    //           <div className='mt-2 flex gap-1'>
    //             <div className='h-1 w-2 bg-white rounded-full' />
    //             <div className='h-1 w-2 bg-white/60 rounded-full' />
    //             <div className='h-1 w-2 bg-white/30 rounded-full' />
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className='group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
    //       <div className='absolute inset-0 bg-gradient-to-br from-white/10 to-transparent' />
    //       <div className='relative flex items-center gap-4'>
    //         <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm'>
    //           <MessageCircle className='h-7 w-7' />
    //         </div>
    //         <div>
    //           <h3 className='font-bold text-lg'>Community</h3>
    //           <p className='text-emerald-100 text-sm'>Join discussions</p>
    //           <div className='mt-2 flex items-center gap-1'>
    //             <div className='h-2 w-2 bg-white rounded-full animate-pulse' />
    //             <span className='text-xs'>3 active now</span>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Main Content Area */}
    //   <div className='flex-1 rounded-2xl bg-white shadow-sm border border-pink-100 p-8'>
    //     <div className='mx-auto max-w-3xl text-center'>
    //       <div className='mb-8'>
    //         <div className='inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 mb-4'>
    //           <Heart className='h-8 w-8 text-white' />
    //         </div>
    //         <h2 className='text-3xl font-bold text-gray-900 mb-4'>Welcome to Your Health Dashboard</h2>
    //         <p className='text-gray-600 text-lg leading-relaxed'>
    //           Track your menstrual cycle, read health articles, connect with the community, and manage your wellness
    //           journey all in one place.
    //         </p>
    //       </div>

    //       <div className='grid gap-4 md:grid-cols-2 max-w-lg mx-auto'>
    //         <Button className='h-12 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold'>
    //           <Heart className='mr-2 h-5 w-5' />
    //           Start Cycle Tracking
    //         </Button>
    //         <Button
    //           variant='outline'
    //           className='h-12 border-pink-200 text-pink-600 hover:bg-pink-50 rounded-xl font-semibold'
    //         >
    //           <BookOpen className='mr-2 h-5 w-5' />
    //           Browse Articles
    //         </Button>
    //       </div>

    //       <div className='mt-12 grid gap-6 md:grid-cols-3 text-left'>
    //         <div className='p-4 rounded-xl bg-pink-50 border border-pink-100'>
    //           <Calendar className='h-8 w-8 text-pink-500 mb-3' />
    //           <h3 className='font-semibold text-gray-900 mb-2'>Smart Tracking</h3>
    //           <p className='text-sm text-gray-600'>AI-powered cycle predictions and health insights</p>
    //         </div>
    //         <div className='p-4 rounded-xl bg-blue-50 border border-blue-100'>
    //           <Activity className='h-8 w-8 text-blue-500 mb-3' />
    //           <h3 className='font-semibold text-gray-900 mb-2'>Health Monitor</h3>
    //           <p className='text-sm text-gray-600'>Track symptoms, mood, and overall wellness</p>
    //         </div>
    //         <div className='p-4 rounded-xl bg-green-50 border border-green-100'>
    //           <MessageCircle className='h-8 w-8 text-green-500 mb-3' />
    //           <h3 className='font-semibold text-gray-900 mb-2'>Expert Support</h3>
    //           <p className='text-sm text-gray-600'>Connect with healthcare professionals</p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}
