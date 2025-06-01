import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'

import { fetchBlogs, deleteBlog, type BlogPost } from '@/app/apis/blog.api'
import DataTable from '@/app/pages/Staff/BlogStaff/DataTable'
import { toast } from 'react-toastify'
import { getBlogColumns } from './columns'

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
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold mb-6'>Manage Blogs</h1>

      {isLoading ? (
        <p className='text-gray-500'>Đang tải dữ liệu...</p>
      ) : (
        <DataTable data={blogs} columns={getBlogColumns({ onDelete: handleDelete })} />
      )}
    </div>
  )
}
