import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Button } from '@/app/components/ui/button'
import { Card, CardHeader } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Image as ImageIcon, Sparkles } from 'lucide-react'

interface CreatePostFormProps {
  onCreateClick: () => void
}

export default function CreatePostForm({ onCreateClick }: CreatePostFormProps) {
  return (
    <Card className='shadow-md border-0 bg-white/90 backdrop-blur-sm transition-all duration-300 overflow-hidden'>
      <div className='absolute inset-0 '></div>
      <CardHeader className='relative'>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <Avatar className='h-14 w-14 ring-4 ring-pink-100 shadow-lg'>
              <AvatarImage src='/placeholder.svg?height=56&width=56' alt='User' />
              <AvatarFallback className='bg-gradient-to-br from-pink-500 to-rose-500 text-white text-lg font-semibold'>
                JD
              </AvatarFallback>
            </Avatar>
            <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white'></div>
          </div>
          <div className='flex-1'>
            <Input
              placeholder="What's on your mind? Share your experience..."
              className='bg-gray-50/80 border-gray-200 cursor-pointer text-lg py-4 px-4 rounded-full hover:bg-gray-100/80 transition-all duration-200 focus:ring-2 focus:ring-pink-300'
              onClick={onCreateClick}
              readOnly
            />
          </div>
        </div>
        <div className='flex gap-3 mt-6 pt-4 border-t border-gray-100'>
          <Button
            onClick={onCreateClick}
            className='bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6'
          >
            <Sparkles className='h-4 w-4 mr-2' />
            Create Post
          </Button>
          <Button
            variant='outline'
            onClick={onCreateClick}
            className='border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 transition-all duration-200'
          >
            <ImageIcon className='h-4 w-4 mr-2' />
            Add Photo
          </Button>
        </div>
      </CardHeader>
    </Card>
  )
}
