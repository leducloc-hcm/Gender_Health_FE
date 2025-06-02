import { fetcher } from '@/app/apis/fetcher'

export interface BlogPost {
  id: number
  title: string
  content: string
  date: string
  image: File
  staff?: {
    id: number
    name: string
  }
  tags?: {
    tag: {
      id: number
      name: string
    }
  }[]
}
export interface BlogRequest {
  title: string
  content: string
  tags: number[]
  date: string
  image: File
}
export interface BlogResponse {
  data: BlogPost[]
  pagination: {
    currentPage: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}
interface BlogMessageResponse {
  message: string
}
export const fetchBlog = async (): Promise<BlogPost[]> => {
  const response = await fetcher.get('/blogs')
  return response.data.data || []
}
export const fetchBlogs = async (page: number, limit: number): Promise<BlogResponse> => {
  const response = await fetcher.get('/blogs', {
    params: { page, limit }
  })
  return {
    data: response.data.data,
    pagination: response.data.pagination
  }
}
export const fetchBlogById = async (id: string) => {
  const res = await fetcher.get(`/blogs/${id}`)
  return res.data.data
}
export const deleteBlog = async (id: number): Promise<void> => {
  await fetcher.delete(`/blogs/delete/${id}`)
}
export const createBlog = async (data: FormData): Promise<BlogMessageResponse> => {
  const res = await fetcher.post('/blogs/create', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return res.data
}

export const updateBlog = async (id: string, data: FormData): Promise<BlogMessageResponse> => {
  const res = await fetcher.put(`/blogs/update/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return res.data
}
