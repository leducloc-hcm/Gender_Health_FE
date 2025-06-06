import { Button } from '@/app/components/ui/button'
import { ChevronUp, MessageCircle } from 'lucide-react'
import type { ReplyData } from '@/app/pages/HomePage/Forum/models/reply.type'
import AddCommentForm from '@/app/pages/HomePage/Forum/partials/AddCommentForm'
import CommentItem from '@/app/pages/HomePage/Forum/partials/CommentItem'

interface CommentsSectionProps {
  questionId: number
  replies: ReplyData[]
  replyLoading: boolean
  newComment: string
  editingReply: { replyId: number; content: string } | null
  isLiked: (questionId?: number, replyId?: number) => boolean
  onLike: (questionId?: number, replyId?: number) => void
  onCreateReply: (questionId: number) => void
  onUpdateReply: () => void
  onDeleteReply: (replyId: number, questionId: number) => void
  onCommentChange: (questionId: number, value: string) => void
  onEditReply: (editingReply: { replyId: number; content: string } | null) => void
  onToggleComments: () => void
}

export default function CommentsSection({
  questionId,
  replies,
  replyLoading,
  newComment,
  editingReply,
  isLiked,
  onLike,
  onCreateReply,
  onUpdateReply,
  onDeleteReply,
  onCommentChange,
  onEditReply,
  onToggleComments
}: CommentsSectionProps) {
  return (
    <div className='mt-8 pt-6 border-t border-gray-100'>
      {/* Add Comment Form */}
      <AddCommentForm
        questionId={questionId}
        newComment={newComment}
        onCommentChange={onCommentChange}
        onCreateReply={onCreateReply}
      />

      {/* Comments List */}
      {replyLoading ? (
        <div className='text-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-3'></div>
          <p className='text-gray-500 text-sm'>Loading comments...</p>
        </div>
      ) : replies && replies.length > 0 ? (
        <div className='space-y-4 mb-6'>
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              reply={reply}
              questionId={questionId}
              editingReply={editingReply}
              isLiked={isLiked}
              onLike={onLike}
              onUpdateReply={onUpdateReply}
              onDeleteReply={onDeleteReply}
              onEditReply={onEditReply}
            />
          ))}
        </div>
      ) : (
        <div className='text-center text-gray-500 py-12'>
          <div className='relative'>
            <MessageCircle className='h-16 w-16 mx-auto mb-4 opacity-20' />
            <div className='absolute inset-0 animate-pulse'>
              <MessageCircle className='h-16 w-16 mx-auto mb-4 opacity-10' />
            </div>
          </div>
          <h3 className='text-lg font-medium mb-2'>No comments yet</h3>
          <p className='text-sm'>Be the first to share your thoughts and support!</p>
        </div>
      )}

      {/* Hide Comments Toggle */}
      <div className='text-center mt-6'>
        <Button
          variant='ghost'
          size='sm'
          onClick={onToggleComments}
          className='text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 px-4 py-2 rounded-full'
        >
          <ChevronUp className='h-4 w-4 mr-2' />
          Hide Comments
        </Button>
      </div>
    </div>
  )
}
