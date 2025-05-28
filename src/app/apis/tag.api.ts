import { fetcher } from '@/app/apis/fetcher'
import type { TagBlog } from '../pages/Auth/Login/models/tag'

export const fetchTags = async (): Promise<TagBlog[]> => {
  const response = await fetcher.get('/tags')
  return response.data.data || []
}
