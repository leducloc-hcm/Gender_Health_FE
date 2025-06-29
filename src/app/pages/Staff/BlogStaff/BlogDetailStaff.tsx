import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CalendarIcon, ArrowLeft } from 'lucide-react'
import { fetchBlogById } from '@/app/apis/blog.api'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'

import draftToHtml from 'draftjs-to-html'
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
export default function BlogDetailStaff() {
  const { id } = useParams()
  const [blog, setBlog] = useState<BlogDetail | null>(null)

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

  if (!blog) {
    return <div className='text-center py-20 text-muted-foreground'>Đang tải bài viết...</div>
  }

  return (
    <div className='px-4 py-10 '>
      <Button variant='outline' className='mb-6' asChild>
        <Link to='/staff/blog'>
          <ArrowLeft className='w-4 h-4 mr-2' /> Back to Blog
        </Link>
      </Button>

      <article className='space-y-6'>
        <div className='rounded-xl overflow-hidden'>
          <img
            src={blog.image || '/placeholder.jpg'}
            alt={blog.title}
            className='w-full h-[400px] object-cover rounded-xl '
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
          <div
            className='prose prose-lg max-w-none text-gray-800'
            dangerouslySetInnerHTML={{
              __html: (() => {
                try {
                  const isJson = blog.content.trim().startsWith('{') && blog.content.trim().endsWith('}')
                  return isJson ? draftToHtml(JSON.parse(blog.content)) : `<p>${blog.content}</p>`
                } catch (e) {
                  console.error('Failed to parse blog content:', e)
                  return '<p>Nội dung không hiển thị được.</p>'
                }
              })()
            }}
          />
        </div>
      </article>
    </div>
  )
}
