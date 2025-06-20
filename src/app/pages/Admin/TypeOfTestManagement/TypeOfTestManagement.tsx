import { useEffect, useState } from 'react'
import type { AddUpdateTestTypeItem, TestTypeItem } from '../../HomePage/TestPackages/models/TestPackages'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/app/components/ui/button'
import { ArrowUpDown, PlusSquare } from 'lucide-react'
import { Badge } from '@/app/components/ui/badge'
import DataTable from './Partials/DataTable'
import { testApi } from '@/app/apis/test.api'
import { toast } from 'react-toastify'
import { useOpenModal } from '@/app/hooks/useOpenModal'
import AddTypeOfTestModal from './Partials/AddTypeOfTestModal'
import axios from 'axios'
import DeleteDialog from '../Common/DeleteDialog'
import EditTypeOfTestModal from './Partials/EditTypeOfTestModal'

export default function TypeOfTestManagement() {
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<TestTypeItem[]>([])
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const [isAdding, setIsAdding] = useState<boolean>(false)
  const { isOpen: isOpenAddModal, openModal: openAddModal, closeModal: closeAddModal } = useOpenModal()

  const [editItem, setEditItem] = useState<TestTypeItem>()
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const { isOpen: isOpenEditModal, openModal: openEditModal, closeModal: closeEditModal } = useOpenModal()

  const handleCancelEdit = () => {
    closeEditModal()
    setEditItem(undefined)
  }

  const columns: ColumnDef<TestTypeItem>[] = [
    {
      accessorKey: 'code',
      header: ({ column }) => (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Code
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 max-w-xs flex text-start'>{row.original.code || 'No code'}</div>
      )
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 max-w-xs flex text-start'>{row.original.name || 'No name'}</div>
      )
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 max-w-xs flex text-start'>
          {row.original.description || 'No description'}
        </div>
      )
    },
    {
      accessorKey: 'tests',
      header: 'Tests',
      cell: ({ row }) => (
        <div className='w-full max-w-full overflow-hidden'>
          <div className='flex flex-wrap gap-1 overflow-y-auto'>
            {row.original.tests?.length > 0 ? (
              row.original.tests.map((test, i) => (
                <Badge
                  key={i}
                  className='text-xs bg-gray-100 text-gray-800 border border-gray-300 rounded-full px-2 py-1 break-words max-w-full'
                >
                  {test.name}
                </Badge>
              ))
            ) : (
              <span className='text-sm text-gray-500'>No tests</span>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className='flex items-center justify-center gap-2'>
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
            <DeleteDialog key={'Delete-Dialog'} onConfirm={handleDelete} itemId={item.id} isLoading={isDeleting} />
          </div>
        )
      }
    }
  ]

  const handleCreate = async (item: AddUpdateTestTypeItem) => {
    console.log('Form submitted with payload:', item)
    setIsAdding(true)
    try {
      const response = await testApi.postCreateTypeOfTest(item)
      console.log('🚀 ~ handleCreate ~ response:', response)

      toast.success('Create successfully!', {
        position: 'top-right',
        autoClose: 1500
      })
      closeAddModal()
      fetchData()
    } catch (error: any) {
      console.log('🚀 ~ handleCreate ~ error:', error)
      if (axios.isAxiosError(error)) {
        const errorMessage = error.message || 'Failed. Please try again!'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsAdding(false)
    }
  }

  const handleEdit = async (item: TestTypeItem) => {
    const payload: AddUpdateTestTypeItem = {
      name: item.name,
      code: item.code,
      description: item.description
    }
    console.log('Form submitted with payload:', payload)
    setIsUpdating(true)
    try {
      const response = await testApi.putUpdateTypeOfTest(item.id, payload)
      console.log('🚀 ~ handleEdit ~ response:', response)

      toast.success('Update successfully!', {
        position: 'top-right',
        autoClose: 1500
      })
      handleCancelEdit()
      fetchData()
    } catch (error: any) {
      console.log('🚀 ~ handleEdit ~ error:', error)
      if (axios.isAxiosError(error)) {
        const errorMessage = error.message || 'Failed. Please try again!'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async (id: number) => {
    console.log('Delete with id:', id)
    setIsDeleting(true)
    try {
      const response = await testApi.deleteTypeOfTest(id)
      console.log('🚀 ~ handleDelete ~ response:', response)

      toast.success('Delete successfully!', {
        position: 'top-right',
        autoClose: 1500
      })
      fetchData()
    } catch (error: any) {
      console.log('🚀 ~ handleDelete ~ error:', error)
      if (axios.isAxiosError(error)) {
        const errorMessage = error.message || 'Failed. Please try again!'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const fetchData = async (): Promise<void> => {
    setIsLoadingTable(true)
    try {
      // fetch data
      const typeRes = await testApi.getAllTypeOfTest()
      setDataSource(typeRes.data)
    } catch (error: any) {
      console.error('Failed to fetch test data:', error)
      toast.error(error.message)
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
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold mb-4'>Manage type of test</h1>
          <Button
            onClick={() => {
              openAddModal()
            }}
            className='bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
            size='lg'
          >
            <PlusSquare className='h-6 w-6' />
            Add new
          </Button>
        </div>
        <div className='table-container'>
          <DataTable columns={columns} data={dataSource} isLoading={isLoadingTable} />
          <AddTypeOfTestModal
            key={'add-type-of-test-modal'}
            isModalOpen={isOpenAddModal}
            openModal={openAddModal}
            closeModal={closeAddModal}
            isPending={isAdding}
            handleCreate={handleCreate}
          />
          <EditTypeOfTestModal
            key={'edit-type-of-test-modal'}
            editItem={editItem}
            closeModal={handleCancelEdit}
            isModalOpen={isOpenEditModal}
            openModal={openEditModal}
            isPending={isUpdating}
            handleEdit={handleEdit}
          />
        </div>
      </div>
    </>
  )
}
