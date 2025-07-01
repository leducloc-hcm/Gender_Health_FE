import { specialtyApi } from '@/app/apis/specialty.api'
import { Button } from '@/app/components/ui/button'
import { useOpenModal } from '@/app/hooks/useOpenModal'
import type { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { ArrowUpDown, Edit, Eye, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import type { SpecialtyDataResponse } from './Models/SpecialtyManagement'
import DataTable from './partials/DataTable'
import EditSpecialtyModal from './partials/EditSpecialtyModal'
import ViewSpecialtyModal from './partials/ViewSpecialtyModal'
import CreateSpecialtyModal from './partials/CreateSpecialtyModal'

export default function SpecialtyManagement() {
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<SpecialtyDataResponse[]>([])

  const [viewItem, setViewItem] = useState<SpecialtyDataResponse>()
  const { isOpen: isOpenViewModal, openModal: openViewModal, closeModal: closeViewModal } = useOpenModal()

  const [editItem, setEditItem] = useState<SpecialtyDataResponse>()
  const { isOpen: isOpenEditModal, openModal: openEditModal, closeModal: closeEditModal } = useOpenModal()

  const { isOpen: isOpenCreateModal, openModal: openCreateModal, closeModal: closeCreateModal } = useOpenModal()

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
            <Button onClick={() => handleDelete(item)} className='bg-red-500 hover:bg-red-600 text-white' size='sm'>
              <Trash2 size={16} className='mr-1' />
              Delete
            </Button>
          </div>
        )
      }
    }
  ]

  const handleCancelView = () => {
    closeViewModal()
    setViewItem(undefined)
  }

  const handleCancelEdit = () => {
    closeEditModal()
    setEditItem(undefined)
  }

  const handleEditSuccess = () => {
    fetchData() // Refresh the data after successful edit
  }

  const handleCreateSuccess = () => {
    fetchData() // Refresh the data after successful creation
  }

  const handleEdit = (specialty: SpecialtyDataResponse) => {
    setEditItem(specialty)
    openEditModal()
  }

  const handleDelete = async (specialty: SpecialtyDataResponse) => {
    try {
      await specialtyApi.deleteSpecialty(specialty.id)
      toast.success('Specialty deleted successfully')
      fetchData() // Refresh the data
    } catch (error) {
      console.error('Failed to delete specialty:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete specialty'
      toast.error(errorMessage)
    }
  }

  const fetchData = async (): Promise<void> => {
    setIsLoadingTable(true)
    try {
      const specialtyRes = await specialtyApi.getAllSpecialties()
      setDataSource(specialtyRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch specialties'
      toast.error(errorMessage)
    } finally {
      setIsLoadingTable(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Manage Specialties</h1>
      <div className='table-container'>
        <DataTable
          columns={columns}
          data={dataSource}
          isLoading={isLoadingTable}
          onCreateClick={openCreateModal}
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
