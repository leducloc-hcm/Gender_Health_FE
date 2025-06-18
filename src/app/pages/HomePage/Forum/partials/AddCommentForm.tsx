import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Button } from '@/app/components/ui/button'
import { Textarea } from '@/app/components/ui/textarea'
import { sUserProfile } from '@/app/hooks/sUserProfile'
import { Send, Smile } from 'lucide-react'

interface AddCommentFormProps {
  questionId: number
  newComment: string
  onCommentChange: (questionId: number, value: string) => void
  onCreateReply: (questionId: number) => void
}

export default function AddCommentForm({
  questionId,
  newComment,
  onCommentChange,
  onCreateReply
}: AddCommentFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      onCreateReply(questionId)
    }
  }

  const userAvatarUrl = sUserProfile.value?.avatar

  return (
    <div className='bg-gradient-to-r from-pink-50/50 to-purple-50/50 rounded-2xl p-6 mb-6 border border-pink-100'>
      <div className='flex space-x-4'>
        <div className='relative'>
          <Avatar className='h-10 w-10 ring-2 ring-pink-200 shadow-md'>
            <AvatarImage src={userAvatarUrl} />
            <AvatarFallback className='bg-gradient-to-br from-pink-500 to-rose-500 text-white font-semibold text-sm'>
              You
            </AvatarFallback>
          </Avatar>
        </div>
        <form onSubmit={handleSubmit} className='flex-1'>
          <div className='relative'>
            <Textarea
              placeholder='Share your thoughts and support...'
              className='min-h-[80px] resize-none bg-white/80 border-pink-200 focus:border-pink-400 focus:ring-pink-300 rounded-xl text-gray-700 placeholder:text-gray-400'
              value={newComment}
              onChange={(e) => onCommentChange(questionId, e.target.value)}
            />
            <div className='absolute bottom-3 right-3 opacity-30'>
              <Smile className='h-4 w-4 text-pink-400' />
            </div>
          </div>

          <div className='flex items-center justify-between mt-4'>
            <div className='flex items-center space-x-2'></div>

            <Button
              type='submit'
              disabled={!newComment.trim()}
              className='bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <Send className='h-4 w-4 mr-2' />
              Comment
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
