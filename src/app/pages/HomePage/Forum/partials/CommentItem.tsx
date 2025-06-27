import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Button } from '@/app/components/ui/button'
import { Textarea } from '@/app/components/ui/textarea'
import type { ReplyData } from '@/app/pages/HomePage/Forum/models/reply.type'
import { Clock, Edit, Heart, MessageCircle, Shield, Trash2, CornerDownRight } from 'lucide-react'
import { sUserProfile } from '@/app/hooks/sUserProfile'

interface CommentItemProps {
  reply: ReplyData
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
  isNested?: boolean
  nestingLevel?: number
  allReplies?: ReplyData[]
}

export default function CommentItem({
  reply,
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
  onNestedReplyContentChange,
  nestingLevel = 0,
  allReplies = []
}: CommentItemProps) {
  const currentUser = sUserProfile.use()

  const canEditDelete =
    reply.customerProfileId === currentUser.customer_profile_id ||
    reply.staffProfileId === currentUser.customer_profile_id

  // Tìm thông tin parent reply để hiển thị "reply to ai"
  const parentReply = reply.parentReplyId ? allReplies.find((r) => r.id === reply.parentReplyId) : null

  const getParentName = () => {
    if (!parentReply) return 'someone'
    return parentReply.customerProfile?.name || parentReply.staffProfile?.name || 'someone'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const isEditing = editingReply?.replyId === reply.id
  const isReplying = replyingTo?.replyId === reply.id

  // Responsive sizing dựa trên nesting level
  const getResponsiveSize = (nestingLevel: number) => {
    if (nestingLevel === 0) return { avatar: 'h-10 w-10', text: 'text-base', padding: 'p-5' }
    if (nestingLevel === 1) return { avatar: 'h-9 w-9', text: 'text-sm', padding: 'p-4' }
    if (nestingLevel === 2) return { avatar: 'h-8 w-8', text: 'text-sm', padding: 'p-3' }
    return { avatar: 'h-7 w-7', text: 'text-xs', padding: 'p-3' }
  }

  const sizes = getResponsiveSize(nestingLevel)

  // Background color dựa trên nesting level
  const getBackgroundClass = (nestingLevel: number) => {
    if (nestingLevel === 0) return 'bg-white/80 border-gray-100 hover:border-pink-200 hover:bg-white/90'
    if (nestingLevel === 1)
      return 'bg-gradient-to-r from-purple-50/70 to-blue-50/70 border-purple-100/60 hover:border-purple-200'
    if (nestingLevel === 2)
      return 'bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border-blue-100/60 hover:border-blue-200'
    return 'bg-gradient-to-r from-gray-50/70 to-slate-50/70 border-gray-100/60 hover:border-gray-200'
  }

  return (
    <div
      className={`group flex space-x-3 backdrop-blur-sm rounded-xl border transition-all duration-200 ${getBackgroundClass(nestingLevel)} ${sizes.padding}`}
    >
      <div className='relative flex-shrink-0'>
        <Avatar
          className={`ring-2 shadow-md transition-all duration-200 ${sizes.avatar} ${
            nestingLevel === 0 ? 'ring-purple-100' : 'ring-purple-200'
          }`}
        >
          <AvatarImage src={reply.customerProfile?.avatar || reply.staffProfile?.avatar} />
          <AvatarFallback
            className={`text-white font-semibold ${
              nestingLevel <= 1
                ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-sm'
                : 'bg-gradient-to-br from-purple-400 to-blue-400 text-xs'
            }`}
          >
            {(reply.customerProfile?.name || reply.staffProfile?.name)?.[0] || 'U'}
          </AvatarFallback>
        </Avatar>

        {/* Online Status Indicator chỉ cho level 0 */}
        {nestingLevel === 0 && (
          <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white bg-green-400'></div>
        )}
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-2'>
              <h4 className={`font-semibold text-gray-900 ${sizes.text}`}>
                {reply.customerProfile?.name || reply.staffProfile?.name || 'Anonymous'}
              </h4>

              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
                  reply.authorType === 'STAFF' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                } ${nestingLevel > 1 ? 'text-xs' : 'text-xs'}`}
              >
                <Shield className={`${nestingLevel > 1 ? 'h-2 w-2' : 'h-2.5 w-2.5'}`} />
                {reply.authorType === 'STAFF' ? 'Staff' : 'Member'}
              </div>

              {/* Nested Reply Indicator - hiển thị reply ai */}
              {nestingLevel > 0 && reply.parentReplyId && (
                <div className='flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium text-xs'>
                  <CornerDownRight className='h-2 w-2' />
                  <span>Reply to {getParentName()}</span>
                </div>
              )}
            </div>

            <div className={`flex items-center gap-1 text-gray-500 ${nestingLevel > 1 ? 'text-xs' : 'text-xs'}`}>
              <Clock className={`${nestingLevel > 1 ? 'h-3 w-3' : 'h-3 w-3'}`} />
              <span>{formatDate(reply.createdAt)}</span>
            </div>
          </div>

          {/* Edit/Delete buttons - chỉ hiển thị nếu có quyền */}
          {canEditDelete && (
            <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onEditReply({ replyId: reply.id, content: reply.content })}
                className={`p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 ${
                  nestingLevel > 1 ? 'h-6 w-6' : 'h-7 w-7'
                }`}
              >
                <Edit className='h-3 w-3' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onDeleteReply(reply.id, questionId)}
                className={`p-0 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 ${
                  nestingLevel > 1 ? 'h-6 w-6' : 'h-7 w-7'
                }`}
              >
                <Trash2 className='h-3 w-3' />
              </Button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className='space-y-3'>
            <Textarea
              value={editingReply.content}
              onChange={(e) => onEditReply(editingReply ? { ...editingReply, content: e.target.value } : null)}
              className={`resize-none bg-gray-50 border-gray-200 focus:border-pink-400 focus:ring-pink-300 rounded-lg ${sizes.text}`}
              rows={3}
            />
            <div className='flex gap-2'>
              <Button
                size='sm'
                onClick={onUpdateReply}
                className='bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs px-4'
              >
                Update
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => onEditReply(null)}
                className='text-xs px-4 border-gray-300 text-gray-600 hover:bg-gray-50'
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className={`text-gray-700 mb-3 leading-relaxed ${sizes.text}`}>{reply.content}</p>

            <div className='flex items-center space-x-4'>
              <Button
                variant='ghost'
                size='sm'
                className={`flex items-center space-x-1 rounded-full transition-all duration-200 ${
                  isLiked(undefined, reply.id)
                    ? 'text-pink-600 bg-pink-50 hover:bg-pink-100'
                    : 'text-gray-500 hover:text-pink-600 hover:bg-pink-50'
                } ${nestingLevel > 1 ? 'h-6 px-2' : 'h-7 px-3'}`}
                onClick={() => onLike(undefined, reply.id)}
              >
                <Heart
                  className={`${nestingLevel > 1 ? 'h-3 w-3' : 'h-3 w-3'} ${isLiked(undefined, reply.id) ? 'fill-current' : ''}`}
                />
                <span className='text-xs font-medium'>{reply._count?.votes || 0}</span>
              </Button>

              {/* Reply button - có thể reply ở bất kỳ level nào */}
              <Button
                variant='ghost'
                size='sm'
                className='text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-full text-xs'
                style={{ height: nestingLevel > 1 ? '24px' : '28px', padding: '0 12px' }}
                onClick={() => onReplyTo({ replyId: reply.id, questionId })}
              >
                <MessageCircle className='h-3 w-3 mr-1' />
                <span>Reply</span>
                {/* Hiển thị số lượng replies nếu có */}
                {reply._count?.childReplies && reply._count.childReplies > 0 && (
                  <span className='ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full'>
                    {reply._count.childReplies}
                  </span>
                )}
              </Button>
            </div>

            {/* Nested Reply Form */}
            {isReplying && (
              <div className='mt-4 space-y-3 p-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-lg border border-blue-200/60 backdrop-blur-sm'>
                <div className='flex items-center gap-2 text-sm text-gray-700'>
                  <CornerDownRight className='h-3 w-3 text-blue-500' />
                  <span>
                    Replying to{' '}
                    <span className='font-medium text-blue-600'>
                      {reply.customerProfile?.name || reply.staffProfile?.name}
                    </span>
                  </span>
                </div>
                <Textarea
                  value={nestedReplyContent}
                  onChange={(e) => onNestedReplyContentChange(e.target.value)}
                  placeholder='Write your reply...'
                  className='text-sm resize-none border-blue-200 focus:border-blue-400 focus:ring-blue-300 bg-white/60'
                  rows={3}
                />
                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    onClick={() => onCreateNestedReply(reply.id, questionId)}
                    className='bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs px-4 flex items-center gap-1'
                  >
                    <CornerDownRight className='h-3 w-3' />
                    Reply
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => onReplyTo(null)}
                    className='text-xs px-4 border-gray-300 text-gray-600 hover:bg-gray-50'
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
