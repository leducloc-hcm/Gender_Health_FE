import { fetcher } from '@/app/apis/fetcher'
import axios from 'axios'

export interface BlogPost {
  id: number
  title: string
  content: string
  date: string
  image: string
  staff?: {
    name: string
  }
  tags?: {
    tag: {
      id: number
      name: string
    }
  }[]
}

export const fetchBlogs = async (): Promise<BlogPost[]> => {
  const response = await fetcher.get('/blogs')
  return response.data.data || []
}
