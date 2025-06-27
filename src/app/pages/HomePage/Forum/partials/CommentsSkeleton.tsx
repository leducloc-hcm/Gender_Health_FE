import { Skeleton } from '@/app/components/ui/skeleton'

interface CommentSkeletonProps {
  count?: number
  level?: number
}

export function CommentSkeleton({ level = 0 }: { level?: number }) {
  const marginLeft = level === 0 ? 0 : level === 1 ? 48 : 72

  return (
    <div style={{ marginLeft: `${marginLeft}px` }}>
      <div className='flex gap-3 p-4 bg-white/60 rounded-xl border border-gray-100'>
        <Skeleton
          className={`${level === 0 ? 'h-10 w-10' : level === 1 ? 'h-9 w-9' : 'h-8 w-8'} rounded-full flex-shrink-0`}
        />
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 mb-2'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-4 w-12 rounded-full' />
            {level > 0 && <Skeleton className='h-4 w-20 rounded-full' />}
            <Skeleton className='h-3 w-16' />
          </div>
          <Skeleton className={`h-4 w-full mb-1 ${level > 1 ? 'text-sm' : ''}`} />
          <Skeleton className={`h-4 w-4/5 mb-3 ${level > 1 ? 'text-sm' : ''}`} />
          <div className='flex items-center gap-4'>
            <Skeleton className={`${level > 1 ? 'h-6 w-10' : 'h-7 w-12'} rounded-full`} />
            {level < 2 && <Skeleton className={`${level > 1 ? 'h-6 w-14' : 'h-7 w-16'} rounded-full`} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CommentsSkeleton({ count = 3, level = 0 }: CommentSkeletonProps) {
  return (
    <div className='space-y-4'>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          <CommentSkeleton level={level} />
          {/* Randomly add nested comments */}
          {level < 2 && Math.random() > 0.6 && (
            <div className='mt-4'>
              <CommentSkeleton level={level + 1} />
              {level === 0 && Math.random() > 0.7 && (
                <div className='mt-4'>
                  <CommentSkeleton level={level + 2} />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
