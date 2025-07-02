import { profileApi } from '@/app/apis/profile.api'
import { staffApi } from '@/app/apis/staff.api'
import { Activity } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getScheduleColumns } from './partials/columns'
import DataTable from './partials/DataTable'
import EditConsultantModal from './partials/EditConsultantModal'
import ViewConsultantModal from './partials/ViewConsultantModal'

import type { ProfileConsultantResult as OriginalProfileConsultantResult } from '@/app/pages/Staff/ProfileConsultantManagement/models/ProfleConsultantManagement'

export interface ProfileConsultantResult extends Omit<OriginalProfileConsultantResult, 'avatar' | 'coverPhoto'> {
  avatar: string | File | null
  coverPhoto: string | File | null
  specialties: string[] // Display names for specialties
  specialtyIds?: number[] // IDs for form handling
}

// Main Component
const ProfileConsultantManagement = () => {
  const [consultants, setConsultants] = useState<ProfileConsultantResult[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedConsultant, setSelectedConsultant] = useState<ProfileConsultantResult | null>(null)
  const [originalConsultant, setOriginalConsultant] = useState<ProfileConsultantResult | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const response = await staffApi.getAllProfileConsultants()
      const consultantData: ProfileConsultantResult[] = response.result.map((consultant) => {
        // Handle specialtyIds conversion from specialties
        let specialtyIdsArray: number[] = []
        let specialtiesStringArray: string[] = []

        if (Array.isArray(consultant.specialties)) {
          if (consultant.specialties.length > 0 && typeof consultant.specialties[0] === 'object') {
            // If specialties is an array of objects with id and name properties
            const specialtiesArray = consultant.specialties as unknown as Array<{ id: number; name: string }>
            specialtyIdsArray = specialtiesArray.map((spec) => spec.id)
            specialtiesStringArray = specialtiesArray.map((spec) => spec.name)
          } else if (consultant.specialties.length > 0 && typeof consultant.specialties[0] === 'number') {
            // If specialties is an array of numbers (IDs)
            specialtyIdsArray = consultant.specialties as unknown as number[]
            specialtiesStringArray = consultant.specialties.map((spec) => String(spec))
          } else {
            // If specialties is an array of strings
            specialtyIdsArray = consultant.specialties.map((spec) => Number(spec)).filter((id) => !isNaN(id))
            specialtiesStringArray = consultant.specialties.map((spec) => String(spec))
          }
        }

        return {
          ...consultant,
          specialties: specialtiesStringArray, // Convert to string array for display
          specialtyIds: specialtyIdsArray
        }
      })
      setConsultants(consultantData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch consultants', { position: 'top-right', autoClose: 2000 })
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleEdit = useCallback((consultant: ProfileConsultantResult) => {
    setOriginalConsultant({ ...consultant })
    setSelectedConsultant({ ...consultant })
    setIsEditModalOpen(true)
  }, [])

  const handleView = useCallback((consultant: ProfileConsultantResult) => {
    setSelectedConsultant(consultant)
    setIsViewModalOpen(true)
  }, [])

  const handleSliceToArrayString = useCallback((value: string | string[] | undefined): string[] => {
    if (Array.isArray(value)) return value
    // Handle string input - split by comma and filter out empty strings
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0) // Remove empty strings from deletions
    }
    return []
  }, [])

  const getChangedFields = useCallback(
    (original: ProfileConsultantResult, updated: ProfileConsultantResult) => {
      const changes: Record<string, string | number | string[] | number[] | File | null | undefined> = {}

      // Check basic fields
      const fieldsToCheck: (keyof ProfileConsultantResult)[] = [
        'name',
        'username',
        'email',
        'role',
        'status',
        'phone_number',
        'bio',
        'description',
        'location',
        'date_of_birth',
        'website',
        'rating',
        'total_reviews',
        'experience',
        'response_time',
        'degree',
        'hospital'
      ]

      fieldsToCheck.forEach((field) => {
        if (original[field] !== updated[field]) {
          changes[field] = updated[field]
        }
      })

      // Check specialtyIds array (number[])
      if (JSON.stringify(original.specialtyIds) !== JSON.stringify(updated.specialtyIds)) {
        changes.specialtyIds = updated.specialtyIds
      }

      // Check array fields (languages)
      const originalLanguages = handleSliceToArrayString(original.languages)
      const updatedLanguages = handleSliceToArrayString(updated.languages)
      if (JSON.stringify(originalLanguages) !== JSON.stringify(updatedLanguages)) {
        changes.languages = updatedLanguages
      }

      // Check file fields
      if (original.avatar !== updated.avatar) {
        changes.avatar = updated.avatar
      }

      if (original.coverPhoto !== updated.coverPhoto) {
        changes.coverPhoto = updated.coverPhoto
      }

      return changes
    },
    [handleSliceToArrayString]
  )

  const createFormDataFromChanges = useCallback(
    (changes: Partial<ProfileConsultantResult>): FormData => {
      const formData = new FormData()

      // Handle basic fields
      Object.entries(changes).forEach(([key, value]) => {
        if (key === 'specialties' || key === 'languages' || key === 'specialtyIds') {
          // Handle array fields separately
          return
        }
        if (key === 'avatar' || key === 'coverPhoto') {
          // Handle file fields separately
          return
        }
        if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })

      // Handle specialtyIds array (number[])
      if (changes.specialtyIds && Array.isArray(changes.specialtyIds)) {
        changes.specialtyIds.forEach((specialtyId, index) => {
          formData.append(`specialties[${index}]`, String(specialtyId))
        })
      }
      // Handle specialties array (for backward compatibility)
      else if (changes.specialties && Array.isArray(changes.specialties)) {
        const specialtiesArray = handleSliceToArrayString(changes.specialties)
        // If specialties contains numeric strings, treat them as IDs
        if (specialtiesArray.length > 0 && !isNaN(Number(specialtiesArray[0]))) {
          specialtiesArray.forEach((specialty, index) => {
            formData.append(`specialties[${index}]`, specialty)
          })
        } else {
          // If specialties contains names, convert to IDs if possible
          specialtiesArray.forEach((specialty, index) => {
            formData.append(`specialties[${index}]`, specialty)
          })
        }
      }

      // Handle languages array
      if (changes.languages) {
        const languagesArray = handleSliceToArrayString(changes.languages)
        languagesArray.forEach((language, index) => {
          formData.append(`languages[${index}]`, language)
        })
      }

      // Handle file fields
      if (changes.avatar) {
        if (changes.avatar instanceof File) {
          formData.append('avatar', changes.avatar)
        } else if (typeof changes.avatar === 'string') {
          formData.append('avatar_url', changes.avatar)
        }
      }

      if (changes.coverPhoto) {
        if (changes.coverPhoto instanceof File) {
          formData.append('coverPhoto', changes.coverPhoto)
        } else if (typeof changes.coverPhoto === 'string') {
          formData.append('coverPhoto_url', changes.coverPhoto)
        }
      }

      console.log('FormData changes:', Array.from(formData.entries()))
      return formData
    },
    [handleSliceToArrayString]
  )

  const handleSave = useCallback(async () => {
    if (!selectedConsultant || !originalConsultant) return

    try {
      // Get only the changed fields
      const changes = getChangedFields(originalConsultant, selectedConsultant)
      // Check if there are any changes
      if (Object.keys(changes).length === 0) {
        toast.info('No changes detected', { position: 'top-right', autoClose: 1000 })
        setIsEditModalOpen(false)
        return
      }

      const formData = createFormDataFromChanges(changes)
      console.log('selectedConsultant: ', selectedConsultant)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await profileApi.updateProfileConsultant(selectedConsultant.id, formData as any)

      // setConsultants((prev) => prev.map((c) => (c.id === selectedConsultant.id ? { ...selectedConsultant } : c)))
      fetchData()

      toast.success(`Consultant ${selectedConsultant.name ?? 'Unknown'} updated`, {
        position: 'top-right',
        autoClose: 1000
      })

      setIsEditModalOpen(false)
      setSelectedConsultant(null)
      setOriginalConsultant(null)
    } catch (error) {
      console.error('Error updating consultant:', error)
      toast.error('Failed to update consultant', {
        position: 'top-right',
        autoClose: 2000
      })
    }
  }, [selectedConsultant, originalConsultant, getChangedFields, createFormDataFromChanges, fetchData])

  const handleCancel = useCallback(() => {
    setIsEditModalOpen(false)
    setSelectedConsultant(null)
    setOriginalConsultant(null)
  }, [])

  return (
    <div className='space-y-6'>
      <div className='bg-white p-6 rounded-lg border'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <Activity className='h-6 w-6 text-blue-600' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Profile Consultant Management</h1>
              <p className='text-gray-600 mt-1'>Monitor and manage Consultant test progress for all customers</p>
            </div>
          </div>
        </div>
      </div>
      <DataTable columns={getScheduleColumns({ onEdit: handleEdit, onView: handleView })} data={consultants} />
      <EditConsultantModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        selectedConsultant={selectedConsultant}
        setSelectedConsultant={setSelectedConsultant}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      <ViewConsultantModal
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        selectedConsultant={selectedConsultant}
      />
    </div>
  )
}

export default ProfileConsultantManagement
