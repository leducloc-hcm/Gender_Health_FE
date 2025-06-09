import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Button } from '@/app/components/ui/button'
import { Textarea } from '@/app/components/ui/textarea'
import { Edit, Trash2, Heart, Clock, Shield } from 'lucide-react'
import type { ReplyData } from '@/app/pages/HomePage/Forum/models/reply.type'

interface CommentItemProps {
  reply: ReplyData
  questionId: number
  editingReply: { replyId: number; content: string } | null
  isLiked: (questionId?: number, replyId?: number) => boolean
  onLike: (questionId?: number, replyId?: number) => void
  onUpdateReply: () => void
  onDeleteReply: (replyId: number, questionId: number) => void
  onEditReply: (editingReply: { replyId: number; content: string } | null) => void
}

export default function CommentItem({
  reply,
  questionId,
  editingReply,
  isLiked,
  onLike,
  onUpdateReply,
  onDeleteReply,
  onEditReply
}: CommentItemProps) {
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

  return (
    <div className='group flex space-x-4 bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-gray-100 hover:border-pink-200 hover:bg-white/80 transition-all duration-200'>
      <div className='relative'>
        <Avatar className='h-10 w-10 ring-2 ring-purple-100 shadow-md'>
          <AvatarImage src={reply.customerProfile?.avatar} />
          <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold text-sm'>
            {reply.customerProfile?.name?.[0] || 'U'}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <h4 className='font-semibold text-gray-900 text-sm'>{reply.customerProfile?.name || 'Anonymous'}</h4>
              <div className='flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium'>
                <Shield className='h-2.5 w-2.5' />
                Member
              </div>
            </div>
            <div className='flex items-center gap-1 text-xs text-gray-500'>
              <Clock className='h-3 w-3' />
              <span>{formatDate(reply.createdAt)}</span>
            </div>
          </div>

          <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onEditReply({ replyId: reply.id, content: reply.content })}
              className='h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200'
            >
              <Edit className='h-3 w-3' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onDeleteReply(reply.id, questionId)}
              className='h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600 transition-colors duration-200'
            >
              <Trash2 className='h-3 w-3' />
            </Button>
          </div>
        </div>

        {isEditing ? (
          <div className='space-y-3'>
            <Textarea
              value={editingReply.content}
              onChange={(e) => onEditReply(editingReply ? { ...editingReply, content: e.target.value } : null)}
              className='text-sm resize-none bg-gray-50 border-gray-200 focus:border-pink-400 focus:ring-pink-300 rounded-lg'
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
            <p className='text-gray-700 mb-3 leading-relaxed'>{reply.content}</p>
            <div className='flex items-center space-x-4'>
              <Button
                variant='ghost'
                size='sm'
                className={`flex items-center space-x-1 h-7 px-3 rounded-full transition-all duration-200 ${
                  isLiked(undefined, reply.id)
                    ? 'text-pink-600 bg-pink-50 hover:bg-pink-100'
                    : 'text-gray-500 hover:text-pink-600 hover:bg-pink-50'
                }`}
                onClick={() => onLike(undefined, reply.id)}
              >
                <Heart className={`h-3 w-3 ${isLiked(undefined, reply.id) ? 'fill-current' : ''}`} />
                <span className='text-xs font-medium'>{reply._count?.votes || 0}</span>
              </Button>

              <Button
                variant='ghost'
                size='sm'
                className='text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 h-7 px-3 rounded-full text-xs'
              >
                Reply
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
