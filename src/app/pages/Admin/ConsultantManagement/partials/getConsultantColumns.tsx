import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import type { ConsultantData } from '../ConsultantManagement'
import DeleteDialog from '@/app/pages/Admin/Common/DeleteDialog'

// Define the props for getScheduleColumns
interface ColumnsProps {
  onEdit: (consultant: ConsultantData) => void
  onView: (consultant: ConsultantData) => void
  onDelete: (id: number) => Promise<void>
  isDeleting?: boolean
}

export const getConsultantColumns = ({
  onEdit,
  onView,
  onDelete,
  isDeleting = false
}: ColumnsProps): ColumnDef<ConsultantData>[] => {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 flex text-start justify-center'>
          {row.original.name || 'No name'}
        </div>
      )
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 flex justify-center'>{row.original.email || 'No email'}</div>
      )
    },
    {
      accessorKey: 'specialties',
      header: 'Specialties',
      cell: ({ row }) => (
        <div className='flex flex-wrap gap-1 justify-center items-center max-w-xs mx-auto'>
          {row.original.specialties?.length > 0 ? (
            row.original.specialties.map((spec, index) => (
              <Badge key={index} className='bg-green-100 text-black-800 hover:bg-green-200 text-xs font-medium'>
                {spec.name}
              </Badge>
            ))
          ) : (
            <span className='text-sm text-gray-500'>No specialties</span>
          )}
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          className={`text-xs ${
            row.original.status === 'VERIFIED'
              ? 'bg-green-500'
              : row.original.status === 'REJECT'
                ? 'bg-red-500'
                : row.original.status === 'PENDING'
                  ? 'bg-yellow-500'
                  : 'bg-gray-500'
          } text-white`}
        >
          {row.original.status || 'Unknown'}
        </Badge>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const consultant = row.original
        return (
          <div className='flex gap-2 justify-center'>
            <Button onClick={() => onEdit(consultant)} className='bg-blue-500 hover:bg-blue-600 text-white' size='sm'>
              Edit
            </Button>
            <Button onClick={() => onView(consultant)} className='bg-gray-500 hover:bg-gray-600 text-white' size='sm'>
              View
            </Button>
            <Button
              onClick={() => onDelete(consultant.id)}
              className='bg-red-500 hover:bg-red-600 text-white'
              size='sm'
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        )
      }
    }
  ]
}
