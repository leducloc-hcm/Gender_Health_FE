import { Button } from '@/app/components/ui/button'
import { Heart, MessageCircle, Share, Bookmark } from 'lucide-react'
import type { QuestionData } from '@/app/pages/HomePage/Forum/models/question.type'

interface PostActionsProps {
  question: QuestionData
  isLiked: boolean
  onLike: () => void
  onToggleComments: () => void
}

export default function PostActions({ question, isLiked, onLike, onToggleComments }: PostActionsProps) {
  return (
    <div className='flex items-center justify-between pt-6 border-t border-gray-100'>
      <div className='flex items-center space-x-6'>
        <Button
          variant='ghost'
          size='sm'
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 ${
            isLiked
              ? 'text-pink-600 bg-pink-50 hover:bg-pink-100 shadow-sm'
              : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
          }`}
          onClick={onLike}
        >
          <Heart
            className={`h-5 w-5 transition-all duration-200 ${
              isLiked ? 'fill-current text-pink-600 scale-110' : 'hover:scale-110'
            }`}
          />
          <span className={`font-semibold ${isLiked ? 'text-pink-600' : ''}`}>{question._count?.votes || 0}</span>
        </Button>

        <Button
          variant='ghost'
          size='sm'
          className='flex items-center space-x-2 px-4 py-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:scale-105'
          onClick={onToggleComments}
        >
          <MessageCircle className='h-5 w-5 hover:scale-110 transition-transform duration-200' />
          <span className='font-semibold'>{question._count?.replies || 0}</span>
        </Button>

        <Button
          variant='ghost'
          size='sm'
          className='flex items-center space-x-2 px-4 py-2 rounded-full text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 hover:scale-105'
        >
          <Share className='h-5 w-5 hover:scale-110 transition-transform duration-200' />
          <span className='font-semibold'>Share</span>
        </Button>
      </div>

      <Button
        variant='ghost'
        size='sm'
        className='text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 transition-all duration-200 p-2 rounded-full hover:scale-105'
      >
        <Bookmark className='h-5 w-5 hover:scale-110 transition-transform duration-200' />
      </Button>
    </div>
  )
}
