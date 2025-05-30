// pages/admin/BlogStaffTable.tsx
import { useEffect, useState } from 'react'

import { fetchBlogs, type BlogPost } from '@/app/apis/blog.api'
import DataTable from '@/app/components/ui/DataTable'
import { columns } from './columns'

export default function BlogStaff() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])

  useEffect(() => {
    const load = async () => {
      const res = await fetchBlogs(1, 1000) // lấy hết
      setBlogs(res.data)
    }
    load()
  }, [])

  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold mb-6'>Manage Blogs</h1>
      <DataTable columns={columns} data={blogs} />
    </div>
  )
}
