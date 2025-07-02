import { specialtyApi } from '@/app/apis/specialty.api'
import { Button } from '@/app/components/ui/button'
import { useOpenModal } from '@/app/hooks/useOpenModal'
import type { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { ArrowUpDown, Edit, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import type { SpecialtyDataResponse } from './Models/SpecialtyManagement'
import DataTable from './partials/DataTable'
import EditSpecialtyModal from './partials/EditSpecialtyModal'
import ViewSpecialtyModal from './partials/ViewSpecialtyModal'
import CreateSpecialtyModal from './partials/CreateSpecialtyModal'
import DeleteDialog from '../Common/DeleteDialog'

export default function SpecialtyManagement() {
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<SpecialtyDataResponse[]>([])

  const [viewItem, setViewItem] = useState<SpecialtyDataResponse>()
  const { isOpen: isOpenViewModal, openModal: openViewModal, closeModal: closeViewModal } = useOpenModal()

  const [editItem, setEditItem] = useState<SpecialtyDataResponse>()
  const { isOpen: isOpenEditModal, openModal: openEditModal, closeModal: closeEditModal } = useOpenModal()

  const { isOpen: isOpenCreateModal, openModal: openCreateModal, closeModal: closeCreateModal } = useOpenModal()

  const handleDelete = async (id: number) => {
    setIsDeleting(true)
    try {
      await specialtyApi.deleteSpecialty(id)
      toast.success('Specialty deleted successfully')
      fetchData()
    } catch (error) {
      console.error('Failed to delete specialty:', error)
      let errorMessage = 'Failed to delete specialty'

      // Check if error has response data with message
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { data?: { message?: string } } }).response
        if (response?.data?.message) {
          errorMessage = response.data.message
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      console.log('errorMessage: ', errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: ColumnDef<SpecialtyDataResponse>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <p className='flex justify-start' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          ID
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </p>
      ),
      cell: ({ row }) => <div className='truncate text-sm text-gray-700 text-start'>#{row.original.id}</div>
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <p className='flex justify-start' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </p>
      ),
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 text-start font-medium'>{row.original.name}</div>
      ),
      filterFn: 'includesString'
    },
    {
      accessorKey: 'description',
      header: () => <p className='text-start'>Description</p>,
      cell: ({ row }) => (
        <div
          className='truncate text-sm text-gray-700 max-w-xs text-start'
          title={row.original.description || 'No description'}
        >
          {row.original.description || 'No description'}
        </div>
      )
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <p className='flex justify-start' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Created Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </p>
      ),
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 text-start'>
          {dayjs(row.original.createdAt).format('DD/MM/YYYY')}
        </div>
      )
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => (
        <p className='flex justify-start' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Updated Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </p>
      ),
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 text-start'>
          {dayjs(row.original.updatedAt).format('DD/MM/YYYY')}
        </div>
      )
    },
    {
      id: 'actions',
      header: () => <p className='text-start'>Actions</p>,
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className='flex items-center justify-start gap-2'>
            <Button
              onClick={() => {
                setViewItem(item)
                openViewModal()
              }}
              className='bg-blue-500 hover:bg-blue-600 text-white'
              size='sm'
            >
              <Eye size={16} className='mr-1' />
              View
            </Button>
            <Button
              onClick={() => {
                setEditItem(item)
                openEditModal()
              }}
              className='bg-green-500 hover:bg-green-600 text-white'
              size='sm'
            >
              <Edit size={16} className='mr-1' />
              Edit
            </Button>
            <DeleteDialog onConfirm={handleDelete} itemId={item.id} isLoading={isDeleting} />
          </div>
        )
      }
    }
  ]

  const handleEdit = (specialty: SpecialtyDataResponse) => {
    setEditItem(specialty)
    openEditModal()
  }

  const fetchData = async (): Promise<void> => {
    setIsLoadingTable(true)
    try {
      const specialtyRes = await specialtyApi.getAllSpecialties()
      setDataSource(specialtyRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to fetch specialties')
    } finally {
      setIsLoadingTable(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCancelView = () => {
    setViewItem(undefined)
    closeViewModal()
  }

  const handleCancelEdit = () => {
    setEditItem(undefined)
    closeEditModal()
  }

  const handleEditSuccess = () => {
    fetchData()
    closeEditModal()
    setEditItem(undefined)
  }

  const handleCreateSuccess = () => {
    fetchData()
    closeCreateModal()
  }

  return (
    <div className='px-6 py-8'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Specialty Management</h1>
        <Button
          onClick={openCreateModal}
          className='bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300'
          size='lg'
        >
          Create Specialty
        </Button>
      </div>

      <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
        <DataTable
          columns={columns}
          data={dataSource}
          isLoading={isLoadingTable}
          searchPlaceholder='Search by specialty name...'
          searchColumnKey='name'
        />
        <ViewSpecialtyModal
          key={'view-specialty-modal'}
          viewItem={viewItem}
          closeModal={handleCancelView}
          isModalOpen={isOpenViewModal}
          openModal={openViewModal}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
        <EditSpecialtyModal
          key={'edit-specialty-modal'}
          editItem={editItem}
          closeModal={handleCancelEdit}
          isModalOpen={isOpenEditModal}
          openModal={openEditModal}
          onSuccess={handleEditSuccess}
        />
        <CreateSpecialtyModal
          key={'create-specialty-modal'}
          closeModal={closeCreateModal}
          isModalOpen={isOpenCreateModal}
          openModal={openCreateModal}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </div>
  )
}
