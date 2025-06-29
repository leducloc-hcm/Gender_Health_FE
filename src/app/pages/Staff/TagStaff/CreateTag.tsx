import { createTag } from '@/app/apis/tag.api'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

interface FormData {
  name: string
  description: string
}

export default function CreateTagPage() {
  const [formData, setFormData] = useState<FormData>({ name: '', description: '' })
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await createTag(formData)
      toast.success(`"${formData.name}" created successfully!`)
      navigate('/staff/tag')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error?.response?.data?.message || 'Failed to create tag.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className=' px-6 py-8'>
      <div className='mb-8 flex'>
        <Link to='/staff/tag' className='flex items-center'>
          <ArrowLeft /> Back to tag
        </Link>
      </div>
      <h1 className='text-2xl font-bold mb-6 text-gray-900'>Create New Tag</h1>

      <Card className='rounded-2xl border shadow-sm '>
        <CardHeader className='pt-6'>
          <CardTitle>Create Tag</CardTitle>
          <CardDescription>Fill in the name and description of the tag.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <Label htmlFor='name' className='pb-2'>
                Name
              </Label>
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
              <Label htmlFor='description' className='pb-2'>
                Description
              </Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder='Tag description'
                className={errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.description && <p className='text-sm text-red-600 mt-1'>{errors.description}</p>}
            </div>

            <div className='flex justify-end gap-4 pt-2'>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Tag'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => setFormData({ name: '', description: '' })}
                disabled={isSubmitting}
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
