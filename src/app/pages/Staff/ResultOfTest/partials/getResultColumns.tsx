import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import type { Data } from '@/app/pages/Staff/StiTracking/models/sti.type'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, FileText } from 'lucide-react'

interface ResultColumnsProps {
  onCreateResult: (testId: number) => void
  onEditResult: (testId: number) => void
  onViewResult: (testId: number) => void
  onDeleteResult: (testId: number) => void
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getResultColumns = ({
  onCreateResult,
  onEditResult,
  onViewResult,
  onDeleteResult
}: ResultColumnsProps): ColumnDef<Data>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <div className='flex items-center justify-center'>
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Test Id
          <ArrowUpDown className=' h-4 w-4' />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div className='text-sm text-center font-medium text-blue-600'>#{row.original.id}</div>
  },
  {
    accessorKey: 'customerInfo',
    header: () => <div className='font-semibold text-gray-700'>Customer Info</div>,
    cell: ({ row }) => (
      <div className='flex items-center space-x-3 min-w-[200px]'>
        <div className='relative'>
          <img
            className='h-12 w-12 rounded-full object-cover border-2 border-gray-200'
            src={row.original.orderItem.order.customerProfile.avatar || '/default-avatar.png'}
            alt=''
          />
          <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white'></div>
        </div>
        <div>
          <div className='text-sm font-semibold text-gray-900'>{row.original.orderItem.order.customerProfile.name}</div>
          <div className='text-xs text-gray-500'>@{row.original.orderItem.order.customerProfile.username}</div>
        </div>
      </div>
    ),
    filterFn: (row, value) => {
      return (
        row.original.orderItem.order.customerProfile.name.toLowerCase().includes(value.toLowerCase()) ||
        row.original.orderItem.name.toLowerCase().includes(value.toLowerCase()) ||
        row.original.id.toString().includes(value)
      )
    }
  },
  {
    accessorKey: 'testDetails',
    header: () => <div className='font-semibold text-gray-700'>Test Details</div>,
    cell: ({ row }) => (
      <div className='space-y-1'>
        <div className='text-sm font-semibold text-gray-900'>{row.original.orderItem.name}</div>
        <div className='text-xs text-gray-500'>{row.original.orderItem.description}</div>
      </div>
    )
  },

  {
    accessorKey: 'status',
    header: () => <div className='font-semibold text-gray-700'>Status</div>,
    cell: ({ row }) => (
      <Badge className='bg-indigo-50 text-indigo-700 border-indigo-200 flex items-center gap-1'>
        <FileText className='w-3 h-3' />
        {row.original.status}
      </Badge>
    )
  },
  {
    accessorKey: 'reportDate',
    header: () => <div className='font-semibold text-gray-700'>Report Date</div>,
    cell: ({ row }) => <div className='text-sm text-gray-600'>{formatDate(row.original.reportDate)}</div>
  },
  {
    id: 'actions',
    header: () => <div className='font-semibold text-gray-700 text-center'>Actions</div>,
    cell: ({ row }) => (
      <div className='flex space-x-2 justify-center'>
        {row.original.status === 'RESULT_AVAILABLE' ? (
          <>
            <Button
              onClick={() => onViewResult(row.original.id)}
              className='bg-blue-500 hover:bg-blue-600 text-white'
              size='sm'
            >
              <span>View</span>
            </Button>

            <Button
              onClick={() => onEditResult?.(row.original.id)}
              size='sm'
              className='bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white flex items-center space-x-1'
            >
              Edit
            </Button>

            <Button
              onClick={() => onDeleteResult(row.original.id)}
              size='sm'
              className='bg-red-500 hover:bg-red-600 text-white hover:text-white flex items-center space-x-1'
            >
              <span>Delete</span>
            </Button>
          </>
        ) : (
          <Button
            onClick={() => onCreateResult(row.original.id)}
            size='sm'
            className='bg-green-600 hover:bg-green-700 text-white flex items-center space-x-1'
          >
            <span>Create Result</span>
          </Button>
        )}
      </div>
    )
  }
]
