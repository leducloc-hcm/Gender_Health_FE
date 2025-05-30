import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CalendarIcon, ArrowLeft } from 'lucide-react'
import { fetchBlogById, fetchBlogs } from '@/app/apis/blog.api'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/app/components/ui/carousel'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'

interface BlogTag {
  tag: {
    id: number
    name: string
  }
}

interface BlogItem {
  id: number
  title: string
  image: string
  date: string
  tags: BlogTag[]
}

interface BlogDetail extends BlogItem {
  content: string
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
        setRelatedPosts(related)
      } catch (err) {
        console.error('Failed to load related blogs:', err)
      }
    }
    loadRelated()
  }, [blog])

  if (!blog) {
    return <div className='text-center py-20 text-muted-foreground'>Đang tải bài viết...</div>
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-7xl'>
      <Button variant='outline' className='mb-6' asChild>
        <Link to='/customer/blog'>
          <ArrowLeft className='w-4 h-4 mr-2' /> Back to Blog
        </Link>
      </Button>

      <article className='space-y-6'>
        <div className='rounded-xl overflow-hidden'>
          <img
            src={blog.image || '/placeholder.jpg'}
            alt={blog.title}
            className='w-full h-[400px] object-cover rounded-xl'
          />
        </div>

        <div className='flex flex-wrap justify-between items-center gap-2 text-sm text-muted-foreground'>
          <div className='flex items-center gap-2'>
            <CalendarIcon className='h-4 w-4' />
            {new Date(blog.date).toLocaleDateString('vi-VN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div className='flex flex-wrap gap-2'>
            {blog.tags.map((t, i) => (
              <Badge key={i} className='bg-pink-500 text-white rounded-full px-3 py-1 text-sm'>
                {t.tag.name}
              </Badge>
            ))}
          </div>
        </div>

        <h1 className='text-4xl font-bold leading-tight'>{blog.title}</h1>

        <div className='prose prose-lg max-w-none text-gray-800 whitespace-pre-line break-words '>
          <p>{blog.content}</p>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <div className='mt-16'>
          <h2 className='text-2xl font-bold mb-4'>Related articles</h2>

          <div className='relative'>
            <Carousel className='w-full'>
              <CarouselContent>
                {relatedPosts.map((item) => (
                  <CarouselItem key={item.id} className='md:basis-1/2 lg:basis-1/4'>
                    <Link to={`/customer/blog/${item.id}`}>
                      <Card className='rounded-xl hover:shadow-lg transition-shadow h-[320px]'>
                        <div className='h-[160px] overflow-hidden rounded-t-xl'>
                          <img
                            src={item.image || '/placeholder.jpg'}
                            alt={item.title}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <CardHeader>
                          <div className='text-sm text-muted-foreground mb-1'>
                            {new Date(item.date).toLocaleDateString('vi-VN')}
                          </div>
                          <CardTitle className='line-clamp-2 text-base'>{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className='pt-0 pb-4'>
                          <div className='flex flex-wrap gap-2'>
                            {item.tags.map((t, idx) => (
                              <Badge key={idx} className='bg-gray-200 text-black rounded-full px-2 py-0.5 text-xs'>
                                {t.tag.name}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      )}
    </div>
  )
}
