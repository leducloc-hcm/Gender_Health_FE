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
  replyingTo: { replyId: number; questionId: number } | null
  nestedReplyContent: string
  isLiked: (questionId?: number, replyId?: number) => boolean
  onLike: (questionId?: number, replyId?: number) => void
  onCreateReply: (questionId: number) => void
  onCreateNestedReply: (parentReplyId: number, questionId: number) => void
  onUpdateReply: () => void
  onDeleteReply: (replyId: number, questionId: number) => void
  onCommentChange: (questionId: number, value: string) => void
  onEditReply: (editingReply: { replyId: number; content: string } | null) => void
  onReplyTo: (replyingTo: { replyId: number; questionId: number } | null) => void
  onNestedReplyContentChange: (content: string) => void
  onToggleComments: () => void
}

// Component đệ quy để render nested replies
const NestedReplyTree = ({
  replies,
  parentId,
  level = 0,
  questionId,
  editingReply,
  replyingTo,
  nestedReplyContent,
  isLiked,
  onLike,
  onUpdateReply,
  onDeleteReply,
  onEditReply,
  onReplyTo,
  onCreateNestedReply,
  onNestedReplyContentChange
}: {
  replies: ReplyData[]
  parentId: number | null
  level?: number
  questionId: number
  editingReply: { replyId: number; content: string } | null
  replyingTo: { replyId: number; questionId: number } | null
  nestedReplyContent: string
  isLiked: (questionId?: number, replyId?: number) => boolean
  onLike: (questionId?: number, replyId?: number) => void
  onUpdateReply: () => void
  onDeleteReply: (replyId: number, questionId: number) => void
  onEditReply: (editingReply: { replyId: number; content: string } | null) => void
  onReplyTo: (replyingTo: { replyId: number; questionId: number } | null) => void
  onCreateNestedReply: (parentReplyId: number, questionId: number) => void
  onNestedReplyContentChange: (content: string) => void
}) => {
  const currentLevelReplies = replies.filter((reply) => reply.parentReplyId === parentId)

  if (currentLevelReplies.length === 0) return null

  const maxIndentLevel = 6 // Giới hạn max indent để tránh quá nhỏ
  const currentIndent = Math.min(level, maxIndentLevel)
  const marginLeft = currentIndent * 12 // 12px per level

  return (
    <div
      className={`space-y-4 ${level > 0 ? `ml-${marginLeft}` : ''}`}
      style={{ marginLeft: level > 0 ? `${marginLeft * 4}px` : '0' }}
    >
      {currentLevelReplies.map((reply) => (
        <div key={reply.id} className='relative'>
          {/* Connection lines cho nested levels */}
          {level > 0 && (
            <>
              {/* Vertical line */}
              <div
                className='absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-200 via-purple-100 to-transparent opacity-60'
                style={{ left: '-24px' }}
              />
              {/* Horizontal line */}
              <div className='absolute top-6 w-6 h-0.5 bg-purple-200 opacity-60' style={{ left: '-24px' }} />
              {/* Dot indicator */}
              <div className='absolute top-5.5 w-1.5 h-1.5 bg-purple-300 rounded-full' style={{ left: '-26px' }} />
            </>
          )}

          <CommentItem
            reply={reply}
            questionId={questionId}
            editingReply={editingReply}
            replyingTo={replyingTo}
            nestedReplyContent={nestedReplyContent}
            isLiked={isLiked}
            onLike={onLike}
            onUpdateReply={onUpdateReply}
            onDeleteReply={onDeleteReply}
            onEditReply={onEditReply}
            onReplyTo={onReplyTo}
            onCreateNestedReply={onCreateNestedReply}
            onNestedReplyContentChange={onNestedReplyContentChange}
            isNested={level > 0}
            nestingLevel={level}
          />

          {/* Recursive render cho children */}
          <NestedReplyTree
            replies={replies}
            parentId={reply.id}
            level={level + 1}
            questionId={questionId}
            editingReply={editingReply}
            replyingTo={replyingTo}
            nestedReplyContent={nestedReplyContent}
            isLiked={isLiked}
            onLike={onLike}
            onUpdateReply={onUpdateReply}
            onDeleteReply={onDeleteReply}
            onEditReply={onEditReply}
            onReplyTo={onReplyTo}
            onCreateNestedReply={onCreateNestedReply}
            onNestedReplyContentChange={onNestedReplyContentChange}
          />
        </div>
      ))}
    </div>
  )
}

export default function CommentsSection({
  questionId,
  replies,
  replyLoading,
  newComment,
  editingReply,
  replyingTo,
  nestedReplyContent,
  isLiked,
  onLike,
  onCreateReply,
  onCreateNestedReply,
  onUpdateReply,
  onDeleteReply,
  onCommentChange,
  onEditReply,
  onReplyTo,
  onNestedReplyContentChange,
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
        <div className='space-y-6 mb-6'>
          {/* Render tất cả comments với cấu trúc đệ quy */}
          <NestedReplyTree
            replies={replies}
            parentId={null}
            level={0}
            questionId={questionId}
            editingReply={editingReply}
            replyingTo={replyingTo}
            nestedReplyContent={nestedReplyContent}
            isLiked={isLiked}
            onLike={onLike}
            onUpdateReply={onUpdateReply}
            onDeleteReply={onDeleteReply}
            onEditReply={onEditReply}
            onReplyTo={onReplyTo}
            onCreateNestedReply={onCreateNestedReply}
            onNestedReplyContentChange={onNestedReplyContentChange}
          />
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
