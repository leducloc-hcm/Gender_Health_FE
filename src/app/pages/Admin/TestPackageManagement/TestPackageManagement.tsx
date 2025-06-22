import { testApi } from '@/app/apis/test.api'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import type {
  EditTestPackageItem,
  TestPackageItem,
  TestTypeItem
} from '../../HomePage/TestPackages/models/TestPackages'
import DataTable from './Partials/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/app/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Badge } from '@/app/components/ui/badge'
import { useOpenModal } from '@/app/hooks/useOpenModal'
import EditTestPackageModal from './Partials/EditTestPackageModal'
import axios from 'axios'

export default function TestPackageManagement() {
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false)
  const [testPackages, setTestPackages] = useState<TestPackageItem[]>([])
  const [testTypes, setTestTypes] = useState<TestTypeItem[]>([])
  const [editItem, setEditItem] = useState<TestPackageItem>()

  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const { isOpen: isOpenEditModal, openModal: openEditModal, closeModal: closeEditModal } = useOpenModal()

  const columns: ColumnDef<TestPackageItem>[] = [
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
      accessorKey: 'price',
      header: ({ column }) => (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Price(VND)
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 max-w-xs flex text-start'>
          {row.original.price.toLocaleString() || 'No price'}
        </div>
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
          <div className='flex items-center justify-center gap-2 w-[100px]'>
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
          </div>
        )
      }
    }
  ]

  const handleEdit = async (item: TestPackageItem) => {
    const payload: EditTestPackageItem = {
      name: item.name,
      code: item.code,
      description: item.description,
      priceList: item.price,
      tests: item.tests.map((item) => String(item.id))
    }
    console.log('Form submitted with payload:', payload)
    setIsUpdating(true)
    try {
      const response = await testApi.putUpdateTestPackage(item.id, payload)
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

  const handleCancelEdit = () => {
    closeEditModal()
    setEditItem(undefined)
  }

  const fetchNeededDataForEdit = async (): Promise<void> => {
    try {
      // Fetch Needed Data
      const typeOfTestRes = await testApi.getAllTypeOfTest()
      setTestTypes(typeOfTestRes.data)
    } catch (error: any) {
      console.error('Failed to fetch test data:', error)
      toast.error(error.message)
    }
  }

  const fetchData = async (): Promise<void> => {
    setIsLoadingTable(true)
    try {
      // fetch test packages
      const packagesRes = await testApi.getAllTestPackage()
      setTestPackages(packagesRes.data)
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

  useEffect(() => {
    if (editItem && isOpenEditModal) {
      fetchNeededDataForEdit()
    }
  }, [editItem, isOpenEditModal])

  return (
    <>
      <div className='p-4'>
        <h1 className='text-2xl font-bold mb-4'>Manage test packages</h1>
        <div className='table-container'>
          <DataTable columns={columns} data={testPackages} isLoading={isLoadingTable} />
          <EditTestPackageModal
            key={'edit-test-package'}
            editItem={editItem}
            isModalOpen={isOpenEditModal}
            isUpdating={isUpdating}
            openModal={openEditModal}
            handleCancel={handleCancelEdit}
            handleEdit={handleEdit}
            testTypes={testTypes}
          />
        </div>
      </div>
    </>
  )
}
