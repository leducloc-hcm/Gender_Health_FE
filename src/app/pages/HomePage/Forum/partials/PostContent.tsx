import type { QuestionData } from '@/app/pages/HomePage/Forum/models/question.type'

interface PostContentProps {
  question: QuestionData
}

export default function PostContent({ question }: PostContentProps) {
  return (
    <div className='mb-6'>
      <h2 className='text-xl font-bold text-gray-900 mb-4 transition-colors duration-200 leading-tight'>
        {question.title}
      </h2>

      <p className='text-gray-700 mb-6 leading-relaxed text-md'>{question.content}</p>

      {question.image && (
        <div className='mb-6 -mx-8 overflow-hidden '>
          <img
            src={question.image}
            alt='Post content'
            className='w-full h-auto max-h-80 object-contain transition-transform duration-300'
          />
        </div>
      )}
    </div>
  )
}
