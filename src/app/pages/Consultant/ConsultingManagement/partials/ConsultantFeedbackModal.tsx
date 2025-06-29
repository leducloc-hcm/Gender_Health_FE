import { consultingManagementApi } from '@/app/apis/consultingManagment.api'
import { Button } from '@/app/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/app/components/ui/dialog'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { MessageSquare, Save } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

interface ConsultantFeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  historyId: number
  onSuccess?: () => void
}

export const ConsultantFeedbackModal: React.FC<ConsultantFeedbackModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  historyId
}) => {
  const [consultantNote, setConsultantNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!consultantNote.trim()) {
      toast.error('Please provide your consultant note')
      return
    }

    try {
      setIsLoading(true)
      await consultingManagementApi.submitConsultantFeedback({
        historyId,
        consultantNote: consultantNote.trim()
      })

      toast.success('Consultant feedback submitted successfully!')
      onSuccess?.()
      handleClose()
    } catch (error) {
      console.error('Error submitting consultant feedback:', error)
      toast.error('Failed to submit feedback. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setConsultantNote('')
    setIsLoading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-gray-900'>
            <MessageSquare className='w-5 h-5 text-blue-600' />
            Add Consultant Note
          </DialogTitle>
          <DialogDescription>Please provide your professional notes about this consultation session.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='consultantNote' className='text-sm font-medium text-gray-700'>
              Consultant Note <span className='text-red-500'>*</span>
            </Label>
            <Textarea
              id='consultantNote'
              placeholder='Enter your professional observations, recommendations, or notes about this consultation...'
              value={consultantNote}
              onChange={(e) => setConsultantNote(e.target.value)}
              className='border-blue-200 focus:border-blue-400 focus:ring-blue-400 min-h-[120px] resize-none'
              disabled={isLoading}
              maxLength={1000}
            />
            <div className='flex justify-between text-xs text-gray-500'>
              <span>Provide detailed notes about the consultation</span>
              <span>{consultantNote.length}/1000</span>
            </div>
          </div>

          <DialogFooter className='flex gap-2 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isLoading}
              className='border-gray-300'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isLoading || !consultantNote.trim()}
              className='bg-blue-600 hover:bg-blue-700 text-white'
            >
              {isLoading ? (
                <>
                  <div className='w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className='w-4 h-4 mr-2' />
                  Submit Note
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
