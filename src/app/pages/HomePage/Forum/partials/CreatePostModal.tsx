import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'
import { Label } from '@/app/components/ui/label'
import { X, Image as ImageIcon, Sparkles, Upload, Trash2 } from 'lucide-react'
import { useState, useRef } from 'react'
import type { questionResquest } from '@/app/pages/HomePage/Forum/models/question.type'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  newQuestion: questionResquest
  creating: boolean
  onQuestionChange: (question: questionResquest) => void
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
}

export default function CreatePostModal({
  isOpen,
  onClose,
  newQuestion,
  creating,
  onQuestionChange,
  onImageUpload,
  onSubmit
}: CreatePostModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      onImageUpload(event)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    onQuestionChange({ ...newQuestion, image: undefined })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-white  shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto m-4'>
        {/* Header */}
        <div className='border-b border-gray-200 p-6'>
          <div className='flex items-start justify-between'>
            <div>
              <h2 className='text-3xl font-bold text-gray-900 mb-2'>Create New Post</h2>
              <p className='text-gray-600'>Share your thoughts and connect with the community</p>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={onClose}
              className='h-10 w-10 p-0 hover:bg-gray-100 rounded-full transition-all duration-200 shrink-0 ml-4'
            >
              <X className='h-5 w-5' />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className='p-6'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Title Input */}
            <div className='space-y-3'>
              <Label htmlFor='title' className='text-lg font-semibold text-gray-800'>
                Title <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='title'
                placeholder='What would you like to discuss?'
                value={newQuestion.title}
                onChange={(e) => onQuestionChange({ ...newQuestion, title: e.target.value })}
                className='text-lg py-4 px-4 border-2 border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-xl transition-all duration-200'
                required
              />
            </div>

            {/* Content Textarea */}
            <div className='space-y-3'>
              <Label htmlFor='content' className='text-lg font-semibold text-gray-800'>
                Content <span className='text-red-500'>*</span>
              </Label>
              <Textarea
                id='content'
                placeholder='Share your experience, ask questions, or provide support...'
                value={newQuestion.content}
                onChange={(e) => onQuestionChange({ ...newQuestion, content: e.target.value })}
                className='min-h-[140px] text-base p-4 border-2 border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-xl resize-none transition-all duration-200'
                required
              />
            </div>

            {/* Image Upload Section */}
            <div className='space-y-3'>
              <Label className='text-lg font-semibold text-gray-800'>
                Image <span className='text-gray-500 font-normal text-sm'>(Optional)</span>
              </Label>

              {/* Hidden file input */}
              <input ref={fileInputRef} type='file' accept='image/*' onChange={handleImageChange} className='hidden' />

              {/* Image Preview or Upload Area */}
              {imagePreview ? (
                <div className='relative group'>
                  <div className='relative rounded-xl overflow-hidden border-2 border-gray-200'>
                    <img src={imagePreview} alt='Preview' className='w-full h-64 object-cover' />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4'>
                      <div className='flex gap-3'>
                        <Button
                          type='button'
                          onClick={triggerFileInput}
                          className='bg-white/90 text-gray-800 hover:bg-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200'
                        >
                          <Upload className='h-4 w-4 mr-2' />
                          Change
                        </Button>
                        <Button
                          type='button'
                          onClick={removeImage}
                          className='bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200'
                        >
                          <Trash2 className='h-4 w-4 mr-2' />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                  {newQuestion.image && (
                    <div className='text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg mt-3 border border-gray-200'>
                      📎 {newQuestion.image.name} • {(newQuestion.image.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onClick={triggerFileInput}
                  className='border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl p-10 text-center cursor-pointer transition-all duration-200 bg-gray-50 hover:bg-gray-100 group'
                >
                  <div className='flex flex-col items-center space-y-4'>
                    <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200'>
                      <ImageIcon className='h-8 w-8 text-gray-600' />
                    </div>
                    <div>
                      <p className='text-lg font-medium text-gray-700 mb-1'>Click to upload an image</p>
                      <p className='text-sm text-gray-500'>PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className='flex justify-end gap-4 pt-6 border-t border-gray-200'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                className='px-8 py-3 text-base border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={creating || !newQuestion.title.trim() || !newQuestion.content.trim()}
                className='px-8 py-3 text-base bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {creating ? (
                  <div className='flex items-center'>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3'></div>
                    Creating Post...
                  </div>
                ) : (
                  <div className='flex items-center'>
                    <Sparkles className='h-5 w-5 mr-2' />
                    Create Post
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
