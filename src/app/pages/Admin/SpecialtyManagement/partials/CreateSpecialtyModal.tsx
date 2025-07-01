import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { specialtyApi } from '@/app/apis/specialty.api'

type DataProps = {
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
  onSuccess: () => void
}

export default function CreateSpecialtyModal({ isModalOpen, openModal, closeModal, onSuccess }: DataProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }

    setIsLoading(true)
    try {
      await specialtyApi.createSpecialty({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined
      })
      
      toast.success('Specialty created successfully')
      setFormData({ name: '', description: '' }) // Reset form
      onSuccess()
      closeModal()
    } catch (error) {
      console.error('Failed to create specialty:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create specialty'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', description: '' }) // Reset form
    closeModal()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => (open ? openModal() : closeModal())}>
      <DialogContent className='min-w-[500px] max-h-[95vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='font-bold text-2xl mb-4'>Create New Specialty</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Name *</Label>
            <Input
              id='name'
              name='name'
              type='text'
              value={formData.name}
              onChange={handleInputChange}
              placeholder='Enter specialty name'
              required
              disabled={isLoading}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              placeholder='Enter specialty description (optional)'
              rows={4}
              disabled={isLoading}
            />
          </div>

          <DialogFooter className='flex justify-end gap-2 pt-4'>
            <DialogClose asChild>
              <Button type='button' variant='outline' onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Specialty'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
