import { getTagById, updateTag } from '@/app/apis/tag.api'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import type { AxiosError } from 'axios'
import { ArrowLeft } from 'lucide-react'

interface FormData {
  name: string
  description: string
}

export default function EditTag() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>({ name: '', description: '' })
  const [initialData, setInitialData] = useState<FormData>({ name: '', description: '' })
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Fetch tag info
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) throw new Error('Missing tag ID')
        const data = await getTagById(id)
        setFormData({ name: data.name, description: data.description })
        setInitialData({ name: data.name, description: data.description })
      } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>
        toast.error(error.response?.data?.message || 'Tag not found.')
        navigate('/staff/tag')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, navigate])

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || !id) return

    // ✅ Check if data actually changed
    if (
      formData.name.trim() === initialData.name.trim() &&
      formData.description.trim() === initialData.description.trim()
    ) {
      toast.info('Nothing changed.')
      return
    }

    setSubmitting(true)
    try {
      await updateTag(id, formData)
      toast.success(`Tag "${formData.name}" updated successfully!`)
      navigate('/staff/tag')
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>
      toast.error(error.response?.data?.message || 'Failed to update tag.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className='px-6 py-8 text-gray-500'>Loading tag...</div>
  }

  return (
    <div className='px-6 py-8'>
      <div className='mb-8 flex'>
        <Link to='/staff/tag' className='flex items-center gap-2 text-sm text-muted-foreground hover:text-black'>
          <ArrowLeft size={16} /> Back to Tags
        </Link>
      </div>

      <h1 className='text-2xl font-bold mb-6 text-gray-900'>Edit Tag</h1>

      <Card className='rounded-2xl border shadow-sm'>
        <CardHeader className='pt-6'>
          <CardTitle>Edit Tag</CardTitle>
          <CardDescription>Update the name and description of the tag.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder='Tag name'
                className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.name && <p className='text-sm text-red-600 mt-1'>{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder='Tag description'
                className={errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.description && <p className='text-sm text-red-600 mt-1'>{errors.description}</p>}
            </div>

            <div className='flex gap-4 pt-2'>
              <Button type='submit' disabled={submitting}>
                {submitting ? 'Updating...' : 'Update Tag'}
              </Button>
              <Button type='button' variant='outline' onClick={() => navigate('/staff/tag')} disabled={submitting}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
