import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getLocalStorage = (key: string) => {
  const value = localStorage.getItem(key)
  if (value) return JSON.parse(value)
  return null
}

export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key)
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const truncateContent = (content: string, maxLength = 150) => {
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + '...'
}
