import { fetcher } from '@/app/apis/fetcher'
import type { TagBlog } from '../pages/Auth/Login/models/tag'

export const fetchTags = async (): Promise<TagBlog[]> => {
  const response = await fetcher.get('/tags')
  return response.data.data || []
}
export const createTag = async (payload: { name: string; description: string }) => {
  const response = await fetcher.post('/tags/create', payload)
  return response.data
}
export const getTagById = async (id: string) => {
  const response = await fetcher.get(`/tags/${id}`)
  return response.data.data // { name, description }
}

// Cập nhật tag theo ID
export const updateTag = async (id: string, payload: { name: string; description: string }) => {
  const response = await fetcher.put(`/tags/update/${id}`, payload)
  return response.data
}

// Xóa tag theo ID
export const deleteTag = async (id: string) => {
  const response = await fetcher.delete(`/tags/delete/${id}`)
  return response.data
}
