import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/app/components/ui/dropdown-menu'
import { Edit, Trash2, Clock, Shield, MoreHorizontal } from 'lucide-react'
import type { QuestionData } from '@/app/pages/HomePage/Forum/models/question.type'
import { sUserProfile } from '@/app/hooks/sUserProfile'

interface PostHeaderProps {
  question: QuestionData
  onEdit: () => void
  onDelete: () => void
}

export default function PostHeader({ question, onEdit, onDelete }: PostHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  const currentUserId = sUserProfile.value.customer_profile_id
  const isOwner = currentUserId === question.customerProfile.id

  return (
    <div className='flex items-start justify-between mb-6'>
      <div className='flex items-center space-x-4'>
        <div className='relative'>
          <Avatar className='h-12 w-12 ring-3 ring-pink-100 shadow-lg'>
            <AvatarImage src={question.customerProfile?.avatar} />
            <AvatarFallback className='bg-gradient-to-br from-pink-500 to-rose-500 text-white font-semibold'>
              {question.customerProfile?.name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white'></div>
        </div>
        <div className='flex-1'>
          <div className='flex items-center gap-3'>
            <h3 className='font-semibold text-gray-900 text-lg'>{question.customerProfile?.name || 'Anonymous'}</h3>
            <div className='flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium'>
              <Shield className='h-3 w-3' />
              Verified
            </div>
            {isOwner && (
              <div className='flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium'>
                Your Question
              </div>
            )}
          </div>
          <div className='flex items-center gap-2 text-sm text-gray-500 mt-1'>
            <Clock className='h-4 w-4' />
            <span>{formatDate(question.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Only show dropdown menu if user owns this post */}
      {isOwner && (
        <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200'
              >
                <MoreHorizontal className='h-4 w-4 text-gray-600' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48 bg-white border border-gray-200 shadow-lg rounded-lg p-1'>
              <DropdownMenuItem
                onClick={onEdit}
                className='flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md cursor-pointer transition-colors duration-200'
              >
                <Edit className='h-4 w-4' />
                Edit Post
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className='flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md cursor-pointer transition-colors duration-200'
              >
                <Trash2 className='h-4 w-4' />
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}
