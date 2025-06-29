import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CalendarIcon, ArrowLeft, User, Clock, Share2 } from 'lucide-react'
import { fetchBlogById, fetchBlogs } from '@/app/apis/blog.api'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Card, CardContent } from '@/app/components/ui/card'
import draftToHtml from 'draftjs-to-html'
import LoadingSpinner from '@/app/components/ui/loadingspinner'

interface BlogTag {
  tag: {
    id: number
    name: string
  }
}

interface BlogItem {
  id: number
  title: string
  image: File
  date: string
  tags: BlogTag[]
  staff?: {
    name: string
  }
}

interface BlogDetail extends BlogItem {
  content: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function BlogDetail() {
  const { id } = useParams()
  const [blog, setBlog] = useState<BlogDetail | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogItem[]>([])

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const data = await fetchBlogById(id || '')
        setBlog(data)
      } catch (error) {
        console.error('Failed to fetch blog detail:', error)
      }
    }
    loadBlog()
  }, [id])

  useEffect(() => {
    const loadRelated = async () => {
      if (!blog) return
      try {
        const res = await fetchBlogs(1, 100)
        const related = res.data
          .filter(
            (item) =>
              item.id !== blog.id &&
              Array.isArray(item.tags) &&
              item.tags.some((t) => blog.tags.some((bt) => bt.tag.id === t.tag.id))
          )
          .map((item) => ({
            ...item,
            tags: Array.isArray(item.tags) ? item.tags : []
          }))
          .slice(0, 4)
        setRelatedPosts(related)
      } catch (err) {
        console.error('Failed to load related blogs:', err)
      }
    }
    loadRelated()
  }, [blog])

  if (!blog) {
    return <LoadingSpinner />
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}

      {/* Main Content */}
      <div className='container mx-auto px-4 py-8 max-w-7xl'>
        <Button
          variant='outline'
          className=' bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:text-white mb-4 '
          asChild
        >
          <Link to='/blog'>
            <ArrowLeft className='w-4 h-4 mr-2' /> Back to Blog
          </Link>
        </Button>
        <div className='flex flex-col lg:flex-row gap-8'>
          <main className='flex-1 lg:order-1'>
            <article className='bg-white rounded-2xl shadow-lg overflow-hidden'>
              <div className='relative h-96 overflow-hidden'>
                <img
                  src={
                    typeof blog.image === 'string'
                      ? blog.image
                      : blog.image instanceof File
                        ? URL.createObjectURL(blog.image)
                        : '/placeholder.svg'
                  }
                  alt={blog.title}
                  className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>
              </div>

              {/* Article Content */}
              <div className='p-8 lg:p-12'>
                {/* Tags */}
                <div className='flex flex-wrap gap-2 mb-6'>
                  {blog.tags.map((t, i) => (
                    <Badge
                      key={i}
                      className='bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 text-sm rounded-full hover:from-pink-600 hover:to-rose-600 transition-all'
                    >
                      {t.tag.name}
                    </Badge>
                  ))}
                </div>

                {/* Title */}
                <h1 className='text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6'>{blog.title}</h1>

                {/* Meta Info */}
                <div className='flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200'>
                  <div className='flex items-center gap-2'>
                    <CalendarIcon className='h-5 w-5 text-pink-500' />
                    <span className='font-medium'>{formatDate(blog.date)}</span>
                  </div>
                  {blog.staff?.name && (
                    <div className='flex items-center gap-2'>
                      <User className='h-5 w-5 text-pink-500' />
                      <span className='font-medium'>{blog.staff.name}</span>
                    </div>
                  )}
                  <div className='flex items-center gap-2'>
                    <Clock className='h-5 w-5 text-pink-500' />
                    <span className='font-medium'>5 min read</span>
                  </div>
                  <Button variant='outline' size='sm' className='ml-auto border-gray-300 hover:bg-gray-50'>
                    <Share2 className='h-4 w-4 mr-2' />
                    Share
                  </Button>
                </div>

                {/* Content */}
                <div className='prose prose-lg prose-gray max-w-none'>
                  <div
                    className='text-gray-800 leading-relaxed'
                    style={{
                      fontSize: '1.125rem',
                      lineHeight: '1.75'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: (() => {
                        try {
                          const isJson = blog.content.trim().startsWith('{') && blog.content.trim().endsWith('}')
                          return isJson ? draftToHtml(JSON.parse(blog.content)) : `<p>${blog.content}</p>`
                        } catch (e) {
                          console.error('Failed to parse blog content:', e)
                          return '<p>Content cannot be displayed.</p>'
                        }
                      })()
                    }}
                  />
                </div>
              </div>
            </article>

            {/* Back to Blog Button */}
            <div className='text-center mt-8'>
              <Button
                asChild
                className='px-8 py-3 text-base bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200'
              >
                <Link to='/blog'>Explore More Articles</Link>
              </Button>
            </div>
          </main>

          {/* Sidebar */}
          <aside className='lg:w-80 space-y-6 lg:order-2'>
            {/* Author Info Card */}
            {blog.staff?.name && (
              <Card className='border-0 shadow-md'>
                <CardContent className='p-6'>
                  <h2 className='font-bold text-gray-900 mb-4 uppercase text-lg'>About Author</h2>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-lg'>
                      {blog.staff.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className='font-semibold text-gray-900'>{blog.staff.name}</h3>
                      <p className='text-sm text-gray-600'>Health Specialist</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <Card className='border-0 shadow-md'>
                <CardContent className='p-6'>
                  <h2 className='font-bold text-gray-900 mb-6 uppercase text-lg'>Related Articles</h2>
                  <div className='space-y-4'>
                    {relatedPosts.map((post) => (
                      <Link key={post.id} to={`/blog/${post.id}`} className='flex gap-4 group'>
                        <div className='w-16 h-16 rounded-lg overflow-hidden flex-shrink-0'>
                          <img
                            src={
                              typeof post.image === 'string'
                                ? post.image
                                : post.image instanceof File
                                  ? URL.createObjectURL(post.image)
                                  : '/placeholder.svg'
                            }
                            alt={post.title}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2 text-xs text-pink-500 mb-1'>
                            <div className='w-1.5 h-1.5 bg-pink-500 rounded-full'></div>
                            <time>{formatDate(post.date)}</time>
                          </div>
                          <h4 className='text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-pink-600 transition-colors'>
                            {post.title}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
