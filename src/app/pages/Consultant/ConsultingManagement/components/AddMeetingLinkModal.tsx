import React, { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/app/components/ui/dialog'
import { consultingManagementApi } from '@/app/apis/consultingManagment.api'
import { toast } from 'react-toastify'

interface AddMeetingLinkModalProps {
  isOpen: boolean
  onClose: () => void
  historyId: number
  onSuccess?: () => void
}

export const AddMeetingLinkModal: React.FC<AddMeetingLinkModalProps> = ({ isOpen, onClose, historyId, onSuccess }) => {
  const [formData, setFormData] = useState({
    meetingLink: '',
    meetingPlatform: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.meetingLink || !formData.meetingPlatform) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setIsLoading(true)
      await consultingManagementApi.inviteLink({
        historyId,
        meetingLink: formData.meetingLink,
        meetingPlatform: formData.meetingPlatform
      })

      toast.success('Meeting link added successfully!')
      onSuccess?.()
      handleClose()
    } catch (error) {
      console.error('Error adding meeting link:', error)
      toast.error('Failed to add meeting link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ meetingLink: '', meetingPlatform: '' })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center space-x-2'>
            <span className='text-2xl'>🔗</span>
            <span>Add Meeting Link</span>
          </DialogTitle>
          <DialogDescription>Add a meeting link for this consultation session.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='meetingLink' className='text-sm font-medium'>
              Meeting Link <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='meetingLink'
              type='url'
              placeholder='https://zoom.us/j/123456789'
              value={formData.meetingLink}
              onChange={(e) => setFormData((prev) => ({ ...prev, meetingLink: e.target.value }))}
              className='w-full'
              disabled={isLoading}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='meetingPlatform' className='text-sm font-medium'>
              Meeting Platform <span className='text-red-500'>*</span>
            </Label>
            <Select
              value={formData.meetingPlatform}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, meetingPlatform: value }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a platform' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ZOOM'>
                  <div className='flex items-center space-x-2'>
                    <span>🎥</span>
                    <span>Zoom</span>
                  </div>
                </SelectItem>
                <SelectItem value='TEAMS'>
                  <div className='flex items-center space-x-2'>
                    <span>👥</span>
                    <span>Microsoft Teams</span>
                  </div>
                </SelectItem>
                <SelectItem value='MEET'>
                  <div className='flex items-center space-x-2'>
                    <span>📱</span>
                    <span>Google Meet</span>
                  </div>
                </SelectItem>
                <SelectItem value='OTHER'>
                  <div className='flex items-center space-x-2'>
                    <span>💻</span>
                    <span>Other</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className='flex space-x-2 pt-4'>
            <Button type='button' variant='outline' onClick={handleClose} disabled={isLoading} className='flex-1'>
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isLoading}
              className='flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
            >
              {isLoading ? (
                <div className='flex items-center space-x-2'>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  <span>Adding...</span>
                </div>
              ) : (
                <div className='flex items-center space-x-2'>
                  <span>🔗</span>
                  <span>Add Link</span>
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
