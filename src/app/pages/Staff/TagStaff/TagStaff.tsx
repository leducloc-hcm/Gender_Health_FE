import React from 'react'

import { fetchTags } from '@/app/apis/tag.api'
import DataTableTags from './DataTableTags'
import { tagColumns } from './tagColumns'
import type { TagBlog } from '../../Auth/Login/models/tag'

export default function TagPage() {
  const [data, setData] = React.useState<TagBlog[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const tags = await fetchTags()
        console.log('tags: ', tags)
        setData(tags)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return <div className='text-center py-10'>Loading...</div>

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Tags Management</h1>
      <DataTableTags columns={tagColumns} data={data} />
    </div>
  )
}
