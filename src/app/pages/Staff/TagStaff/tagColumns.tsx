import type { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/app/components/ui/button'

import { ArrowUpDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { TagBlog } from '../../Auth/Login/models/tag'

export const getTagColumns = (onDelete: (id: number, name: string) => void): ColumnDef<TagBlog>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Name
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    )
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.original.description || 'No description available'
      return <span className='text-sm text-gray-600'>{description}</span>
    }
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { id, name } = row.original
      return (
        <div className='flex gap-2 justify-center items-center'>
          <Link to={`/staff/tag/edit/${id}`}>
            <Button className='bg-yellow-500 hover:bg-yellow-600 text-white' size='sm'>
              Edit
            </Button>
          </Link>
          <Button className='bg-red-500 hover:bg-red-600 text-white' size='sm' onClick={() => onDelete(id, name)}>
            Delete
          </Button>
        </div>
      )
    }
  }
]
