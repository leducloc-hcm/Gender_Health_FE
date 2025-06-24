import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { ArrowUpDown, ExternalLink } from 'lucide-react'
import type { ConsultantManagementResponse } from '../models/ConsultingManagement'
import { AddMeetingLinkModal } from '../components/AddMeetingLinkModal'

interface ColumnsProps {
  onRefresh?: () => void
}

export const useConsultingColumns = ({ onRefresh }: ColumnsProps = {}) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    historyId: number | null
  }>({
    isOpen: false,
    historyId: null
  })

  const handleOpenModal = (historyId: number) => {
    setModalState({ isOpen: true, historyId })
  }

  const handleCloseModal = () => {
    setModalState({ isOpen: false, historyId: null })
  }

  const handleSuccess = () => {
    onRefresh?.()
    handleCloseModal()
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
      accessorKey: 'feedback',
      header: 'Feedback',
      cell: ({ row }) => (
        <div className='flex items-center justify-center px-2'>
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-2 max-w-40'>
            <div className='flex items-center space-x-1 mb-1'>
              <span className='text-yellow-600'>💬</span>
              <span className='text-xs font-semibold text-yellow-700'>Feedback</span>
            </div>
            <p
              className='text-xs text-gray-700 line-clamp-2 cursor-help'
              title={row.original.feedback || 'No feedback'}
            >
              {row.original.feedback || 'No feedback available'}
            </p>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'consultantNote',
      header: 'Consultant Note',
      cell: ({ row }) => (
        <div className='flex items-center justify-center px-2'>
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-2 max-w-40'>
            <div className='flex items-center space-x-1 mb-1'>
              <span className='text-blue-600'>👨‍⚕️</span>
              <span className='text-xs font-semibold text-blue-700'>Doctor Note</span>
            </div>
            <p
              className='text-xs text-gray-700 line-clamp-2 cursor-help'
              title={row.original.consultantNote || 'No note'}
            >
              {row.original.consultantNote || 'No note available'}
            </p>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'customerNote',
      header: 'Customer Note',
      cell: ({ row }) => (
        <div className='flex items-center justify-center px-2'>
          <div className='bg-purple-50 border border-purple-200 rounded-lg p-2 max-w-40'>
            <div className='flex items-center space-x-1 mb-1'>
              <span className='text-purple-600'>👤</span>
              <span className='text-xs font-semibold text-purple-700'>Patient Note</span>
            </div>
            <p
              className='text-xs text-gray-700 line-clamp-2 cursor-help'
              title={row.original.customerNote || 'No note'}
            >
              {row.original.customerNote || 'No note available'}
            </p>
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
        <div className='flex justify-center px-2'>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleOpenModal(row.original.id)}
              className='bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-3 py-2'
            >
              <span className='mr-2'>🔗</span>
              <span className='font-medium text-xs'>Add Link</span>
            </Button>
          </div>
        </div>
      )
    }
  ]

  const Modal = () =>
    modalState.historyId ? (
      <AddMeetingLinkModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        historyId={modalState.historyId}
        onSuccess={handleSuccess}
      />
    ) : null

  return { columns, Modal }
}
