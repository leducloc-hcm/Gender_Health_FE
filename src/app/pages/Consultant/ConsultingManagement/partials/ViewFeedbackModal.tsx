import { Button } from '@/app/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/app/components/ui/dialog'
import { Eye, MessageSquare, User, UserCheck } from 'lucide-react'
import React from 'react'
import type { ConsultantManagementResponse } from '../models/ConsultingManagement'

interface ViewFeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  data: ConsultantManagementResponse | null
}

export const ViewFeedbackModal: React.FC<ViewFeedbackModalProps> = ({ isOpen, onClose, data }) => {
  if (!data) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-3xl max-h-[92vh] '>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-gray-900'>
            <Eye className='w-5 h-5 text-purple-600' />
            Consultation Feedback & Notes
          </DialogTitle>
          <DialogDescription>
            View all feedback and notes for this consultation session between{' '}
            <span className='font-medium'>{data.consultantProfile?.name || 'Unknown Consultant'}</span> and{' '}
            <span className='font-medium'>{data.customerProfile?.name || 'Unknown Customer'}</span>
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 overflow-y-auto max-h-[calc(80vh-120px)] '>
          {/* Customer Feedback */}
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
            <div className='flex items-center space-x-2 mb-3'>
              <MessageSquare className='w-5 h-5 text-yellow-600' />
              <h3 className='text-lg font-semibold text-yellow-800'>Customer Feedback</h3>
            </div>
            <div className='bg-white rounded-md p-3 border border-yellow-100'>
              {data.feedback ? (
                <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>{data.feedback}</p>
              ) : (
                <p className='text-gray-500 italic'>No feedback provided by the customer</p>
              )}
            </div>
          </div>

          {/* Consultant Note */}
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
            <div className='flex items-center space-x-2 mb-3'>
              <UserCheck className='w-5 h-5 text-blue-600' />
              <h3 className='text-lg font-semibold text-blue-800'>Consultant Note</h3>
            </div>
            <div className='bg-white rounded-md p-3 border border-blue-100'>
              {data.consultantNote ? (
                <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>{data.consultantNote}</p>
              ) : (
                <p className='text-gray-500 italic'>No note provided by the consultant</p>
              )}
            </div>
          </div>

          {/* Customer Note */}
          <div className='bg-purple-50 border border-purple-200 rounded-lg p-4'>
            <div className='flex items-center space-x-2 mb-3'>
              <User className='w-5 h-5 text-purple-600' />
              <h3 className='text-lg font-semibold text-purple-800'>Customer Note</h3>
            </div>
            <div className='bg-white rounded-md p-3 border border-purple-100'>
              {data.customerNote ? (
                <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>{data.customerNote}</p>
              ) : (
                <p className='text-gray-500 italic'>No additional note provided by the customer</p>
              )}
            </div>
          </div>

          {/* Session Information */}
          <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
            <h3 className='text-lg font-semibold text-gray-800 mb-3'>Session Information</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <span className='text-sm font-medium text-gray-600'>Started At:</span>
                <p className='text-gray-800'>
                  {data.startedAt
                    ? new Date(data.startedAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Not started'}
                </p>
              </div>
              <div>
                <span className='text-sm font-medium text-gray-600'>Ended At:</span>
                <p className='text-gray-800'>
                  {data.endedAt
                    ? new Date(data.endedAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Not ended'}
                </p>
              </div>
              <div>
                <span className='text-sm font-medium text-gray-600'>Meeting Platform:</span>
                <p className='text-gray-800'>{data.meetingPlatform || 'Not specified'}</p>
              </div>
              <div>
                <span className='text-sm font-medium text-gray-600'>Meeting Link:</span>
                {data.meetingLink ? (
                  <a
                    href={data.meetingLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:text-blue-800 underline'
                  >
                    Join Meeting
                  </a>
                ) : (
                  <p className='text-gray-800'>No link available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className='flex justify-end pt-4'>
          <Button type='button' variant='outline' onClick={onClose} className='border-gray-300 hover:bg-gray-50'>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
