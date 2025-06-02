import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { ArrowLeft, X } from 'lucide-react'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { ContentState, convertToRaw } from 'draft-js'
import { fetchTags } from '@/app/apis/tag.api'
import { fetchBlogById, updateBlog } from '@/app/apis/blog.api'
import type { TagBlog } from '../../Auth/Login/models/tag'
import DraftEditor from '@/app/components/ui/DraftEditor'

export default function EditBlogPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [] as number[],
    date: '',
    image: '',
    newImage: null as File | null
  })
  const [tagsList, setTagsList] = useState<TagBlog[]>([])
  const [errors, setErrors] = useState<Partial<typeof formData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchTags().then(setTagsList)

    if (id) {
      fetchBlogById(id).then((data) => {
        const blocksFromHtml = htmlToDraft(data.content)
        const contentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks)
        const raw = convertToRaw(contentState)

        setFormData({
          title: data.title,
          content: JSON.stringify(raw),
          tags: data.tags?.map((t: { tag: { id: number } }) => t.tag.id) || [],
          date: data.date?.substring(0, 10),
          image: data.image,
          newImage: null
        })
      })
    }
  }, [id])

  const validate = () => {
    const newErrors: Partial<typeof formData> = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.content.trim()) newErrors.content = 'Content is required'
    if (!formData.date) newErrors.date = 'Date is required'
    else if (new Date(formData.date) > new Date()) newErrors.date = 'Date cannot be in the future'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof typeof formData, value: any) => {
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

      if (formData.newImage) {
        data.append('image', formData.newImage)
      } else {
        // Nếu không chọn ảnh mới, gửi ảnh cũ (lưu ý: backend phải hỗ trợ xử lý chuỗi URL trong multipart/form-data nếu ảnh cũ là URL)
        data.append('image', formData.image)
      }

      await updateBlog(id!, data)

      toast.success('Blog updated successfully!')
      navigate('/staff/blog')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update blog')
    } finally {
      setIsSubmitting(false)
    }
  }

  const parsedContentHTML = useMemo(() => {
    try {
      const parsed = JSON.parse(formData.content || '{}')
      if (parsed?.blocks && parsed?.entityMap !== undefined) {
        return draftToHtml(parsed)
      } else {
        return `<p>${formData.content}</p>`
      }
    } catch {
      return `<p>${formData.content}</p>`
    }
  }, [formData.content])

  return (
    <div className='px-4 py-10'>
      <div className='mb-8 flex'>
        <Link to='/staff/blog' className='flex items-center'>
          <ArrowLeft /> Back to Blog
        </Link>
      </div>
      <h1 className='text-2xl font-bold mb-6 text-gray-900'>Edit Blog</h1>
      <Card className='rounded-2xl border shadow-sm'>
        <CardHeader className='pt-6'>
          <CardTitle>Edit Blog</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <Label className='pb-2'>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
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
              <Label className='pb-2'>Preview</Label>
              <div
                className='prose max-w-none border rounded p-4 bg-white'
                dangerouslySetInnerHTML={{ __html: parsedContentHTML }}
              />
            </div>

            <div>
              <Label className='pb-2'>Date</Label>
              <Input type='date' value={formData.date} onChange={(e) => handleChange('date', e.target.value)} />
              {errors.date && <p className='text-sm text-red-500'>{errors.date}</p>}
            </div>

            <div>
              <Label className='pb-2'>Upload Image</Label>
              <input
                type='file'
                accept='image/*'
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  handleChange('newImage', file)
                }}
                className='block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-rose-500 file:text-white hover:file:bg-rose-600'
              />
              {formData.newImage ? (
                <img
                  src={URL.createObjectURL(formData.newImage)}
                  alt='Preview'
                  className='mt-2 w-28 h-auto rounded-md border border-gray-300'
                />
              ) : formData.image ? (
                <img
                  src={formData.image}
                  alt='Current'
                  className='mt-2 w-28 h-auto rounded-md border border-gray-300'
                />
              ) : null}
            </div>

            <div>
              <Label className='pb-2'>Tags</Label>
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
                {isSubmitting ? 'Updating...' : 'Update Blog'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
