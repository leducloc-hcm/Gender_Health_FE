import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { createBlog } from '@/app/apis/blog.api'
import { fetchTags } from '@/app/apis/tag.api'
import 'react-quill/dist/quill.snow.css'
import { ArrowLeft, X } from 'lucide-react'
import type { TagBlog } from '../../Auth/Login/models/tag'
import { Link } from 'react-router-dom'

interface FormData {
  title: string
  content: string
  tags: number[]
  date: string
  image: string
}

export default function CreateBlogPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    tags: [],
    date: '',
    image: ''
  })
  const [tagsList, setTagsList] = useState<TagBlog[]>([])
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchTags()
      .then(setTagsList)
      .catch(() => toast.error('Failed to load tags'))
  }, [])

  const validate = () => {
    const newErrors: Partial<FormData> = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.content.trim()) newErrors.content = 'Content is required'
    if (!formData.date) newErrors.date = 'Date is required'
    else if (new Date(formData.date) > new Date()) newErrors.date = 'Date cannot be in the future'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleToggleTag = (tagId: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId) ? prev.tags.filter((id) => id !== tagId) : [...prev.tags, tagId]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)

    try {
      await createBlog(formData)
      toast.success('Blog created successfully!')
      navigate('/staff/blog')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error?.response?.data?.message || 'Failed to create blog')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className=' px-4 py-10'>
      <div className='mb-8 flex'>
        <Link to='/staff/blog' className='flex items-center'>
          <ArrowLeft /> Back to Blog
        </Link>
      </div>
      <h1 className='text-2xl font-bold mb-6 text-gray-900'>Create New Blog</h1>
      <Card className='rounded-2xl border shadow-sm '>
        <CardHeader className='pt-6'>
          <CardTitle>Create Blog</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <Label className='pb-2'>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder='Enter blog title'
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className='text-sm text-red-500'>{errors.title}</p>}
            </div>

            <div>
              <Label className='pb-2'>Content</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder='Enter blog content'
                className={errors.content ? 'border-red-500' : ''}
              />

              {errors.content && <p className='text-sm text-red-500'>{errors.content}</p>}
            </div>

            <div>
              <Label className='pb-2'>Date</Label>
              <Input
                type='date'
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              />
              {errors.date && <p className='text-sm text-red-500'>{errors.date}</p>}
            </div>

            <div>
              <Label className='pb-2'>Image URL</Label>
              <Input
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
                placeholder='https://example.com/image.jpg'
              />
            </div>
            {formData.image && <img src={formData.image} alt='Preview' className='mt-2 max-h-48 rounded' />}
            <div>
              <Label>Tags</Label>
              <div className='flex flex-wrap gap-2'>
                {formData.tags.map((tagId) => {
                  const tag = tagsList.find((t) => t.id === tagId)
                  return (
                    <span
                      key={tagId}
                      className='bg-pink-200 text-pink-800 px-2 py-1 rounded-full flex items-center text-sm'
                    >
                      {tag?.name}
                      <X className='ml-1 h-4 w-4 cursor-pointer' onClick={() => handleToggleTag(tagId)} />
                    </span>
                  )
                })}
              </div>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-2 mt-3'>
                {tagsList.map((tag) => (
                  <Button
                    key={tag.id}
                    type='button'
                    variant={formData.tags.includes(tag.id) ? 'default' : 'outline'}
                    onClick={() => handleToggleTag(tag.id)}
                  >
                    {tag.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className='flex justify-end gap-4 pt-2'>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Blog'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => setFormData({ title: '', content: '', tags: [], date: '', image: '' })}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
