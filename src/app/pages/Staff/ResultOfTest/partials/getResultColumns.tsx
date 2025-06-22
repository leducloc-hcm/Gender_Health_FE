import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import type { Data } from '@/app/pages/Staff/StiTracking/models/sti.type'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, FileText, Plus } from 'lucide-react'

interface ResultColumnsProps {
  onCreateResult: (testId: number) => void
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

export const getResultColumns = ({ onCreateResult }: ResultColumnsProps): ColumnDef<Data>[] => [
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
    filterFn: (row, id, value) => {
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
    accessorKey: 'id',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Test Id
        <ArrowUpDown className='ml-1 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => <div className='text-sm font-medium text-blue-600'>#{row.original.id}</div>
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
    header: () => <div className='font-semibold text-gray-700'>Actions</div>,
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <Button
          onClick={() => onCreateResult(row.original.id)}
          size='sm'
          className='bg-green-600 hover:bg-green-700 text-white flex items-center space-x-1'
        >
          <Plus className='w-4 h-4' />
          <span>Create Result</span>
        </Button>
      </div>
    )
  }
]
