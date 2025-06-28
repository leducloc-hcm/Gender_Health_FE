import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import DeleteDialog from '@/app/pages/Admin/Common/DeleteDialog'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import type { StaffData } from '../StaffManagement'

interface GetStaffColumnsProps {
  onEdit: (staff: StaffData) => void
  onView: (staff: StaffData) => void
  onDelete: (id: number) => void
  isDeleting: boolean
}

export const getStaffColumns = ({
  onEdit,
  onView,
  onDelete,
  isDeleting
}: GetStaffColumnsProps): ColumnDef<StaffData>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='h-auto p-0 font-medium'
      >
        Name
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <div className='font-medium'>{row.getValue('name')}</div>
      </div>
    )
  },

  {
    accessorKey: 'email',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='h-auto p-0 font-medium'
      >
        Email
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    )
  },

  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <Badge variant='secondary' className='capitalize'>
        {row.getValue('role')}
      </Badge>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge variant={status === 'active' ? 'default' : 'destructive'} className='capitalize'>
          {status}
        </Badge>
      )
    }
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='h-auto p-0 font-medium'
      >
        Created Date
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return date.toLocaleDateString()
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const staff = row.original
      return (
        <div className='flex gap-2 justify-center'>
          <Button onClick={() => onEdit(staff)} className='bg-blue-500 hover:bg-blue-600 text-white' size='sm'>
            Edit
          </Button>
          <Button onClick={() => onView(staff)} className='bg-gray-500 hover:bg-gray-600 text-white' size='sm'>
            View
          </Button>
          <DeleteDialog onConfirm={onDelete} itemId={staff.id} isLoading={isDeleting} />
        </div>
      )
    }
  }
]
