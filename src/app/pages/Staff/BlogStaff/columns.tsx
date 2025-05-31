import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import type { BlogPost } from '@/app/apis/blog.api'
import { ArrowUpDown } from 'lucide-react'
import { Link } from 'react-router-dom'

export const getBlogColumns = ({ onDelete }: { onDelete: (id: number) => void }): ColumnDef<BlogPost>[] => [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Title
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    )
  },
  {
    accessorKey: 'content',
    header: 'Content',
    cell: ({ row }) => (
      <div className='truncate text-sm text-gray-700 max-w-xs'>{row.original.content || 'No description'}</div>
    )
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
    accessorKey: 'image', // ✅ đã sửa lỗi dư khoảng trắng
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = row.original.image || 'https://via.placeholder.com/150'
      return <img src={imageUrl} alt={row.original.title} className='w-30 h-10 object-cover rounded' />
    }
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
          <Link to={`/staff/blog/${id}`}>
            <Button className='bg-blue-500 hover:bg-blue-600 text-white' size='sm'>
              View
            </Button>
          </Link>

          <Link to={`/staff/blog/edit/${id}`}>
            <Button className='bg-yellow-500 hover:bg-yellow-600 text-white' size='sm'>
              Edit
            </Button>
          </Link>

          <Button onClick={() => onDelete(id)} className='bg-red-500 hover:bg-red-600 text-white' size='sm'>
            Delete
          </Button>
        </div>
      )
    }
  }
]
