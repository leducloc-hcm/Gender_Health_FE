import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'
import { Heart, MessageCircle, Plus, Image as ImageIcon, Send, ChevronUp, X, Edit, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { questionApi } from '@/app/apis/question.api'
import type { QuestionData, questionResquest } from '@/app/pages/HomePage/Forum/models/question.type'
import { toast } from 'react-toastify'

export default function Forum() {
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showEditPost, setShowEditPost] = useState(false)
  const [editingPost, setEditingPost] = useState<QuestionData | null>(null)
  const [expandedComments, setExpandedComments] = useState<number[]>([])
  const [likedPosts, setLikedPosts] = useState<number[]>([])
  const [questions, setQuestions] = useState<QuestionData[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [newQuestion, setNewQuestion] = useState<questionResquest>({
    title: '',
    content: '',
    image: undefined
  })
  const [editQuestion, setEditQuestion] = useState<questionResquest>({
    title: '',
    content: '',
    image: undefined
  })

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const response = await questionApi.getAllQuestions()
      setQuestions(response.data || [])
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateQuestion = async () => {
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) {
      toast.error('Please fill in title and content')
      return
    }

    try {
      setCreating(true)
      const formData = new FormData()
      formData.append('title', newQuestion.title)
      formData.append('content', newQuestion.content)

      if (newQuestion.image) {
        formData.append('image', newQuestion.image)
      }

      await questionApi.createQuestion(formData)
      resetCreateForm()
      await fetchQuestions()
      toast.success('Question created successfully!')
    } catch (error) {
      console.error('Error creating question:', error)
      toast.error('Failed to create question')
    } finally {
      setCreating(false)
    }
  }

  const handleUpdateQuestion = async () => {
    if (!editQuestion.title.trim() || !editQuestion.content.trim() || !editingPost) {
      toast.warn('Please fill in title and content')
      return
    }

    try {
      setUpdating(true)
      const formData = new FormData()
      formData.append('title', editQuestion.title)
      formData.append('content', editQuestion.content)

      if (editQuestion.image) {
        formData.append('image', editQuestion.image)
      }

      await questionApi.updateQuestion(editingPost.id, formData)
      resetEditForm()
      await fetchQuestions()
      toast.success('Question updated successfully!')
    } catch (error) {
      console.error('Error updating question:', error)
      toast.error('Failed to update question')
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteQuestion = async (id: number) => {
    if (!confirm('Are you sure you want to delete this question?')) return

    try {
      await questionApi.deleteQuestion(id)
      await fetchQuestions()
      toast.success('Question deleted successfully!')
    } catch (error) {
      toast.error('Error deleting question:', error)
      alert('Failed to delete question')
    }
  }

  const resetCreateForm = () => {
    setNewQuestion({
      title: '',
      content: '',
      image: undefined
    })
    setShowCreatePost(false)
  }

  const resetEditForm = () => {
    setEditQuestion({
      title: '',
      content: '',
      image: undefined
    })
    setEditingPost(null)
    setShowEditPost(false)
  }

  const openEditModal = (question: QuestionData) => {
    setEditingPost(question)
    setEditQuestion({
      title: question.title,
      content: question.content,
      image: undefined
    })
    setShowEditPost(true)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = event.target.files?.[0]

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      if (isEdit) {
        setEditQuestion((prev) => ({ ...prev, image: file }))
      } else {
        setNewQuestion((prev) => ({ ...prev, image: file }))
      }
    }
  }

  const toggleComments = (postId: number) => {
    setExpandedComments((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
  }

  const toggleLike = (postId: number) => {
    setLikedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500'></div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50'>
      <div className='max-w-4xl mx-auto py-8 px-4'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent pb-4'>
            Gender's Health Forum Community
          </h1>
          <p className='text-gray-600 text-lg'>Share experiences, get support, and learn together</p>
        </div>

        <Card className='mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
          <CardHeader>
            <div className='flex items-center gap-4'>
              <Avatar className='h-12 w-12 border-2 border-pink-200'>
                <AvatarImage src='/placeholder.svg?height=48&width=48' alt='User' />
                <AvatarFallback className='bg-gradient-to-br from-pink-500 to-rose-500 text-white text-lg'>
                  JD
                </AvatarFallback>
              </Avatar>
              <div className='flex-1'>
                <Input
                  placeholder="What's on your mind? Share your experience..."
                  className='bg-gray-50 border-gray-200 cursor-pointer text-lg py-4 px-3'
                  onClick={() => setShowCreatePost(true)}
                  readOnly
                />
              </div>
            </div>
            <div className='flex gap-2 mt-4'>
              <Button
                onClick={() => setShowCreatePost(true)}
                className='bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white'
              >
                <Plus className='h-4 w-4 mr-2' />
                Create Post
              </Button>
              <Button variant='outline' onClick={() => setShowCreatePost(true)}>
                <ImageIcon className='h-4 w-4 mr-2' />
                Photo
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
            <Card className='w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
              <CardHeader className='border-b'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-xl font-semibold'>Create Post</h3>
                  <Button variant='ghost' size='sm' onClick={resetCreateForm}>
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='p-6'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-10 w-10'>
                      <AvatarImage src='/placeholder.svg?height=40&width=40' />
                      <AvatarFallback className='bg-gradient-to-br from-pink-500 to-rose-500 text-white'>
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-medium'>Jane Doe</p>
                    </div>
                  </div>
                  <Input
                    placeholder='Post title...'
                    className='text-lg font-medium'
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion((prev) => ({ ...prev, title: e.target.value }))}
                  />
                  <Textarea
                    placeholder='Share your thoughts, experiences, or ask questions...'
                    className='min-h-[120px] resize-none'
                    value={newQuestion.content}
                    onChange={(e) => setNewQuestion((prev) => ({ ...prev, content: e.target.value }))}
                  />
                  <div className='flex gap-2'>
                    <label className='flex-1'>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={(e) => handleImageUpload(e, false)}
                        className='hidden'
                      />
                      <Button variant='outline' className='flex-1 w-full' type='button' asChild>
                        <span>
                          <ImageIcon className='h-4 w-4 mr-2' />
                          {newQuestion.image ? `Selected: ${newQuestion.image.name}` : 'Add Photo'}
                        </span>
                      </Button>
                    </label>
                    {newQuestion.image && (
                      <div className='mt-4'>
                        <img
                          src={URL.createObjectURL(newQuestion.image)}
                          alt='Preview'
                          className='w-full h-48 object-cover rounded-lg border'
                        />
                      </div>
                    )}
                  </div>
                  <div className='flex gap-2 pt-4'>
                    <Button
                      className='bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white flex-1'
                      onClick={handleCreateQuestion}
                      disabled={creating}
                    >
                      <Send className='h-4 w-4 mr-2' />
                      {creating ? 'Posting...' : 'Post'}
                    </Button>
                    <Button variant='outline' onClick={resetCreateForm}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Post Modal */}
        {showEditPost && editingPost && (
          <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
            <Card className='w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
              <CardHeader className='border-b'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-xl font-semibold'>Edit Post</h3>
                  <Button variant='ghost' size='sm' onClick={resetEditForm}>
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='p-6'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-10 w-10'>
                      <AvatarImage src='/placeholder.svg?height=40&width=40' />
                      <AvatarFallback className='bg-gradient-to-br from-pink-500 to-rose-500 text-white'>
                        {editingPost.username?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-medium'>{editingPost.username || 'User'}</p>
                    </div>
                  </div>
                  <Input
                    placeholder='Post title...'
                    className='text-lg font-medium'
                    value={editQuestion.title}
                    onChange={(e) => setEditQuestion((prev) => ({ ...prev, title: e.target.value }))}
                  />
                  <Textarea
                    placeholder='Share your thoughts, experiences, or ask questions...'
                    className='min-h-[120px] resize-none'
                    value={editQuestion.content}
                    onChange={(e) => setEditQuestion((prev) => ({ ...prev, content: e.target.value }))}
                  />
                  <div className='flex gap-2'>
                    <label className='flex-1'>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={(e) => handleImageUpload(e, true)}
                        className='hidden'
                      />
                      <Button variant='outline' className='flex-1 w-full' type='button' asChild>
                        <span>
                          <ImageIcon className='h-4 w-4 mr-2' />
                          {editQuestion.image ? `Selected: ${editQuestion.image.name}` : 'Change Photo'}
                        </span>
                      </Button>
                    </label>
                    {editQuestion.image && (
                      <div className='mt-4'>
                        <img
                          src={URL.createObjectURL(editQuestion.image)}
                          alt='Preview'
                          className='w-full h-48 object-cover rounded-lg border'
                        />
                      </div>
                    )}
                  </div>
                  <div className='flex gap-2 pt-4'>
                    <Button
                      className='bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white flex-1'
                      onClick={handleUpdateQuestion}
                      disabled={updating}
                    >
                      <Send className='h-4 w-4 mr-2' />
                      {updating ? 'Updating...' : 'Update'}
                    </Button>
                    <Button variant='outline' onClick={resetEditForm}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className='space-y-6'>
          {questions.map((question) => (
            <Card
              key={question.id}
              className='shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200'
            >
              <CardContent className='p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex items-center space-x-3'>
                    <Avatar className='h-10 w-10 border-2 border-pink-200'>
                      <AvatarImage src={question.customerProfile.avatar} />
                      <AvatarFallback className='bg-gradient-to-br from-pink-500 to-rose-500 text-white'>
                        {question.customerProfile.name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className='flex items-center gap-2'>
                        <p className='font-semibold text-gray-900'>{question.customerProfile.name || 'Anonymous'}</p>
                      </div>
                      <p className='text-sm text-gray-500'>
                        {new Date(question.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button variant='ghost' size='sm' onClick={() => openEditModal(question)}>
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button variant='ghost' size='sm' onClick={() => handleDeleteQuestion(question.id)}>
                      <Trash2 className='h-4 w-4 text-red-500' />
                    </Button>
                  </div>
                </div>

                {/* Post Title */}
                <h2 className='text-xl font-semibold text-gray-900 mb-3 hover:text-pink-600 cursor-pointer transition-colors'>
                  {question.title}
                </h2>

                {/* Post Content */}
                <p className='text-gray-700 mb-4 leading-relaxed'>{question.content}</p>

                {/* Post Image */}
                {question.image && (
                  <div className='mb-4'>
                    <img
                      src={question.image}
                      alt='Post content'
                      className='w-full h-auto rounded-xl border border-gray-200 max-h-96 object-cover'
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                  <div className='flex items-center space-x-6'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className={`flex items-center space-x-2 ${likedPosts.includes(question.id) ? 'text-pink-600' : 'text-gray-600'} hover:text-pink-600 transition-colors`}
                      onClick={() => toggleLike(question.id)}
                    >
                      <Heart className={`h-5 w-5 ${likedPosts.includes(question.id) ? 'fill-current' : ''}`} />
                      <span className='font-medium'>{likedPosts.includes(question.id) ? 1 : 0}</span>
                    </Button>

                    <Button
                      variant='ghost'
                      size='sm'
                      className='flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors'
                      onClick={() => toggleComments(question.id)}
                    >
                      <MessageCircle className='h-5 w-5' />
                      <span className='font-medium'>0</span>
                    </Button>
                  </div>
                </div>

                {/* Comments Section */}
                {expandedComments.includes(question.id) && (
                  <div className='mt-6 pt-6 border-t border-gray-100'>
                    {/* Add Comment */}
                    <div className='flex space-x-3 mb-6'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage src='/placeholder.svg?height=32&width=32' />
                        <AvatarFallback className='bg-gradient-to-br from-pink-500 to-rose-500 text-white text-sm'>
                          U
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex-1'>
                        <Textarea
                          placeholder='Add a supportive comment...'
                          className='mb-2 resize-none bg-gray-50'
                          rows={2}
                        />
                        <div className='flex justify-end'>
                          <Button
                            size='sm'
                            className='bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white'
                          >
                            <Send className='h-3 w-3 mr-1' />
                            Comment
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Placeholder for comments - you can implement comment API later */}
                    <div className='text-center text-gray-500 py-8'>
                      <MessageCircle className='h-8 w-8 mx-auto mb-2 opacity-50' />
                      <p>No comments yet. Be the first to comment!</p>
                    </div>

                    {/* Show/Hide Comments Toggle */}
                    <div className='text-center mt-4'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => toggleComments(question.id)}
                        className='text-gray-500 hover:text-gray-700'
                      >
                        <ChevronUp className='h-4 w-4 mr-1' />
                        Hide Comments
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
