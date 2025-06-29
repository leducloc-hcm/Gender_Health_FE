import { useEffect, useState } from 'react'
import type { CustomerData, CustomerResponse } from './models/customerManagement.type'
import { manageCustomerApi } from '@/app/apis/manageCustomer.api'
import { toast } from 'react-toastify'
import { useOpenModal } from '@/app/hooks/useOpenModal'
import DataTable from '@/app/pages/Admin/CustomerManagement/partials/DataTable'
import ViewCustomerModal from '@/app/pages/Admin/CustomerManagement/partials/ViewCustomerModal'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/app/components/ui/button'

export default function CustomerManagement() {
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<CustomerData[]>([])

  const [viewItem, setViewItem] = useState<CustomerData>()
  const { isOpen: isOpenViewModal, openModal: openViewModal, closeModal: closeViewModal } = useOpenModal()

  const columns: ColumnDef<CustomerData>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <p className='flex justify-start' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          ID
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </p>
      ),
      cell: ({ row }) => <div className='truncate text-sm text-gray-700 text-start'>{row.original.id}</div>
    },
    {
      id: 'customer_name',
      header: () => <p className='text-start'>Customer Name</p>,
      accessorFn: (row) => row.name,
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 text-start'>{row.original.name || 'No name'}</div>
      ),
      filterFn: 'includesString'
    },
    {
      accessorKey: 'order.phone',
      header: () => <p className='text-start'>Date of Birth</p>,
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 text-start'>
          {row.original.dateOfBirth || 'No Date of Birth'}
        </div>
      )
    },
    {
      accessorKey: 'description',
      header: () => <p className='text-start'>Description</p>,
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 text-start'>{row.original.description || 'No Description'}</div>
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
              View
            </Button>
          </div>
        )
      }
    }
  ]

  const fetchData = async (): Promise<void> => {
    setIsLoadingTable(true)
    try {
      const response: CustomerResponse = await manageCustomerApi.getAllProfileCustomer()
      setDataSource(response.data)
    } catch (error: any) {
      console.error('Failed to fetch data:', error)
      toast.error(error.message)
    } finally {
      setIsLoadingTable(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Manage Customers</h1>
      <div className='table-container'>
        <DataTable columns={columns} data={dataSource} isLoading={isLoadingTable} />
        <ViewCustomerModal
          viewItem={viewItem}
          closeModal={closeViewModal}
          isModalOpen={isOpenViewModal}
          openModal={openViewModal}
        />
      </div>
    </div>
  )
}
