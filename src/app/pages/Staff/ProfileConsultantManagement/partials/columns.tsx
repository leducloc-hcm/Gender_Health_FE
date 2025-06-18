import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import type { ProfileConsultantResult } from '../models/ProfleConsultantManagement' // Typo: Should be ProfileConsultantManagement

// Define the props for getScheduleColumns
interface ScheduleColumnsProps {
  onEdit: (consultant: ProfileConsultantResult) => void
}

export const getScheduleColumns = ({ onEdit }: ScheduleColumnsProps): ColumnDef<ProfileConsultantResult>[] => {
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
        <div className='truncate text-sm text-gray-700 max-w-xs flex text-start'>{row.original.name || 'No name'}</div>
      )
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 max-w-xs flex text-start'>
          {row.original.email || 'No email'}
        </div>
      )
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 max-w-xs flex text-start'>
          {row.original.description || 'No description'}
        </div>
      )
    },
    {
      accessorKey: 'consultant_profile_id',
      header: 'Consultant ID',
      cell: ({ row }) => row.original.consultant_profile_id || 'Unknown'
    },
    {
      accessorKey: 'specialties',
      header: 'Specialties',
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 max-w-xs flex text-start'>
          {row.original.specialties?.length > 0 ? row.original.specialties.join(', ') : 'No specialties'}
        </div>
      )
    },
    {
      accessorKey: 'languages',
      header: 'Languages',
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 max-w-xs flex text-start'>
          {row.original.languages?.length > 0 ? row.original.languages.join(', ') : 'No languages'}
        </div>
      )
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => (
        <div className='text-sm text-gray-700'>
          {row.original.rating ? row.original.rating.toFixed(1) : 'No rating'}
        </div>
      )
    },
    {
      accessorKey: 'created_at',
      header: 'Created At',
      cell: ({ row }) => {
        try {
          return format(new Date(row.original.created_at), 'dd MMM yyyy HH:mm')
        } catch {
          return 'Invalid Date'
        }
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          className={`text-xs ${
            row.original.status === 'APPROVED'
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
          <div className='flex gap-2'>
            <Button onClick={() => onEdit(consultant)} className='bg-blue-500 hover:bg-blue-600 text-white' size='sm'>
              Edit
            </Button>
          </div>
        )
      }
    }
  ]
}
