import { fetcher } from '@/app/apis/fetcher'
import type {
  getAllSpecialtiesResponse,
  getSpecialtiesIdResponse,
  CreateSpecialtyReqBody,
  UpdateSpecialtyReqBody
} from '../pages/Admin/SpecialtyManagement/Models/SpecialtyManagement'

// Get all specialties
export const getAllSpecialties = async (): Promise<getAllSpecialtiesResponse> => {
  const response = await fetcher.get('/specialties')
  return response.data
}

// Get specialty by ID
export const getSpecialtyById = async (id: number): Promise<getSpecialtiesIdResponse> => {
  const response = await fetcher.get(`/specialties/${id}`)
  return response.data
}

// Create new specialty
export const createSpecialty = async (payload: CreateSpecialtyReqBody) => {
  const response = await fetcher.post('/specialties/create', payload)
  return response.data
}

// Update specialty by ID
export const updateSpecialty = async (id: number, payload: UpdateSpecialtyReqBody) => {
  const response = await fetcher.put(`/specialties/update/${id}`, payload)
  return response.data
}

// Delete specialty by ID
export const deleteSpecialty = async (id: number) => {
  const response = await fetcher.delete(`/specialties/delete/${id}`)
  return response.data
}

export const specialtyApi = {
  getAllSpecialties,
  getSpecialtyById,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty
}
