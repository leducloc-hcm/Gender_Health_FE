import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { specialtyApi } from '@/app/apis/specialty.api'
import type { SpecialtyDataResponse } from '../Models/SpecialtyManagement'

type DataProps = {
  editItem: SpecialtyDataResponse | undefined
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
  onSuccess: () => void
}

export default function EditSpecialtyModal({ editItem, isModalOpen, openModal, closeModal, onSuccess }: DataProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name || '',
        description: editItem.description || ''
      })
    }
  }, [editItem])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editItem) return
    
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }

    setIsLoading(true)
    try {
      await specialtyApi.updateSpecialty(editItem.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined
      })
      
      toast.success('Specialty updated successfully')
      onSuccess()
      closeModal()
    } catch (error) {
      console.error('Failed to update specialty:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to update specialty'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (editItem) {
      setFormData({
        name: editItem.name || '',
        description: editItem.description || ''
      })
    }
    closeModal()
  }

  if (!editItem) return null

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => (open ? openModal() : closeModal())}>
      <DialogContent className='min-w-[500px] max-h-[95vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='font-bold text-2xl mb-4'>Edit Specialty</DialogTitle>
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
              {isLoading ? 'Updating...' : 'Update Specialty'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
