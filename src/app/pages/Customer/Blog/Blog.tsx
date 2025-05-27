import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

import { CalendarIcon, Search, Filter, X } from 'lucide-react'

import { fetchTags } from '@/app/apis/tag.api'
import { fetchBlogs, type BlogPost } from '@/app/apis/blog.api'
import type { TagBlog } from '../../Auth/Login/models/tag'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'

const limit = 6

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function BlogPage() {
  const [searchParams] = useSearchParams()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [allTags, setAllTags] = useState<TagBlog[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Load blogs & tags
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tagsRes, blogRes] = await Promise.all([fetchTags(), fetchBlogs(page, limit)])
        setAllTags(tagsRes)
        setBlogPosts(blogRes.data)
        setFilteredPosts(blogRes.data)
        setTotalPages(blogRes.pagination.totalPages)
      } catch (err) {
        console.error('Failed to load data:', err)
      }
    }
    loadData()
  }, [page])

  useEffect(() => {
    const tagsParam = searchParams.get('tags')
    if (tagsParam) {
      setSelectedTags(tagsParam.split(','))
    }
  }, [searchParams])

  useEffect(() => {
    let filtered = blogPosts

    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) => selectedTags.some((tag) => post.tags?.some((t) => t.tag.name === tag)))
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags?.some((t) => t.tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredPosts(filtered)
  }, [searchQuery, selectedTags, blogPosts])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const removeTag = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const clearAllFilters = () => {
    setSelectedTags([])
    setSearchQuery('')
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <header className='mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-4xl font-bold mb-2'>Blog</h1>
              <p className='text-muted-foreground'>{filteredPosts.length} posts found</p>
            </div>
          </div>

          {/* Search */}
          <div className='relative mb-6'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search posts...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 max-w-md'
            />
          </div>

          {/* Active Filters */}
          {(selectedTags.length > 0 || searchQuery) && (
            <Card className='mb-6'>
              <CardHeader className='p-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='flex items-center gap-2 text-lg'>
                    <Filter className='h-4 w-4' />
                    Active Filters
                  </CardTitle>
                  <Button variant='outline' size='sm' onClick={clearAllFilters}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  {searchQuery && (
                    <Badge variant='secondary' className='flex items-center gap-1'>
                      Search: "{searchQuery}"
                      <X className='h-3 w-3 cursor-pointer' onClick={() => setSearchQuery('')} />
                    </Badge>
                  )}
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag}
                      className='bg-gradient-to-r from-pink-500 to-rose-500 from  text-white flex items-center gap-1 cursor-pointer'
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <X className='h-3 w-3' />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filter by tags */}
          <Card className='mb-8'>
            <CardHeader className='p-3'>
              <CardTitle className='text-lg'>Filter by Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                {allTags.map((tag) => (
                  <Badge
                    key={tag.name}
                    className={`cursor-pointer rounded-full px-3 py-1 text-sm ${
                      selectedTags.includes(tag.name)
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                        : 'bg-gray-100 text-black hover:bg-gray-200'
                    }`}
                    onClick={() => toggleTag(tag.name)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </header>

        {/* Blog Grid */}
        {filteredPosts.length > 0 ? (
          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {filteredPosts.map((post) => (
              <Link key={post.id} to={`/customer/blog/${post.id}`}>
                <Card className='h-full overflow-hidden rounded-2xl cursor-pointer hover:shadow-lg transition-shadow'>
                  <div className='w-full h-[220px] overflow-hidden rounded-t-2xl'>
                    <img
                      src={post.image || '/placeholder.jpg'}
                      alt={post.title}
                      className='w-full h-full object-cover'
                      loading='lazy'
                    />
                  </div>
                  <CardHeader>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground mb-2'>
                      <CalendarIcon className='h-4 w-4' />
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    </div>
                    <CardTitle className='line-clamp-2'>{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-muted-foreground mb-4 line-clamp-3'>{post.content}</p>
                    <div className='flex flex-wrap gap-2'>
                      {post.tags?.map((t, index) => (
                        <Badge
                          key={index}
                          className={`text-xs px-2 py-1 rounded-full ${
                            selectedTags.includes(t.tag.name)
                              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                              : 'bg-gray-200 text-black'
                          }`}
                        >
                          {t.tag.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <div className='text-6xl mb-4'>🔍</div>
            <h3 className='text-2xl font-semibold mb-2'>No posts found</h3>
            <p className='text-muted-foreground mb-6'>Try adjusting your search criteria or clearing the filters.</p>
            <Button onClick={clearAllFilters}>Clear All Filters</Button>
          </div>
        )}

        {/* Pagination */}
        <div className='flex justify-center items-center mt-10 gap-4'>
          <Button variant='outline' disabled={page === 1} onClick={() => setPage(page - 1)}>
            ← Previous
          </Button>
          <span className='font-medium text-sm'>
            Page {page} of {totalPages}
          </span>
          <Button variant='outline' disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next →
          </Button>
        </div>
      </div>
    </div>
  )
}
