export default function LoadingSpinner() {
  return (
    <div className='min-h-screen  flex items-center justify-center'>
      <div className='text-center'>
        <div className='relative'>
          <div className='animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 mx-auto'></div>
          <div className='absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-pink-300 opacity-20'></div>
        </div>
      </div>
    </div>
  )
}
