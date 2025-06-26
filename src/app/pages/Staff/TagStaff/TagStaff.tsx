import { fetchTags, deleteTag } from '@/app/apis/tag.api'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'

import DataTableTags from './DataTableTags'
import { getTagColumns } from './tagColumns'
import type { TagBlog } from '../../Auth/Login/models/tag'
import { Activity } from 'lucide-react'

export default function TagPage() {
  const [tags, setTags] = useState<TagBlog[]>([])

  const loadTags = async () => {
    const data = await fetchTags()
    setTags(data)
  }

  const handleDelete = async (id: number, name: string) => {
    const confirm = window.confirm(`Are you sure you want to delete "${name}"?`)
    if (!confirm) return

    try {
      await deleteTag(id.toString())
      toast.success(`Tag "${name}" deleted successfully!`)
      await loadTags()
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error?.response?.data?.message || 'Failed to delete tag.')
    }
  }

  useEffect(() => {
    loadTags()
  }, [])
  return (
    <div className='space-y-6'>
      <div className='bg-white p-6 rounded-lg  border'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <Activity className='h-6 w-6 text-blue-600' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Tag Management</h1>
              <p className='text-gray-600 mt-1'>Manage Tag For Blog </p>
            </div>
          </div>
        </div>
      </div>
      <DataTableTags columns={getTagColumns(handleDelete)} data={tags} />
    </div>
  )
}
