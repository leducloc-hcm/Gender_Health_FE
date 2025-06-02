import { fetchBlog, type BlogPost } from '@/app/apis/blog.api'
import { formatDate, truncateContent } from '@/app/lib/utils'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FiArrowUpRight, FiCalendar, FiUser } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function BlogSection() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const blogs = await fetchBlog()
        setBlogPosts(blogs)
        console.log('Blogs:', blogs)
      } catch (err: any) {
        setError(err.message || 'Lỗi khi gọi API')
      } finally {
        setLoading(false)
      }
    }

    loadBlogs()
  }, [])

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  if (loading) {
    return (
      <section id='blog' className='py-20 bg-gradient-to-br'>
        <div className='container mx-auto px-4 md:px-6'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto'></div>
            <p className='mt-4 text-gray-600'>Loading blog posts...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id='blog' className='py-20 bg-gradient-to-br'>
        <div className='container mx-auto px-4 md:px-6'>
          <div className='text-center'>
            <p className='text-red-600'>Error loading blog posts: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id='blog' className='py-20 bg-gradient-to-br'>
      <div className='container mx-auto px-4 md:px-6'>
        <motion.div>
          <div className='text-center mb-16'>
            <motion.h2 className='text-3xl py-2 font-bold tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 bg-clip-text text-transparent'>
              Blog and News
            </motion.h2>
            <motion.p className='mt-4 text-xl text-gray-600 max-w-2xl mx-auto'>
              Expert guidance, community stories, and healthcare insights to support your journey
            </motion.p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {blogPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`}>
                {' '}
                <motion.article
                  key={post.id}
                  variants={itemVariants}
                  className='bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-pink-100 hover:border-pink-200 group cursor-pointer'
                >
                  {/* Image */}
                  <div className='relative overflow-hidden'>
                    <img
                      src={
                        typeof post.image === 'string'
                          ? post.image
                          : post.image instanceof File
                            ? URL.createObjectURL(post.image)
                            : '/placeholder.svg'
                      }
                      alt={post.title}
                      className='w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                    <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300'>
                      <div className='bg-white/90 backdrop-blur-sm p-2 rounded-full'>
                        <FiArrowUpRight className='h-4 w-4 text-pink-600' />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className='p-6'>
                    <div className='flex items-center gap-2 text-sm text-gray-500 mb-3'>
                      <FiUser className='h-3 w-3 text-pink-600' />
                      <span>{post.staff?.name || 'Unknown Author'}</span>
                      <span>•</span>
                      <FiCalendar className='h-3 w-3 text-pink-600' />
                      <span>{formatDate(post.date)}</span>
                    </div>

                    <h3 className='text-xl font-semibold mb-3 text-gray-900 group-hover:text-pink-600 transition-colors duration-300 leading-tight'>
                      {post.title}
                    </h3>

                    <p className='text-gray-600 leading-relaxed mb-4 line-clamp-3'>{truncateContent(post.content)}</p>

                    <div className='flex flex-wrap gap-2'>
                      {post.tags?.map((tagObj) => (
                        <span
                          key={tagObj.tag?.id}
                          className='bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 hover:bg-pink-100 hover:text-pink-700 hover:border-pink-200 transition-colors'
                        >
                          {tagObj.tag?.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>

          {blogPosts.length === 0 && !loading && (
            <div className='text-center py-12'>
              <p className='text-gray-600'>No blog posts available at the moment.</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
