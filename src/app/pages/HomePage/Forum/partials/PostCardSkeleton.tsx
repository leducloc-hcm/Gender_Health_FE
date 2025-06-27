import { Skeleton } from '@/app/components/ui/skeleton'

export default function PostCardSkeleton() {
  return (
    <div className='bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200'>
      {/* Post Header */}
      <div className='flex items-start gap-4 mb-4'>
        <Skeleton className='h-12 w-12 rounded-full flex-shrink-0' />
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 mb-2'>
            <Skeleton className='h-5 w-32' />
            <Skeleton className='h-4 w-16 rounded-full' />
            <Skeleton className='h-4 w-20' />
          </div>
          <Skeleton className='h-6 w-3/4 mb-3' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-5/6' />
            <Skeleton className='h-4 w-4/5' />
          </div>
        </div>
        <div className='flex gap-1 opacity-0 group-hover:opacity-100'>
          <Skeleton className='h-8 w-8 rounded-lg' />
          <Skeleton className='h-8 w-8 rounded-lg' />
        </div>
      </div>

      {/* Post Image Skeleton */}
      <div className='mb-4'>
        <Skeleton className='h-64 w-full rounded-xl' />
      </div>

      {/* Post Tags */}
      <div className='flex flex-wrap gap-2 mb-4'>
        <Skeleton className='h-6 w-16 rounded-full' />
        <Skeleton className='h-6 w-20 rounded-full' />
        <Skeleton className='h-6 w-14 rounded-full' />
      </div>

      {/* Post Actions */}
      <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
        <div className='flex items-center space-x-4'>
          <Skeleton className='h-8 w-16 rounded-full' />
          <Skeleton className='h-8 w-20 rounded-full' />
        </div>
        <Skeleton className='h-8 w-24 rounded-full' />
      </div>
    </div>
  )
}
