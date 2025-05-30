// components/blog/columns.tsx
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import type { BlogPost } from '@/app/apis/blog.api'

export const columns: ColumnDef<BlogPost>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <div className='font-medium'>{row.getValue('title')}</div>
  },
  {
    accessorKey: 'staff.name',
    header: 'Author',
    cell: ({ row }) => row.original.staff?.name || 'Unknown'
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => format(new Date(row.original.date), 'dd MMM yyyy')
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => (
      <div className='flex flex-wrap gap-1'>
        {row.original.tags?.map((tag, i) => (
          <Badge key={i} className='text-xs bg-gray-200 text-black'>
            {tag.tag.name}
          </Badge>
        ))}
      </div>
    )
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const id = row.original.id
      return (
        <div className='flex gap-2'>
          <Button onClick={() => console.log('View', id)}>View</Button>
          <Button onClick={() => console.log('Edit', id)}>Edit</Button>
          <Button onClick={() => console.log('Delete', id)}>Delete</Button>
        </div>
      )
    }
  }
]
