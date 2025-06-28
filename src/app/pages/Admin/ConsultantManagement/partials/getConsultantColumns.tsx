import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Avatar } from '@/app/components/ui/avatar'
import { AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import type { ProfileConsultantData } from '@/app/pages/Admin/ConsultantManagement/models/consultant.type'
import DeleteDialog from '@/app/pages/Admin/Common/DeleteDialog'

// Define the props for getScheduleColumns
interface ColumnsProps {
  onEdit: (consultant: ProfileConsultantData) => void
  onView: (consultant: ProfileConsultantData) => void
  onDelete: (id: number) => Promise<void>
  isDeleting?: boolean
}

export const getConsultantColumns = ({
  onEdit,
  onView,
  onDelete,
  isDeleting = false
}: ColumnsProps): ColumnDef<any>[] => {
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
      accessorKey: 'avatar',
      header: 'Avatar',
      cell: ({ row }) => (
        <div className='flex justify-center'>
          <Avatar className='w-10 h-10 rounded-none'>
            <AvatarImage src={`${row.original.avatar}`} />
            <AvatarFallback>{row.original.name || 'N/A'}</AvatarFallback>
          </Avatar>
        </div>
      )
    },
    {
      accessorKey: 'specialties',
      header: 'Specialties',
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 max-w-xs flex text-start justify-center'>
          {row.original.specialties?.length > 0 ? row.original.specialties.join(', ') : 'No specialties'}
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
            <DeleteDialog onConfirm={onDelete} itemId={consultant.id} isLoading={isDeleting} />
          </div>
        )
      }
    }
  ]
}
