import { consultantApi } from '@/app/apis/consultant.api'
import { Button } from '@/app/components/ui/button'
import CreateConsultantModal from '@/app/pages/Admin/ConsultantManagement/partials/CreateConsultantModal'
import EditConsultantModal from '@/app/pages/Admin/ConsultantManagement/partials/EditConsultantModal'
import ViewConsultantModal from '@/app/pages/Admin/ConsultantManagement/partials/ViewConsultantModal'
import { getConsultantColumns } from '@/app/pages/Admin/ConsultantManagement/partials/getConsultantColumns'
import { PlusSquare } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import type { ProfileConsultantData, RegisterConsultantReqBody, SpecialtyObject } from './models/consultant.type'
import DataTable from './partials/DataTable'
import Swal from 'sweetalert2'

export interface ConsultantData extends Omit<ProfileConsultantData, 'avatar' | 'coverPhoto' | 'specialties'> {
  avatar: string | File | null
  coverPhoto: string | File | null
  specialties: SpecialtyObject[] // For display in table
  specialtyIds: number[] // For form handling
}

const ConsultantManagement = () => {
  const [consultants, setConsultants] = useState<ConsultantData[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedConsultant, setSelectedConsultant] = useState<ConsultantData | null>(null)
  const [originalConsultant, setOriginalConsultant] = useState<ConsultantData | null>(null)
  const [newConsultant, setNewConsultant] = useState<Partial<RegisterConsultantReqBody>>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await consultantApi.getAllProfileConsultants()
      const consultantData: ConsultantData[] = response.result.map((consultant) => {
        let specialtiesArray: SpecialtyObject[] = []
        let specialtyIdsArray: number[] = []

        if (Array.isArray(consultant.specialties) && consultant.specialties.length > 0) {
          if (typeof consultant.specialties[0] === 'object' && consultant.specialties[0] !== null) {
            // API returns specialty objects
            specialtiesArray = consultant.specialties as unknown as SpecialtyObject[]
            specialtyIdsArray = specialtiesArray.map((spec) => spec.id)
          } else {
            // API returns specialty IDs
            specialtyIdsArray = consultant.specialties.map((spec) => Number(spec))
          }
        }

        return {
          ...consultant,
          avatar: consultant.avatar as string | File | null,
          coverPhoto: consultant.coverPhoto as string | File | null,
          specialties: specialtiesArray,
          specialtyIds: specialtyIdsArray
        } as ConsultantData
      })
      setConsultants(consultantData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch consultants', { position: 'top-right', autoClose: 2000 })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleEdit = useCallback((consultant: ConsultantData) => {
    setOriginalConsultant({ ...consultant })
    setSelectedConsultant({ ...consultant })
    setIsEditModalOpen(true)
  }, [])

  const handleView = useCallback((consultant: ConsultantData) => {
    setSelectedConsultant(consultant)
    setIsViewModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (id: number) => {
      const consultantToDelete = consultants.find((c) => c.id === id)

      const hasWorkSchedule = consultantToDelete?.workSchedule && consultantToDelete.workSchedule.length > 0

      let warningText = 'This action cannot be undone.'

      if (hasWorkSchedule) {
        warningText = `This consultant has ${consultantToDelete.workSchedule.length} active work schedule(s). Deleting this consultant will also remove all associated work schedules. This action cannot be undone.`
      }

      const result = await Swal.fire({
        title: 'Are you sure to delete?',
        text: warningText,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        ...(hasWorkSchedule && {
          html: `
          <div class="text-left">
            <p class="mb-3">This consultant has <strong>${consultantToDelete.workSchedule.length} active work schedule(s)</strong>:</p>
            <ul class="list-disc list-inside mb-3 text-sm">
              ${consultantToDelete.workSchedule
                .map((schedule) => `<li>From ${schedule.startTime} to ${schedule.endTime}</li>`)
                .join('')}
            </ul>
            <p class="text-red-600 font-medium">Deleting this consultant will also remove all associated work schedules. This action cannot be undone.</p>
          </div>
        `
        })
      })

      if (!result.isConfirmed) return
      setIsDeleting(true)
      try {
        await consultantApi.deleteConsultantAccount(id)

        const deletedConsultant = consultants.find((c) => c.id === id)
        toast.success(`Consultant ${deletedConsultant?.name || 'Unknown'} deleted successfully`, {
          position: 'top-right',
          autoClose: 1000
        })

        fetchData()
      } catch (error) {
        console.error('Error deleting consultant:', error)
        toast.error('Failed to delete consultant', {
          position: 'top-right',
          autoClose: 2000
        })
      } finally {
        setIsDeleting(false)
      }
    },
    [consultants, fetchData]
  )

  const handleSliceToArrayString = useCallback((value: string | string[] | undefined): string[] => {
    if (Array.isArray(value)) return value
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    }
    return []
  }, [])

  const getChangedFields = useCallback(
    (original: ConsultantData, updated: ConsultantData) => {
      const changes: Record<string, string | number | string[] | number[] | File | null | undefined> = {}

      const fieldsToCheck: (keyof Omit<ConsultantData, 'specialties' | 'workSchedule'>)[] = [
        'name',
        'username',
        'email',
        'phone_number',
        'bio',
        'description',
        'location',
        'date_of_birth',
        'website',
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

      // Check specialtyIds array (number[]) instead of specialties objects
      if (JSON.stringify(original.specialtyIds) !== JSON.stringify(updated.specialtyIds)) {
        changes.specialties = updated.specialtyIds
      }

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
    (changes: Partial<ConsultantData>): FormData => {
      const formData = new FormData()

      Object.entries(changes).forEach(([key, value]) => {
        if (key === 'specialties' || key === 'languages') {
          return
        }
        if (key === 'avatar' || key === 'coverPhoto') {
          return
        }
        if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })

      if (changes.specialties && Array.isArray(changes.specialties)) {
        changes.specialties.forEach((specialtyId, index) => {
          formData.append(`specialties[${index}]`, String(specialtyId))
        })
      }

      if (changes.languages) {
        const languagesArray = handleSliceToArrayString(changes.languages)
        languagesArray.forEach((language, index) => {
          formData.append(`languages[${index}]`, language)
        })
      }

      // Handle file fields
      if (changes.avatar && changes.avatar instanceof File) {
        formData.append('avatar', changes.avatar)
      }

      if (changes.coverPhoto && changes.coverPhoto instanceof File) {
        formData.append('coverPhoto', changes.coverPhoto)
      }

      return formData
    },
    [handleSliceToArrayString]
  )

  const handleSave = useCallback(async () => {
    if (!selectedConsultant || !originalConsultant) return

    try {
      const changes = getChangedFields(originalConsultant, selectedConsultant)

      if (Object.keys(changes).length === 0) {
        toast.info('No changes detected', { position: 'top-right', autoClose: 1000 })
        setIsEditModalOpen(false)
        return
      }

      // Debug changes before creating FormData
      console.log('Changes detected:', changes)
      console.log('Specialties array:', changes.specialties, 'Type:', typeof changes.specialties)
      if (Array.isArray(changes.specialties)) {
        console.log(
          'Each specialty ID type:',
          changes.specialties.map((id, index) => ({ index, id, type: typeof id }))
        )
      }

      const formData = createFormDataFromChanges(changes)

      // Debug FormData content
      console.log('FormData entries:')
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value, typeof value)
      }

      await consultantApi.updateConsultantProfile(selectedConsultant.id, formData)

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

  const handleCreate = useCallback(async () => {
    try {
      // Validate required fields
      if (!newConsultant.name || !newConsultant.email || !newConsultant.password || !newConsultant.confirm_password) {
        toast.error('Please fill in all required fields', { position: 'top-right', autoClose: 2000 })
        return
      }

      if (newConsultant.password !== newConsultant.confirm_password) {
        toast.error('Passwords do not match', { position: 'top-right', autoClose: 2000 })
        return
      }

      await consultantApi.createConsultantAccount(newConsultant as RegisterConsultantReqBody)

      toast.success(`Consultant ${newConsultant.name} created successfully`, {
        position: 'top-right',
        autoClose: 1000
      })

      setIsCreateModalOpen(false)
      setNewConsultant({})
      fetchData()
    } catch (error) {
      console.error('Error creating consultant:', error)
      toast.error('Failed to create consultant', {
        position: 'top-right',
        autoClose: 2000
      })
    }
  }, [newConsultant, fetchData])

  const handleCancel = useCallback(() => {
    setIsEditModalOpen(false)
    setSelectedConsultant(null)
    setOriginalConsultant(null)
  }, [])

  const handleCancelCreate = useCallback(() => {
    setIsCreateModalOpen(false)
    setNewConsultant({})
  }, [])

  return (
    <div className='p-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold mb-4'>Consultant Management</h1>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className='bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
          size='lg'
        >
          <PlusSquare className='h-6 w-6' />
          Create Consultant
        </Button>
      </div>
      <div className='table-container'>
        <DataTable
          columns={getConsultantColumns({
            onEdit: handleEdit,
            onView: handleView,
            onDelete: handleDelete,
            isDeleting
          })}
          data={consultants}
          isLoading={isLoading}
        />

        <CreateConsultantModal
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          newConsultant={newConsultant}
          setNewConsultant={setNewConsultant}
          onCreate={handleCreate}
          onCancel={handleCancelCreate}
        />

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
    </div>
  )
}

export default ConsultantManagement
