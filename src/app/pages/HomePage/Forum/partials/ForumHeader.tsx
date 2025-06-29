export default function ForumHeader() {
  return (
    <div className='text-center mb-8'>
      <div className='relative'>
        <h1 className='text-5xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-rose-600 bg-clip-text text-transparent pb-4'>
          Health Community Forum
        </h1>
        <div className='absolute inset-0 bg-gradient-to-r from-pink-600/10 via-rose-500/10 to-purple-600/10 blur-3xl -z-10'></div>
      </div>
      <p className='text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed'>
        Connect with others, share your journey, and find support in our caring community
      </p>
    </div>
  )
}
