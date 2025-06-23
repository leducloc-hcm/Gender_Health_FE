import { Card, CardContent } from '@/app/components/ui/card'
import type { QuestionData } from '@/app/pages/HomePage/Forum/models/question.type'
import type { ReplyData } from '@/app/pages/HomePage/Forum/models/reply.type'
import CommentsSection from '@/app/pages/HomePage/Forum/partials/CommentsSection'
import PostActions from '@/app/pages/HomePage/Forum/partials/PostActions'
import PostContent from '@/app/pages/HomePage/Forum/partials/PostContent'
import PostHeader from '@/app/pages/HomePage/Forum/partials/PostHeader'

interface PostCardProps {
  question: QuestionData
  replies: ReplyData[]
  expandedComments: number[]
  replyLoading: boolean
  newComment: string
  editingReply: { replyId: number; content: string } | null
  replyingTo: { replyId: number; questionId: number } | null
  nestedReplyContent: string
  isLiked: (questionId?: number, replyId?: number) => boolean
  onLike: (questionId?: number, replyId?: number) => void
  onToggleComments: (questionId: number) => void
  onEdit: (question: QuestionData) => void
  onDelete: (id: number) => void
  onCreateReply: (questionId: number) => void
  onCreateNestedReply: (parentReplyId: number, questionId: number) => void
  onUpdateReply: () => void
  onDeleteReply: (replyId: number, questionId: number) => void
  onCommentChange: (questionId: number, value: string) => void
  onEditReply: (editingReply: { replyId: number; content: string } | null) => void
  onReplyTo: (replyingTo: { replyId: number; questionId: number } | null) => void
  onNestedReplyContentChange: (content: string) => void
}

export default function PostCard({
  question,
  replies,
  expandedComments,
  replyLoading,
  newComment,
  editingReply,
  replyingTo,
  nestedReplyContent,
  isLiked,
  onLike,
  onToggleComments,
  onEdit,
  onDelete,
  onCreateReply,
  onCreateNestedReply,
  onUpdateReply,
  onDeleteReply,
  onCommentChange,
  onEditReply,
  onReplyTo,
  onNestedReplyContentChange
}: PostCardProps) {
  return (
    <Card className='shadow-xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group'>
      <div className='absolute inset-0 bg-gradient-to-r from-pink-500/2 via-rose-500/2 to-purple-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
      <CardContent className='p-8 relative'>
        <PostHeader question={question} onEdit={() => onEdit(question)} onDelete={() => onDelete(question.id)} />

        <PostContent question={question} />

        <PostActions
          question={question}
          isLiked={isLiked(question.id)}
          onLike={() => onLike(question.id)}
          onToggleComments={() => onToggleComments(question.id)}
        />

        {expandedComments.includes(question.id) && (
          <CommentsSection
            questionId={question.id}
            replies={replies}
            replyLoading={replyLoading}
            newComment={newComment}
            editingReply={editingReply}
            replyingTo={replyingTo}
            nestedReplyContent={nestedReplyContent}
            isLiked={isLiked}
            onLike={onLike}
            onCreateReply={onCreateReply}
            onCreateNestedReply={onCreateNestedReply}
            onUpdateReply={onUpdateReply}
            onDeleteReply={onDeleteReply}
            onCommentChange={onCommentChange}
            onEditReply={onEditReply}
            onReplyTo={onReplyTo}
            onNestedReplyContentChange={onNestedReplyContentChange}
            onToggleComments={() => onToggleComments(question.id)}
          />
        )}
      </CardContent>
    </Card>
  )
}
