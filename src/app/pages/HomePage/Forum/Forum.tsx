import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Plus,
  Image as ImageIcon,
  Send,
  Bookmark,
  ChevronUp,
  X
} from 'lucide-react'
import { useState } from 'react'

export default function Forum() {
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [expandedComments, setExpandedComments] = useState<number[]>([])
  const [likedPosts, setLikedPosts] = useState<number[]>([])

  const posts = [
    {
      id: 1,
      category: 'Menstrual Health',
      author: 'HealthyWoman23',
      avatar: '/placeholder.svg?height=32&width=32',
      time: '2 hours ago',
      title: 'Tips for managing severe period cramps naturally',
      content:
        "I've been dealing with really painful cramps for years and wanted to share some natural remedies that have helped me. Heat therapy, gentle yoga, and magnesium supplements have made a huge difference in my monthly experience.",
      likes: 127,
      comments: 34,
      image: null,
      isLiked: false
    },
    {
      id: 2,
      category: 'Mental Health',
      author: 'MindfulMama',
      avatar: '/placeholder.svg?height=32&width=32',
      time: '4 hours ago',
      title: "Dealing with PMS mood swings - you're not alone",
      content:
        "Sometimes I feel like I'm going crazy with the emotional ups and downs before my period. Here's what helps me stay grounded during those difficult days.",
      likes: 89,
      comments: 56,
      image: '/placeholder.svg?height=300&width=500',
      isLiked: false
    },
    {
      id: 3,
      category: 'Lifestyle',
      author: 'WellnessJourney',
      avatar: '/placeholder.svg?height=32&width=32',
      time: '6 hours ago',
      title: 'My cycle tracking journey - 1 year update',
      content:
        "It's been exactly one year since I started tracking my cycle properly. The insights I've gained about my body have been incredible!",
      likes: 203,
      comments: 78,
      image: null,
      isLiked: false
    }
  ]

  const postComments = {
    1: [
      {
        id: 1,
        author: 'NaturalHealing',
        avatar: '/placeholder.svg?height=24&width=24',
        time: '1 hour ago',
        content:
          "Thank you for sharing! I've tried heat therapy and it works wonders. Have you tried chamomile tea? It also helps with relaxation.",
        likes: 12
      },
      {
        id: 2,
        author: 'YogaLover22',
        avatar: '/placeholder.svg?height=24&width=24',
        time: '30 minutes ago',
        content:
          "Child's pose and gentle twists are my go-to yoga poses during my period. They really help with the discomfort.",
        likes: 8
      }
    ],
    2: [
      {
        id: 3,
        author: 'SupportiveSister',
        avatar: '/placeholder.svg?height=24&width=24',
        time: '2 hours ago',
        content:
          "You're definitely not alone! I track my mood changes and it helps me prepare mentally for those tough days.",
        likes: 15
      }
    ],
    3: [
      {
        id: 4,
        author: 'DataDriven',
        avatar: '/placeholder.svg?height=24&width=24',
        time: '3 hours ago',
        content:
          "This is so inspiring! I've been tracking for 6 months and already see patterns. What app do you recommend?",
        likes: 9
      }
    ]
  }

  const toggleComments = (postId: number) => {
    setExpandedComments((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
  }

  const toggleLike = (postId: number) => {
    setLikedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
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
                  <Button variant='ghost' size='sm' onClick={() => setShowCreatePost(false)}>
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
                      <select className='text-sm text-gray-500 bg-transparent border-none outline-none'>
                        <option>🩺 Menstrual Health</option>
                        <option>🧠 Mental Health</option>
                        <option>💪 Lifestyle</option>
                        <option>👥 General Discussion</option>
                      </select>
                    </div>
                  </div>
                  <Input placeholder='Post title...' className='text-lg font-medium' />
                  <Textarea
                    placeholder='Share your thoughts, experiences, or ask questions...'
                    className='min-h-[120px] resize-none'
                  />
                  <div className='flex gap-2'>
                    <Button variant='outline' className='flex-1'>
                      <ImageIcon className='h-4 w-4 mr-2' />
                      Add Photo
                    </Button>
                  </div>
                  <div className='flex gap-2 pt-4'>
                    <Button className='bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white flex-1'>
                      <Send className='h-4 w-4 mr-2' />
                      Post
                    </Button>
                    <Button variant='outline' onClick={() => setShowCreatePost(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className='space-y-6'>
          {posts.map((post) => (
            <Card
              key={post.id}
              className='shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200'
            >
              <CardContent className='p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex items-center space-x-3'>
                    <Avatar className='h-10 w-10 border-2 border-pink-200'>
                      <AvatarImage src={post.avatar} />
                      <AvatarFallback className='bg-gradient-to-br from-pink-500 to-rose-500 text-white'>
                        {post.author[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className='flex items-center gap-2'>
                        <p className='font-semibold text-gray-900'>{post.author}</p>
                        <Badge variant='secondary' className='text-xs bg-pink-100 text-pink-700'>
                          {post.category}
                        </Badge>
                      </div>
                      <p className='text-sm text-gray-500'>{post.time}</p>
                    </div>
                  </div>
                  <Button variant='ghost' size='sm'>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </div>

                {/* Post Title */}
                <h2 className='text-xl font-semibold text-gray-900 mb-3 hover:text-pink-600 cursor-pointer transition-colors'>
                  {post.title}
                </h2>

                {/* Post Content */}
                <p className='text-gray-700 mb-4 leading-relaxed'>{post.content}</p>

                {/* Post Image */}
                {post.image && (
                  <div className='mb-4'>
                    <img
                      src={post.image}
                      alt='Post content'
                      className='w-full h-auto rounded-xl border border-gray-200'
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                  <div className='flex items-center space-x-6'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className={`flex items-center space-x-2 ${likedPosts.includes(post.id) ? 'text-pink-600' : 'text-gray-600'} hover:text-pink-600 transition-colors`}
                      onClick={() => toggleLike(post.id)}
                    >
                      <Heart className={`h-5 w-5 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                      <span className='font-medium'>{post.likes + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                    </Button>

                    <Button
                      variant='ghost'
                      size='sm'
                      className='flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors'
                      onClick={() => toggleComments(post.id)}
                    >
                      <MessageCircle className='h-5 w-5' />
                      <span className='font-medium'>{post.comments}</span>
                    </Button>

                    <Button
                      variant='ghost'
                      size='sm'
                      className='flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors'
                    >
                      <Share2 className='h-5 w-5' />
                      <span className='font-medium'>Share</span>
                    </Button>
                  </div>

                  <Button variant='ghost' size='sm' className='text-gray-600 hover:text-yellow-600 transition-colors'>
                    <Bookmark className='h-5 w-5' />
                  </Button>
                </div>

                {/* Comments Section */}
                {expandedComments.includes(post.id) && (
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

                    {/* Existing Comments */}
                    <div className='space-y-4'>
                      {postComments[post.id as keyof typeof postComments]?.map((comment) => (
                        <div key={comment.id} className='flex space-x-3 p-4 bg-gray-50 rounded-xl'>
                          <Avatar className='h-8 w-8'>
                            <AvatarImage src={comment.avatar} />
                            <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm'>
                              {comment.author[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className='flex-1'>
                            <div className='flex items-center space-x-2 mb-1'>
                              <span className='font-medium text-gray-900 text-sm'>{comment.author}</span>
                              <span className='text-xs text-gray-500'>{comment.time}</span>
                            </div>
                            <p className='text-gray-700 text-sm mb-2'>{comment.content}</p>
                            <div className='flex items-center space-x-4'>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-xs text-gray-500 hover:text-pink-600 p-0 h-auto'
                              >
                                <Heart className='h-3 w-3 mr-1' />
                                {comment.likes}
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-xs text-gray-500 hover:text-blue-600 p-0 h-auto'
                              >
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Show/Hide Comments Toggle */}
                    <div className='text-center mt-4'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => toggleComments(post.id)}
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
