import { Skeleton } from '@/app/components/ui/skeleton'

export default function ForumSkeleton() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50'>
      <div className='container mx-auto max-w-4xl py-8 px-4'>
        {/* Header Skeleton */}
        <div className='text-center mb-8'>
          <Skeleton className='h-12 w-80 mx-auto mb-4' />
          <Skeleton className='h-6 w-96 mx-auto' />
        </div>

        {/* Create Post Form Skeleton */}
        <div className='bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm'>
          <div className='flex items-center gap-4'>
            <Skeleton className='h-12 w-12 rounded-full' />
            <Skeleton className='h-12 flex-1 rounded-xl' />
            <Skeleton className='h-10 w-24 rounded-lg' />
          </div>
        </div>

        {/* Post Cards Skeleton */}
        <div className='space-y-6'>
          {Array.from({ length: 3 }).map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

function PostCardSkeleton() {
  return (
    <div className='bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 shadow-sm'>
      {/* Post Header */}
      <div className='flex items-start gap-4 mb-4'>
        <Skeleton className='h-12 w-12 rounded-full flex-shrink-0' />
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 mb-2'>
            <Skeleton className='h-5 w-32' />
            <Skeleton className='h-4 w-16 rounded-full' />
            <Skeleton className='h-4 w-20' />
          </div>
          <Skeleton className='h-6 w-3/4 mb-2' />
          <Skeleton className='h-4 w-full mb-1' />
          <Skeleton className='h-4 w-5/6' />
        </div>
        <div className='flex gap-1'>
          <Skeleton className='h-8 w-8 rounded-lg' />
          <Skeleton className='h-8 w-8 rounded-lg' />
        </div>
      </div>

      {/* Post Image Skeleton */}
      <Skeleton className='h-64 w-full rounded-xl mb-4' />

      {/* Post Actions */}
      <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
        <div className='flex items-center space-x-4'>
          <Skeleton className='h-8 w-16 rounded-full' />
          <Skeleton className='h-8 w-20 rounded-full' />
        </div>
        <Skeleton className='h-8 w-24 rounded-full' />
      </div>

      {/* Comments Section Skeleton */}
      <div className='mt-6 pt-4 border-t border-gray-100'>
        <div className='space-y-4'>
          {Array.from({ length: 2 }).map((_, index) => (
            <CommentSkeleton key={index} level={0} />
          ))}
        </div>
      </div>
    </div>
  )
}

function CommentSkeleton({ level = 0 }: { level?: number }) {
  const marginLeft = level === 0 ? 0 : level === 1 ? 48 : 72

  return (
    <div style={{ marginLeft: `${marginLeft}px` }}>
      <div className='flex gap-3 p-4 bg-white/60 rounded-xl border border-gray-100'>
        <Skeleton className='h-10 w-10 rounded-full flex-shrink-0' />
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 mb-2'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-4 w-12 rounded-full' />
            {level > 0 && <Skeleton className='h-4 w-20 rounded-full' />}
            <Skeleton className='h-3 w-16' />
          </div>
          <Skeleton className='h-4 w-full mb-1' />
          <Skeleton className='h-4 w-4/5 mb-3' />
          <div className='flex items-center gap-4'>
            <Skeleton className='h-6 w-12 rounded-full' />
            {level < 2 && <Skeleton className='h-6 w-16 rounded-full' />}
          </div>
        </div>
      </div>

      {/* Nested comment skeletons */}
      {level < 2 && Math.random() > 0.5 && (
        <div className='mt-4'>
          <CommentSkeleton level={level + 1} />
        </div>
      )}
    </div>
  )
}
