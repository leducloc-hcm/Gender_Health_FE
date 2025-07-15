import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { ArrowUpDown, ExternalLink, MessageSquare, Eye } from 'lucide-react'
import type { ConsultantManagementResponse } from '../models/ConsultingManagement'
import { AddMeetingLinkModal } from './AddMeetingLinkModal'
import { ConsultantFeedbackModal } from './ConsultantFeedbackModal'
import { ViewFeedbackModal } from './ViewFeedbackModal'

interface ColumnsProps {
  onRefresh?: () => void
}

export const useConsultingColumns = ({ onRefresh }: ColumnsProps = {}) => {
  const [meetingLinkModalState, setMeetingLinkModalState] = useState<{
    isOpen: boolean
    historyId: number | null
  }>({
    isOpen: false,
    historyId: null
  })

  const [feedbackModalState, setFeedbackModalState] = useState<{
    isOpen: boolean
    historyId: number | null
  }>({
    isOpen: false,
    historyId: null
  })

  const [viewFeedbackModalState, setViewFeedbackModalState] = useState<{
    isOpen: boolean
    data: ConsultantManagementResponse | null
  }>({
    isOpen: false,
    data: null
  })

  const handleOpenMeetingLinkModal = (historyId: number) => {
    setMeetingLinkModalState({ isOpen: true, historyId })
  }

  const handleCloseMeetingLinkModal = () => {
    setMeetingLinkModalState({ isOpen: false, historyId: null })
  }

  const handleOpenFeedbackModal = (historyId: number) => {
    setFeedbackModalState({ isOpen: true, historyId })
  }

  const handleCloseFeedbackModal = () => {
    setFeedbackModalState({ isOpen: false, historyId: null })
  }

  const handleOpenViewFeedbackModal = (data: ConsultantManagementResponse) => {
    setViewFeedbackModalState({ isOpen: true, data })
  }

  const handleCloseViewFeedbackModal = () => {
    setViewFeedbackModalState({ isOpen: false, data: null })
  }

  const handleSuccess = () => {
    onRefresh?.()
    handleCloseMeetingLinkModal()
    handleCloseFeedbackModal()
    handleCloseViewFeedbackModal()
  }

  const columns: ColumnDef<ConsultantManagementResponse>[] = [
    {
      accessorKey: 'consultantProfile.name',
      header: ({ column }) => (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Consultant Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => (
        <div className='flex items-center justify-start px-2'>
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
              <span className='text-xs font-semibold text-blue-600'>
                {row.original.consultantProfile?.name?.charAt(0).toUpperCase() || 'C'}
              </span>
            </div>
            <span className='font-medium text-gray-900 truncate max-w-32'>
              {row.original.consultantProfile?.name || 'No name'}
            </span>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'customerProfile.name',
      header: ({ column }) => (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Customer Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => (
        <div className='flex items-center justify-start px-2'>
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
              <span className='text-xs font-semibold text-green-600'>
                {row.original.customerProfile?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <span className='font-medium text-gray-900 truncate max-w-32'>
              {row.original.customerProfile?.name || 'No name'}
            </span>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'startedAt',
      header: ({ column }) => (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Started At
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => (
        <div className='flex items-center justify-center px-2'>
          <div className='flex flex-col items-center space-y-1'>
            <span className='text-xs text-gray-600 text-center leading-tight'>
              {row.original.startedAt
                ? new Date(row.original.startedAt).toLocaleDateString() +
                  '\n' +
                  new Date(row.original.startedAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Not started'}
            </span>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'endedAt',
      header: ({ column }) => (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Ended At
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => (
        <div className='flex items-center justify-center px-2'>
          <div className='flex flex-col items-center space-y-1'>
            <span className='text-xs text-gray-600 text-center leading-tight'>
              {row.original.endedAt
                ? new Date(row.original.endedAt).toLocaleDateString() +
                  '\n' +
                  new Date(row.original.endedAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Not ended'}
            </span>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'meetingLink',
      header: 'Meeting Link',
      cell: ({ row }) => (
        <div className='flex justify-center px-2'>
          {row.original.meetingLink ? (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => window.open(row.original.meetingLink, '_blank')}
              className='bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-3 py-2'
            >
              <ExternalLink className='h-4 w-4 mr-2' />
              <span className='font-medium'>Join Meeting</span>
            </Button>
          ) : (
            <div className='flex items-center justify-center px-3 py-2 bg-gray-100 rounded-lg border border-gray-200'>
              <span className='text-xs text-gray-500 font-medium'>No meeting link</span>
            </div>
          )}
        </div>
      )
    },
    {
      accessorKey: 'meetingPlatform',
      header: 'Platform',
      cell: ({ row }) => (
        <div className='flex justify-center px-2'>
          <div className='flex items-center space-x-2 bg-indigo-50 border border-indigo-200 rounded-full px-3 py-1'>
            <span className='text-indigo-600'>
              {row.original.meetingPlatform?.toLowerCase().includes('zoom')
                ? '🎥'
                : row.original.meetingPlatform?.toLowerCase().includes('teams')
                  ? '👥'
                  : row.original.meetingPlatform?.toLowerCase().includes('meet')
                    ? '📱'
                    : '💻'}
            </span>
            <Badge variant='secondary' className='text-xs font-medium bg-indigo-100 text-indigo-700 border-indigo-200'>
              {row.original.meetingPlatform || 'Unknown'}
            </Badge>
          </div>
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex justify-start px-2'>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleOpenMeetingLinkModal(row.original.id)}
              className='bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:text-white border-none shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-3 py-2'
            >
              <span className='mr-2'>🔗</span>
              <span className='font-medium text-xs'>Add Link</span>
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleOpenViewFeedbackModal(row.original)}
              className='bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white hover:text-white border-none shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-3 py-2'
            >
              <Eye className='w-3 h-3 mr-1' />
              <span className='font-medium text-xs'>View Feedback</span>
            </Button>
            {new Date(row.original.scheduleAt) < new Date() && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => handleOpenFeedbackModal(row.original.id)}
                className='bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:text-white border-none shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-3 py-2'
              >
                <MessageSquare className='w-3 h-3 mr-1' />
                <span className='font-medium text-xs'>Note</span>
              </Button>
            )}
          </div>
        </div>
      )
    }
  ]

  const Modal = () => (
    <>
      {meetingLinkModalState.historyId && (
        <AddMeetingLinkModal
          isOpen={meetingLinkModalState.isOpen}
          onClose={handleCloseMeetingLinkModal}
          historyId={meetingLinkModalState.historyId}
          onSuccess={handleSuccess}
        />
      )}
      {feedbackModalState.historyId && (
        <ConsultantFeedbackModal
          isOpen={feedbackModalState.isOpen}
          onClose={handleCloseFeedbackModal}
          historyId={feedbackModalState.historyId}
          onSuccess={handleSuccess}
        />
      )}
      {viewFeedbackModalState.data && (
        <ViewFeedbackModal
          isOpen={viewFeedbackModalState.isOpen}
          onClose={handleCloseViewFeedbackModal}
          data={viewFeedbackModalState.data}
        />
      )}
    </>
  )

  return { columns, Modal }
}
