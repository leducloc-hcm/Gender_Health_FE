import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { questionApi } from '@/app/apis/question.api'
import { replyApi } from '@/app/apis/reply.api'
import { voteApi } from '@/app/apis/vote.api'
import type { QuestionData, questionResquest } from '@/app/pages/HomePage/Forum/models/question.type'
import type { ReplyData, ReplyRequest } from '@/app/pages/HomePage/Forum/models/reply.type'
import type { VoteRequest, VoteData } from '@/app/pages/HomePage/Forum/models/vote.type'

import ForumHeader from './partials/ForumHeader'
import CreatePostForm from './partials/CreatePostForm'
import PostCard from './partials/PostCard'
import CreatePostModal from './partials/CreatePostModal'
import EditPostModal from './partials/EditPostModal'
import LoadingSpinner from './partials/LoadingSpinner'
import { sUserProfile } from '@/app/hooks/sUserProfile'

export default function Forum() {
  // States
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showEditPost, setShowEditPost] = useState(false)
  const [editingPost, setEditingPost] = useState<QuestionData | null>(null)
  const [expandedComments, setExpandedComments] = useState<number[]>([])
  const [questions, setQuestions] = useState<QuestionData[]>([])
  const [replies, setReplies] = useState<{ [questionId: number]: ReplyData[] }>({})
  const [newComment, setNewComment] = useState<{ [questionId: number]: string }>({})
  const [editingReply, setEditingReply] = useState<{ replyId: number; content: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [replyLoading, setReplyLoading] = useState<{ [questionId: number]: boolean }>({})
  const [userLikes, setUserLikes] = useState<{ [key: string]: VoteData }>({})
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

      // Fetch user votes for all questions
      const votePromises = (response.data || []).map((question) => fetchUserVote(question.id))
      await Promise.all(votePromises)
    } catch (error) {
      console.error('Error fetching questions:', error)
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserVote = async (questionId?: number, replyId?: number) => {
    try {
      const currentUserId = sUserProfile.value.id
      if (!currentUserId) return

      let response
      if (questionId) {
        response = await voteApi.getVoteByQuestionId(questionId)
      } else if (replyId) {
        response = await voteApi.getVoteByReplyId(replyId)
      } else {
        return
      }
      const userVote = response.data?.find((vote) => vote.userId === currentUserId)

      if (userVote) {
        const voteKey = questionId ? `question_${questionId}` : `reply_${replyId}`
        setUserLikes((prev) => ({ ...prev, [voteKey]: userVote }))
      }
    } catch (error) {
      console.error('Error fetching user vote:', error)
    }
  }

  const fetchReplies = async (questionId: number) => {
    try {
      setReplyLoading((prev) => ({ ...prev, [questionId]: true }))
      const response = await replyApi.getRepliesByQuestionId(questionId)
      setReplies((prev) => ({ ...prev, [questionId]: response.data || [] }))

      for (const reply of response.data || []) {
        await fetchUserVote(undefined, reply.id)
      }
    } catch (error) {
      console.error('Error fetching replies:', error)
      toast.error('Failed to load comments')
    } finally {
      setReplyLoading((prev) => ({ ...prev, [questionId]: false }))
    }
  }

  const handleLike = async (questionId?: number, replyId?: number) => {
    const voteKey = questionId ? `question_${questionId}` : `reply_${replyId}`
    const existingVote = userLikes[voteKey]

    try {
      if (existingVote) {
        await voteApi.deleteVote(existingVote.id)
        setUserLikes((prev) => {
          const newLikes = { ...prev }
          delete newLikes[voteKey]
          return newLikes
        })

        if (questionId) {
          setQuestions((prev) =>
            prev.map((q) =>
              q.id === questionId ? { ...q, _count: { ...q._count, votes: (q._count?.votes || 1) - 1 } } : q
            )
          )
        }
        toast.success('Like removed')
      } else {
        // Like: Create a new vote
        const voteData: VoteRequest = {
          question_id: questionId,
          reply_id: replyId,
          vote_type: 'UP'
        }
        const response = await voteApi.createVote(voteData)
        setUserLikes((prev) => ({ ...prev, [voteKey]: response.data }))

        // Update the question's vote count immediately for better UX
        if (questionId) {
          setQuestions((prev) =>
            prev.map((q) =>
              q.id === questionId ? { ...q, _count: { ...q._count, votes: (q._count?.votes || 0) + 1 } } : q
            )
          )
        }
        toast.success('Liked!')
      }

      // Optionally refresh the data to ensure accuracy
      // await fetchQuestions()
    } catch (error) {
      console.error('Error handling like:', error)
      toast.error('Failed to like')
    }
  }

  const handleCreateReply = async (question_id: number) => {
    const content = newComment[question_id]?.trim()
    if (!content) {
      toast.error('Please enter a comment')
      return
    }

    try {
      const replyData: ReplyRequest = {
        content,
        question_id,
        parent_reply_id: undefined,
        author_type: localStorage.getItem('user_role') || 'CUSTOMER'
      }

      await replyApi.createReply(replyData)
      setNewComment((prev) => ({ ...prev, [question_id]: '' }))
      await fetchReplies(question_id)
      toast.success('Comment added successfully!')
    } catch (error) {
      console.error('Error creating reply:', error)
      toast.error('Failed to add comment')
    }
  }

  const handleUpdateReply = async () => {
    if (!editingReply || !editingReply.content.trim()) {
      toast.error('Please enter comment content')
      return
    }

    try {
      const replyData = { content: editingReply.content }
      await replyApi.updateReply(editingReply.replyId, replyData)
      setEditingReply(null)

      const refreshPromises = expandedComments.map((questionId) => fetchReplies(questionId))
      await Promise.all(refreshPromises)
      toast.success('Comment updated successfully!')
    } catch (error) {
      console.error('Error updating reply:', error)
      toast.error('Failed to update comment')
    }
  }

  const handleDeleteReply = async (replyId: number, questionId: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      await replyApi.deleteReply(replyId)
      await fetchReplies(questionId)
      toast.success('Comment deleted successfully!')
    } catch (error) {
      console.error('Error deleting reply:', error)
      toast.error('Failed to delete comment')
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
      toast.success('Post created successfully!')
    } catch (error) {
      console.error('Error creating question:', error)
      toast.error('Failed to create post')
    } finally {
      setCreating(false)
    }
  }

  const handleUpdateQuestion = async () => {
    if (!editQuestion.title.trim() || !editQuestion.content.trim() || !editingPost) {
      toast.error('Please fill in title and content')
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
      toast.success('Post updated successfully!')
    } catch (error) {
      console.error('Error updating question:', error)
      toast.error('Failed to update post')
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteQuestion = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await questionApi.deleteQuestion(id)
      await fetchQuestions()
      toast.success('Post deleted successfully!')
    } catch (error) {
      console.error('Error deleting question:', error)
      toast.error('Failed to delete post')
    }
  }

  const resetCreateForm = () => {
    setNewQuestion({ title: '', content: '', image: undefined })
    setShowCreatePost(false)
  }

  const resetEditForm = () => {
    setEditQuestion({ title: '', content: '', image: undefined })
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

  const toggleComments = async (questionId: number) => {
    const isExpanding = !expandedComments.includes(questionId)
    setExpandedComments((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    )

    if (isExpanding && !replies[questionId]) {
      await fetchReplies(questionId)
    }
  }

  const isLiked = (questionId?: number, replyId?: number) => {
    const voteKey = questionId ? `question_${questionId}` : `reply_${replyId}`
    console.log(voteKey)

    return !!userLikes[voteKey]
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50'>
      <div className='container mx-auto max-w-4xl py-8 px-4'>
        <ForumHeader />

        <CreatePostForm onCreateClick={() => setShowCreatePost(true)} />

        <div className='space-y-6 mt-8'>
          {questions.map((question) => (
            <PostCard
              key={question.id}
              question={question}
              replies={replies[question.id] || []}
              expandedComments={expandedComments}
              replyLoading={replyLoading[question.id] || false}
              newComment={newComment[question.id] || ''}
              editingReply={editingReply}
              isLiked={isLiked}
              onLike={handleLike}
              onToggleComments={toggleComments}
              onEdit={openEditModal}
              onDelete={handleDeleteQuestion}
              onCreateReply={handleCreateReply}
              onUpdateReply={handleUpdateReply}
              onDeleteReply={handleDeleteReply}
              onCommentChange={(questionId, value) => setNewComment((prev) => ({ ...prev, [questionId]: value }))}
              onEditReply={setEditingReply}
            />
          ))}
        </div>

        {showCreatePost && (
          <CreatePostModal
            isOpen={showCreatePost}
            onClose={resetCreateForm}
            newQuestion={newQuestion}
            creating={creating}
            onQuestionChange={setNewQuestion}
            onImageUpload={(e) => handleImageUpload(e, false)}
            onSubmit={handleCreateQuestion}
          />
        )}

        {showEditPost && editingPost && (
          <EditPostModal
            isOpen={showEditPost}
            onClose={resetEditForm}
            editQuestion={editQuestion}
            editingPost={editingPost}
            updating={updating}
            onQuestionChange={setEditQuestion}
            onImageUpload={(e) => handleImageUpload(e, true)}
            onSubmit={handleUpdateQuestion}
          />
        )}
      </div>
    </div>
  )
}
