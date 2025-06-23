import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'

import { fetchBlogs, deleteBlog, type BlogPost } from '@/app/apis/blog.api'
import DataTable from '@/app/pages/Staff/BlogStaff/DataTable'
import { toast } from 'react-toastify'
import { getBlogColumns } from './columns'
import { Activity } from 'lucide-react'

export default function BlogStaffTable() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(false)
  // const navigate = useNavigate()

  // ✅ Hàm load dữ liệu từ API
  const loadBlogs = async () => {
    setIsLoading(true)
    try {
      const res = await fetchBlogs(1, 1000) // lấy tất cả blogs (hoặc phân trang sau)
      setBlogs(res.data)
      console.log('Blogs:', res.data)
    } catch (err) {
      console.error('Failed to load blogs:', err)
      toast.error('Không thể tải danh sách blog')
    } finally {
      setIsLoading(false)
    }
  }

  // Gọi khi component mount
  useEffect(() => {
    loadBlogs()
  }, [])

  // Xử lý xoá blog
  const handleDelete = async (id: number) => {
    const confirmed = confirm('Bạn có chắc chắn muốn xoá blog này không?')
    if (!confirmed) return

    try {
      await deleteBlog(id)
      toast.success('Đã xoá blog thành công')
      loadBlogs()
    } catch (err) {
      console.error('Failed to load blogs:', err)
      toast.error('Xoá blog thất bại')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='bg-white p-6 rounded-lg  border'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <Activity className='h-6 w-6 text-blue-600' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Blog Management</h1>
              <p className='text-gray-600 mt-1'>Monitor and manage Blog</p>
            </div>
          </div>
        </div>
      </div>

      <DataTable data={blogs} columns={getBlogColumns({ onDelete: handleDelete })} />
    </div>
  )
}
