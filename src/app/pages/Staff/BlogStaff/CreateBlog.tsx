import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import draftToHtml from 'draftjs-to-html'
import { createBlog } from '@/app/apis/blog.api'
import { fetchTags } from '@/app/apis/tag.api'
import { ArrowLeft, X } from 'lucide-react'
import type { TagBlog } from '../../Auth/Login/models/tag'
import DraftEditor from '@/app/components/ui/DraftEditor'

interface FormData {
  title: string
  content: string
  tags: number[]
  date: string
  image: File | null
}

export default function CreateBlogPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    tags: [],
    date: '',
    image: null
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

  const handleChange = (field: keyof FormData, value: string | File | null) => {
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
      const data = new FormData()
      data.append('title', formData.title)
      data.append('content', formData.content)
      data.append('date', formData.date)
      data.append('tags', JSON.stringify(formData.tags))
      console.log('data', data)
      if (formData.image) data.append('image', formData.image)
      await createBlog(data)
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
    <div className='px-4 py-10'>
      <div className='mb-8 flex'>
        <Link to='/staff/blog' className='flex items-center'>
          <ArrowLeft /> Back to Blog
        </Link>
      </div>
      <h1 className='text-2xl font-bold mb-6 text-gray-900'>Create New Blog</h1>
      <Card className='rounded-2xl border shadow-sm'>
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
              <DraftEditor value={formData.content} onChange={(val) => handleChange('content', val)} />
              {errors.content && <p className='text-sm text-red-500'>{errors.content}</p>}
            </div>

            <div>
              <Label className='pb-2'>Content Preview</Label>
              <div
                className='prose max-w-none border rounded p-4 bg-white'
                dangerouslySetInnerHTML={{
                  __html: draftToHtml(JSON.parse(formData.content || '{}'))
                }}
              />
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
              <Label className='pb-2'>Upload Image</Label>
              <input
                type='file'
                accept='image/*'
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  handleChange('image', file)
                }}
                className='block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer  file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-rose-500 file:text-white hover:file:bg-rose-600'
              />

              {formData.image && (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt='Preview'
                  className='mt-2 w-28 h-auto rounded-md border border-gray-300'
                />
              )}
            </div>

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
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
