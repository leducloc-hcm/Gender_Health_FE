import { useEffect, useState } from 'react'
import type {
  AddUpdateTestCategory,
  TestCategory,
  TestPackageItem,
  TestTypeItem
} from '../../HomePage/TestPackages/models/TestPackages'
import { Button } from '@/app/components/ui/button'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, PlusSquare } from 'lucide-react'
import { testApi } from '@/app/apis/test.api'
import { toast } from 'react-toastify'
import DataTable from './Partials/DataTable'
import DeleteDialog from '../Common/DeleteDialog'
import { useOpenModal } from '@/app/hooks/useOpenModal'
import AddTestModal from './Partials/AddTestModal'
import axios from 'axios'
import EditTestModal from './Partials/EditTestModal'

export default function TestManagement() {
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<TestCategory[]>([])
  const [testPackages, setTestPackages] = useState<TestPackageItem[]>([])
  const [testTypes, setTestTypes] = useState<TestTypeItem[]>([])
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const [isAdding, setIsAdding] = useState<boolean>(false)
  const { isOpen: isOpenAddModal, openModal: openAddModal, closeModal: closeAddModal } = useOpenModal()

  const [editItem, setEditItem] = useState<TestCategory>()
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const { isOpen: isOpenEditModal, openModal: openEditModal, closeModal: closeEditModal } = useOpenModal()

  const handleCancelEdit = () => {
    closeEditModal()
    setEditItem(undefined)
  }

  const columns: ColumnDef<TestCategory>[] = [
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
        <div
          title={row.original.description || 'No description'}
          className='truncate text-sm text-gray-700 max-w-xs flex text-start'
        >
          {row.original.description || 'No description'}
        </div>
      )
    },
    {
      accessorKey: 'type_of_test',
      header: 'Type of test',
      cell: ({ row }) => (
        <div className='text-sm text-gray-700 max-w-xs flex text-start'>
          {row.original.type_of_test?.name || 'No type of test'}
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

  const handleCreate = async (item: AddUpdateTestCategory) => {
    console.log('Form submitted with payload:', item)
    setIsAdding(true)
    try {
      const response = await testApi.postCreateTestCategory(item)
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

  const handleEdit = async (item: TestCategory) => {
    const payload: AddUpdateTestCategory = {
      name: item.name,
      code: item.code,
      description: item.description,
      type_of_test_id: item.type_of_test_id,
      testPackages: item.testPackages
    }
    console.log('Form submitted with payload:', payload)
    setIsUpdating(true)
    try {
      const response = await testApi.putUpdateTestCategory(item.id, payload)
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
      const response = await testApi.deleteTestCategory(id)
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
      const testRes = await testApi.getAllTestCategory()
      setDataSource(testRes.data)
    } catch (error: any) {
      console.error('Failed to fetch test data:', error)
      toast.error(error.message)
    } finally {
      setIsLoadingTable(false)
    }
  }

  // fetch testType and testPackages
  const fetchNeededData = async (): Promise<void> => {
    try {
      // Fetch Needed Data
      const [typeOfTestRes, testPackageRes] = await Promise.all([
        testApi.getAllTypeOfTest(),
        testApi.getAllTestPackage()
      ])
      setTestTypes(typeOfTestRes.data)
      setTestPackages(testPackageRes.data)
    } catch (error: any) {
      console.error('Failed to fetch test data:', error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (isOpenAddModal || (editItem && isOpenEditModal)) {
      fetchNeededData()
    }
  }, [isOpenAddModal, editItem, isOpenEditModal])
  return (
    <>
      <div className='p-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold mb-4'>Manage tests</h1>
          <Button
            onClick={() => {
              openAddModal()
            }}
            className='bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
            size='lg'
          >
            <PlusSquare className='h-6 w-6' />
            Create new
          </Button>
        </div>
        <div className='table-container'>
          <DataTable columns={columns} data={dataSource} isLoading={isLoadingTable} />
          <AddTestModal
            key={'add-test-modal'}
            isModalOpen={isOpenAddModal}
            openModal={openAddModal}
            closeModal={closeAddModal}
            isPending={isAdding}
            handleCreate={handleCreate}
            testTypes={testTypes}
            testPackages={testPackages}
          />
          <EditTestModal
            key={'edit-test-modal'}
            editItem={editItem}
            closeModal={handleCancelEdit}
            isModalOpen={isOpenEditModal}
            openModal={openEditModal}
            isPending={isUpdating}
            handleEdit={handleEdit}
            testTypes={testTypes}
            testPackages={testPackages}
          />
        </div>
      </div>
    </>
  )
}
