import { motion, useInView } from 'framer-motion'
import { User, Calendar } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { fetchBlogs, type BlogPost } from '@/app/apis/blog.api'
import { Card, CardContent } from '@/app/components/ui/card'
import LoadingSpinner from '@/app/components/ui/loadingspinner'

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function BlogSection() {
  const navigate = useNavigate()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true)
      try {
        const response = await fetchBlogs(1, 6) // Lấy 6 bài mới nhất
        setBlogPosts(response.data)
      } catch (err) {
        console.error('Failed to load blogs:', err)
      } finally {
        setLoading(false)
      }
    }
    loadBlogs()
  }, [])

  const BlogCard = ({ post, index }: { post: BlogPost; index: number }) => {
    const cardVariants = {
      hidden: { opacity: 0, y: 50, scale: 0.9 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.6,
          ease: 'easeOut',
          delay: index * 0.1
        }
      }
    }

    const getContentPreview = (content: string) => {
      try {
        const raw = JSON.parse(content)
        return (
          raw.blocks
            .map((b: any) => b.text)
            .join(' ')
            .slice(0, 150) + '...'
        )
      } catch {
        return content.slice(0, 150) + '...'
      }
    }

    return (
      <motion.div variants={cardVariants} initial='hidden' animate={isInView ? 'visible' : 'hidden'} className='group'>
        <Card className='h-full transition-all duration-300 bg-white border-0 shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden p-0'>
          <div className='relative overflow-hidden'>
            <div className='h-56 overflow-hidden'>
              <img
                src={
                  typeof post.image === 'string'
                    ? post.image
                    : post.image instanceof File
                      ? URL.createObjectURL(post.image)
                      : '/placeholder.svg'
                }
                alt={post.title}
                className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
              />
            </div>
            <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          </div>

          <CardContent className='p-6'>
            <div className='flex items-center gap-4 text-sm text-gray-500 mb-4'>
              <div className='flex items-center gap-2'>
                <Calendar className='w-4 h-4 text-pink-500' />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
              <div className='flex items-center gap-2'>
                <User className='w-4 h-4 text-pink-500' />
                <span>{post.staff?.name}</span>
              </div>
            </div>

            <Link to={`/blog/${post.id}`}>
              <h3 className='text-xl font-bold text-gray-900 mb-3 hover:text-pink-600 transition-colors line-clamp-2 leading-tight'>
                {post.title}
              </h3>
            </Link>

            <p className='text-gray-600 mb-4 line-clamp-3 leading-relaxed text-sm'>{getContentPreview(post.content)}</p>

            <Link
              to={`/blog/${post.id}`}
              className='inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium text-sm transition-colors group'
            >
              Read More
              <svg
                className='w-4 h-4 transition-transform group-hover:translate-x-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const handleViewAllBlogs = () => {
    navigate('/blog')
  }

  return (
    <section id='blog' ref={ref} className='py-20 lg:py-32  relative overflow-hidden'>
      {/* Background Decorations */}
      <div className='absolute inset-0'>
        <div className='absolute top-20 right-10 w-40 h-40 bg-pink-200/20 rounded-full blur-3xl'></div>
        <div className='absolute bottom-32 left-16 w-32 h-32 bg-rose-200/30 rounded-full blur-2xl'></div>
        <div className='absolute top-1/2 left-20 w-24 h-24 bg-pink-300/20 rounded-full blur-xl'></div>
      </div>

      <div className='container mx-auto px-4 md:px-6 relative'>
        {/* Header */}
        <div className='text-center mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='relative inline-block mb-6'
          >
            <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-pink-700 bg-clip-text text-transparent leading-tight pb-1'>
              Health Blog & Insights
            </h2>
            <div className='absolute inset-0 bg-gradient-to-r from-pink-600/10 via-rose-500/10 to-pink-700/10 blur-3xl -z-10'></div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'
          >
            Stay informed with expert articles, health tips, and community insights to support your wellness journey
          </motion.p>
        </div>

        {/* Blog Grid */}
        {blogPosts.length > 0 ? (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
              {blogPosts.slice(0, 6).map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>

            {/* View All Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className='text-center'
            >
              <button
                onClick={handleViewAllBlogs}
                className='cursor-pointer bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl'
              >
                View All Articles
              </button>
            </motion.div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-center py-16'>
            <div className='text-6xl mb-6'>📚</div>
            <h3 className='text-2xl font-semibold mb-4 text-gray-800'>No Articles Available</h3>
            <p className='text-gray-600 mb-8 max-w-md mx-auto'>
              We're working on bringing you amazing health content. Check back soon!
            </p>
            <button
              onClick={handleViewAllBlogs}
              className='bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300'
            >
              Explore Blog
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
