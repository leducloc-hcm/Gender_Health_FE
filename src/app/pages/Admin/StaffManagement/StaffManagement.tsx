import { staffApi } from '@/app/apis/staff.api'
import { Button } from '@/app/components/ui/button'
import { PlusSquare } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import type { StaffManagementData, StaffManagementRequestCreate } from './models/staff.type'
import DataTable from '@/app/pages/Admin/StaffManagement/partials/DataTable'
import { getStaffColumns } from '@/app/pages/Admin/StaffManagement/partials/getStaffColumns'
import CreateStaffModal from '@/app/pages/Admin/StaffManagement/partials/CreateStaffModal'
import EditStaffModal from '@/app/pages/Admin/StaffManagement/partials/EditStaffModal'
import ViewStaffModal from '@/app/pages/Admin/StaffManagement/partials/ViewStaffModal'

export interface StaffData extends Omit<StaffManagementData, 'avatar' | 'coverPhoto'> {
  avatar: string | File | null
  coverPhoto: string | File | null
}

const StaffManagement = () => {
  const [staff, setStaff] = useState<StaffData[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<StaffData | null>(null)
  const [originalStaff, setOriginalStaff] = useState<StaffData | null>(null)
  const [newStaff, setNewStaff] = useState<Partial<StaffManagementRequestCreate>>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await staffApi.getAllStaff()
      setStaff(response.result)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch staff', { position: 'top-right', autoClose: 2000 })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleEdit = useCallback((staffMember: StaffData) => {
    setOriginalStaff({ ...staffMember })
    setSelectedStaff({ ...staffMember })
    setIsEditModalOpen(true)
  }, [])

  const handleView = useCallback((staffMember: StaffData) => {
    setSelectedStaff(staffMember)
    setIsViewModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (id: number) => {
      setIsDeleting(true)
      try {
        await staffApi.deleteStaffAccount(id)

        const deletedStaff = staff.find((s) => s.id === id)
        toast.success(`Staff ${deletedStaff?.name || 'Unknown'} deleted successfully`, {
          position: 'top-right',
          autoClose: 1000
        })

        fetchData()
      } catch (error) {
        console.error('Error deleting staff:', error)
        toast.error('Failed to delete staff', {
          position: 'top-right',
          autoClose: 2000
        })
      } finally {
        setIsDeleting(false)
      }
    },
    [staff, fetchData]
  )

  const getChangedFields = useCallback((original: StaffData, updated: StaffData) => {
    const changes: Record<string, string | number | File | null | undefined> = {}

    const fieldsToCheck: (keyof StaffData)[] = [
      'name',
      'username',
      'bio',
      'location',
      'phone_number',
      'description',
      'date_of_birth',
      'website'
    ]

    fieldsToCheck.forEach((field) => {
      if (original[field] !== updated[field]) {
        changes[field] = updated[field]
      }
    })

    // Check file fields
    if (original.avatar !== updated.avatar) {
      changes.avatar = updated.avatar
    }

    if (original.coverPhoto !== updated.coverPhoto) {
      changes.coverPhoto = updated.coverPhoto
    }

    return changes
  }, [])

  const createFormDataFromChanges = useCallback((changes: Partial<StaffData>): FormData => {
    const formData = new FormData()

    Object.entries(changes).forEach(([key, value]) => {
      if (key === 'avatar' || key === 'coverPhoto') {
        return
      }
      if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })

    // Handle file fields
    if (changes.avatar && changes.avatar instanceof File) {
      formData.append('avatar', changes.avatar)
    }

    if (changes.coverPhoto && changes.coverPhoto instanceof File) {
      formData.append('coverPhoto', changes.coverPhoto)
    }

    return formData
  }, [])

  const handleSave = useCallback(async () => {
    if (!selectedStaff || !originalStaff) return

    try {
      const changes = getChangedFields(originalStaff, selectedStaff)

      if (Object.keys(changes).length === 0) {
        toast.info('No changes detected', { position: 'top-right', autoClose: 1000 })
        setIsEditModalOpen(false)
        return
      }

      const formData = createFormDataFromChanges(changes)

      await staffApi.updateStaffProfile(selectedStaff.id, formData)

      fetchData()

      toast.success(`Staff ${selectedStaff.name ?? 'Unknown'} updated`, {
        position: 'top-right',
        autoClose: 1000
      })

      setIsEditModalOpen(false)
      setSelectedStaff(null)
      setOriginalStaff(null)
    } catch (error) {
      console.error('Error updating staff:', error)
      toast.error('Failed to update staff', {
        position: 'top-right',
        autoClose: 2000
      })
    }
  }, [selectedStaff, originalStaff, getChangedFields, createFormDataFromChanges, fetchData])

  const handleCreate = useCallback(async () => {
    try {
      // Validate required fields
      if (!newStaff.name || !newStaff.email || !newStaff.password || !newStaff.confirm_password) {
        toast.error('Please fill in all required fields', { position: 'top-right', autoClose: 2000 })
        return
      }

      if (newStaff.password !== newStaff.confirm_password) {
        toast.error('Passwords do not match', { position: 'top-right', autoClose: 2000 })
        return
      }

      await staffApi.createStaffAccount(newStaff as StaffManagementRequestCreate)

      toast.success(`Staff ${newStaff.name} created successfully`, {
        position: 'top-right',
        autoClose: 1000
      })

      setIsCreateModalOpen(false)
      setNewStaff({})
      fetchData()
    } catch (error) {
      console.error('Error creating staff:', error)
      toast.error('Failed to create staff', {
        position: 'top-right',
        autoClose: 2000
      })
    }
  }, [newStaff, fetchData])

  const handleCancel = useCallback(() => {
    setIsEditModalOpen(false)
    setSelectedStaff(null)
    setOriginalStaff(null)
  }, [])

  const handleCancelCreate = useCallback(() => {
    setIsCreateModalOpen(false)
    setNewStaff({})
  }, [])

  return (
    <div className='p-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold mb-4'>Staff Management</h1>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className='bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
          size='lg'
        >
          <PlusSquare className='h-6 w-6' />
          Create Staff
        </Button>
      </div>
      <div className='table-container'>
        <DataTable
          columns={getStaffColumns({
            onEdit: handleEdit,
            onView: handleView,
            onDelete: handleDelete,
            isDeleting
          })}
          data={staff}
          isLoading={isLoading}
        />

        <CreateStaffModal
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          newStaff={newStaff}
          setNewStaff={setNewStaff}
          onCreate={handleCreate}
          onCancel={handleCancelCreate}
        />

        <EditStaffModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          selectedStaff={selectedStaff}
          setSelectedStaff={setSelectedStaff}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        <ViewStaffModal isOpen={isViewModalOpen} onOpenChange={setIsViewModalOpen} selectedStaff={selectedStaff} />
      </div>
    </div>
  )
}

export default StaffManagement
