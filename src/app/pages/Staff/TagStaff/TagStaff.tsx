import { fetchTags, deleteTag } from '@/app/apis/tag.api'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'

import DataTableTags from './DataTableTags'
import { getTagColumns } from './tagColumns'
import type { TagBlog } from '../../Auth/Login/models/tag'

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
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Tags</h1>
      <DataTableTags columns={getTagColumns(handleDelete)} data={tags} />
    </div>
  )
}
