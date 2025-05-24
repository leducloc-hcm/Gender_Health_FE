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
