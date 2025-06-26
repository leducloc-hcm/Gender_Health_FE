import { consultantApi } from '@/app/apis/consultant.api'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import type { ProfileConsultantData, ProfileConsultantRequest } from './models/consultant.type'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/app/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Badge } from '@/app/components/ui/badge'
import { useOpenModal } from '@/app/hooks/useOpenModal'
import axios from 'axios'
import EditConsultantModal from '@/app/pages/Admin/ConsultantManagement/partials/EditConsultant'
import CreateConsultantModal from '@/app/pages/Admin/ConsultantManagement/partials/CreateConsultantModal'
import DataTable from '@/app/pages/Admin/ConsultantManagement/partials/DataTable'

export default function ConsultantManagement() {
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false)
  const [consultants, setConsultants] = useState<ProfileConsultantData[]>([])
  const [editItem, setEditItem] = useState<ProfileConsultantData>()
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const { isOpen: isOpenEditModal, openModal: openEditModal, closeModal: closeEditModal } = useOpenModal()
  const { isOpen: isOpenCreateModal, openModal: openCreateModal, closeModal: closeCreateModal } = useOpenModal()

  const columns: ColumnDef<ProfileConsultantData>[] = [
    {
      accessorKey: 'username',
      header: ({ column }) => (
        <p
          className='flex justify-start cursor-pointer'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Username
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </p>
      ),
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 max-w-xs flex text-start'>
          {row.original.username || 'No username'}
        </div>
      )
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <p
          className='flex justify-start cursor-pointer'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </p>
      ),
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 max-w-xs flex text-start'>{row.original.name || 'No name'}</div>
      )
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <p
          className='flex justify-start cursor-pointer'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </p>
      ),
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 max-w-xs flex text-start'>
          {row.original.email || 'No email'}
        </div>
      )
    },
    {
      accessorKey: 'phone_number',
      header: () => <p className='text-start'>Phone</p>,
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 max-w-xs flex text-start'>
          {row.original.phone_number || 'No phone'}
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <p
          className='flex justify-start cursor-pointer'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </p>
      ),
      cell: ({ row }) => (
        <Badge
          className={`${
            row.original.status === 'active'
              ? 'bg-green-100 text-green-800 border-green-300'
              : 'bg-red-100 text-red-800 border-red-300'
          }`}
        >
          {row.original.status}
        </Badge>
      )
    },
    {
      accessorKey: 'specialties',
      header: () => <p className='text-start'>Specialties</p>,
      cell: ({ row }) => (
        <div className='w-full max-w-full overflow-hidden'>
          <div className='flex flex-wrap gap-1 overflow-y-auto'>
            {row.original.specialties?.length > 0 ? (
              row.original.specialties.map((specialty, i) => (
                <Badge
                  key={i}
                  className='text-xs bg-blue-100 text-blue-800 border border-blue-300 rounded-full px-2 py-1 break-words max-w-full'
                >
                  {specialty}
                </Badge>
              ))
            ) : (
              <span className='text-sm text-gray-500'>No specialties</span>
            )}
          </div>
        </div>
      )
    },
    {
      accessorKey: 'rating',
      header: ({ column }) => (
        <p
          className='flex justify-start cursor-pointer'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Experience
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </p>
      ),
      cell: ({ row }) => (
        <div className='flex items-center text-start'>
          <span className='text-sm text-gray-700'>
            {row.original.experience ? `${row.original.experience}/5` : 'No rating'}
          </span>
          {row.original.experience && <span className='ml-1 text-yellow-500'>⭐</span>}
        </div>
      )
    },
    {
      id: 'actions',
      header: () => <p className='text-start'>Actions</p>,
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className='flex items-center justify-start gap-2 w-[150px]'>
            <Button
              onClick={() => {
                setEditItem(item)
                openEditModal()
              }}
              className='bg-blue-500 hover:bg-blue-600 text-white'
              size='sm'
            >
              Edit
            </Button>
            <Button
              onClick={() => handleDelete(item.id)}
              className='bg-red-500 hover:bg-red-600 text-white'
              size='sm'
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        )
      }
    }
  ]

  const handleCreate = async (formData: ProfileConsultantRequest) => {
    setIsCreating(true)
    try {
      await consultantApi.createConsultantAccount(formData)
      toast.success('Consultant created successfully!', {
        position: 'top-right',
        autoClose: 1500
      })
      handleCancelCreate()
      fetchData()
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Failed to create consultant. Please try again!'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsCreating(false)
    }
  }

  const handleEdit = async (formData: ProfileConsultantData) => {
    if (!editItem) return

    setIsUpdating(true)
    try {
      await consultantApi.updateConsultantProfile(editItem.id, formData)
      toast.success('Consultant updated successfully!', {
        position: 'top-right',
        autoClose: 1500
      })
      handleCancelEdit()
      fetchData()
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Failed to update consultant. Please try again!'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this consultant?')) return

    setIsDeleting(true)
    try {
      await consultantApi.deleteConsultantAccount(id)
      toast.success('Consultant deleted successfully!', {
        position: 'top-right',
        autoClose: 1500
      })
      fetchData()
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Failed to delete consultant. Please try again!'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelEdit = () => {
    closeEditModal()
    setEditItem(undefined)
  }

  const handleCancelCreate = () => {
    closeCreateModal()
  }

  const fetchData = async (): Promise<void> => {
    setIsLoadingTable(true)
    try {
      const response = await consultantApi.getAllProfileConsultants()
      setConsultants(response.result)
    } catch (error: any) {
      console.error('Failed to fetch consultants data:', error)
      toast.error(error.message || 'Failed to fetch consultants')
    } finally {
      setIsLoadingTable(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <div className='p-4'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold'>Manage Consultants</h1>
          <Button
            onClick={openCreateModal}
            className='bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white'
          >
            Add New Consultant
          </Button>
        </div>

        <div className='table-container'>
          <DataTable columns={columns} data={consultants} isLoading={isLoadingTable} />
          <EditConsultantModal
            key={'edit-consultant'}
            editItem={editItem}
            isModalOpen={isOpenEditModal}
            isUpdating={isUpdating}
            openModal={openEditModal}
            handleCancel={handleCancelEdit}
            handleEdit={handleEdit}
          />
          <CreateConsultantModal
            key={'create-consultant'}
            isModalOpen={isOpenCreateModal}
            isCreating={isCreating}
            openModal={openCreateModal}
            handleCancel={handleCancelCreate}
            handleCreate={handleCreate}
          />
        </div>
      </div>
    </>
  )
}
