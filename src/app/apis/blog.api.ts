import { fetcher } from '@/app/apis/fetcher'

export interface BlogPost {
  id: number
  title: string
  content: string
  date: string
  image: string
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

export interface BlogResponse {
  data: BlogPost[]
  pagination: {
    currentPage: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
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
