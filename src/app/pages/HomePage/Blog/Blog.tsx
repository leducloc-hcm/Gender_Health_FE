import { Search, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { fetchBlogs, type BlogPost } from '@/app/apis/blog.api'
import { fetchTags } from '@/app/apis/tag.api'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import type { TagBlog } from '../../Auth/Login/models/tag'
import LoadingSpinner from '@/app/components/ui/loadingspinner'

const limit = 4

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [allTags, setAllTags] = useState<TagBlog[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [visiblePosts, setVisiblePosts] = useState<BlogPost[]>([])
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder] = useState<'newest' | 'oldest'>('newest')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [tagsRes, blogRes] = await Promise.all([fetchTags(), fetchBlogs(1, 1000)])
        setAllTags(tagsRes)
        setBlogPosts(blogRes.data)
      } catch (err) {
        console.error('Failed to load data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    let filtered = [...blogPosts]
    if (selectedTag) {
      // Thay đổi điều kiện filter
      filtered = filtered.filter((post) => post.tags?.some((t) => t.tag.name === selectedTag))
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags?.some((t) => t.tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    filtered = filtered.sort((a, b) =>
      sortOrder === 'newest'
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    setFilteredPosts(filtered)
    setPage(1)
  }, [searchQuery, selectedTag, blogPosts, sortOrder])

  useEffect(() => {
    const start = (page - 1) * limit
    const end = start + limit
    setVisiblePosts(filteredPosts.slice(start, end))
    setTotalPages(Math.ceil(filteredPosts.length / limit))
  }, [filteredPosts, page])

  const clearAllFilters = () => {
    setSelectedTag('')
    setSearchQuery('')
  }

  const toggleTag = (tagName: string) => {
    setSelectedTag((prev) => (prev === tagName ? '' : tagName))
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8 max-w-6xl'>
        <div className='text-center mb-8'>
          <div className='relative'>
            <h1 className='text-5xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-rose-600 bg-clip-text text-transparent pb-4'>
              Blog & Community
            </h1>
            <div className='absolute inset-0 bg-gradient-to-r from-pink-600/10 via-rose-500/10 to-purple-600/10 blur-3xl -z-10'></div>
          </div>
          <p className='text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed'>
            Explore our articles and connect with a vibrant community of health enthusiasts.
          </p>
        </div>
        <div className='flex flex-col lg:flex-row gap-8'>
          <main className='flex-1 lg:order-1'>
            <div className=''>
              {visiblePosts.length > 0 ? (
                <div className='space-y-8'>
                  {visiblePosts.map((post) => (
                    <Card
                      key={post.id}
                      className=' transition-all duration-300 bg-white border-0 shadow-md py-0 rounded-lg'
                    >
                      <div className='relative'>
                        <div className='h-full overflow-hidden rounded-t-lg'>
                          <img
                            src={
                              typeof post.image === 'string'
                                ? post.image
                                : post.image instanceof File
                                  ? URL.createObjectURL(post.image)
                                  : '/placeholder.svg'
                            }
                            alt={post.title}
                            className='w-full h-full object-cover transition-transform '
                          />
                        </div>
                      </div>

                      <CardContent className='p-8'>
                        <div className='flex items-center gap-4 text-sm text-gray-500 mb-4'>
                          <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                            <time dateTime={post.date}>{formatDate(post.date)}</time>
                          </div>
                          <div className='flex items-center gap-2'>
                            <User className='w-4 h-4' />
                            <span>{post.staff?.name}</span>
                          </div>
                        </div>

                        <Link to={`/blog/${post.id}`}>
                          <h2 className='text-2xl font-bold text-gray-900 mb-4 hover:text-pink-600 transition-colors line-clamp-2'>
                            {post.title}
                          </h2>
                        </Link>

                        <p className='text-gray-600 mb-6 line-clamp-3 leading-relaxed'>
                          {(() => {
                            try {
                              const raw = JSON.parse(post.content)
                              return (
                                raw.blocks
                                  .map((b: any) => b.text)
                                  .join(' ')
                                  .slice(0, 200) + '...'
                              )
                            } catch {
                              return post.content.slice(0, 200) + '...'
                            }
                          })()}
                        </p>

                        <Link to={`/blog/${post.id}`}>
                          <Button className='px-8 py-3 text-base bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'>
                            Read More →
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className='text-center py-12'>
                  <div className='text-6xl mb-4'>🔍</div>
                  <h3 className='text-2xl font-semibold mb-2'>No posts found</h3>
                  <p className='text-gray-600 mb-6'>Try adjusting your search criteria or clearing the filters.</p>
                  <Button onClick={clearAllFilters} className='bg-purple-600 hover:bg-purple-700'>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='flex justify-center items-center mt-12 gap-6'>
                <Button
                  variant='outline'
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className='border-2 border-purple-200 text-pink-600 hover:bg-purple-50 px-6 py-2'
                >
                  ← Previous
                </Button>
                <span className='font-medium text-gray-600 px-4'>
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant='outline'
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className='border-2 border-purple-200 text-pink-600 hover:bg-purple-50 px-6 py-2'
                >
                  Next →
                </Button>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className='lg:w-80 space-y-6 lg:order-2'>
            {/* Search */}
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
              <Input
                placeholder='Search...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-12 border-gray-200 h-12 text-base bg-white'
              />
            </div>

            {/* Service Category */}
            <Card className='border-0 shadow-md'>
              <CardContent className='p-6'>
                <h2 className='font-bold text-gray-900 mb-6 uppercase text-lg '>Service Tag</h2>
                <div className='space-y-3'>
                  {allTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.name)}
                      className={`w-full cursor-pointer text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 flex  items-center justify-between ${
                        selectedTag === tag.name
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <span>{tag.name}</span>
                      <span className='text-xs'>→</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <Card className='border-0 shadow-md'>
              <CardContent className='p-6'>
                <h2 className='font-bold text-gray-900 mb-6 uppercase text-lg '>Recent Post</h2>
                <div className='space-y-4'>
                  {blogPosts.slice(0, 5).map((post) => (
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
                        <div className='flex items-center gap-2 text-xs text-red-500 mb-1'>
                          <div className='w-1.5 h-1.5 bg-red-500 rounded-full'></div>
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
          </aside>
        </div>
      </div>
    </div>
  )
}
