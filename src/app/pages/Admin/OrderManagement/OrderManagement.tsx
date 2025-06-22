import { useEffect, useState } from 'react'
import type { OrderData } from '../../HomePage/TestPackages/models/OrderTest'
import { orderApi } from '@/app/apis/order.api'
import { toast } from 'react-toastify'
import DataTable from './Partials/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/app/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Badge } from '@/app/components/ui/badge'
import dayjs from 'dayjs'
import { useOpenModal } from '@/app/hooks/useOpenModal'
import ViewOrderModal from './Partials/ViewOrderModal'

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PENDING':
      return <Badge className='bg-yellow-100 text-yellow-800'>Pending</Badge>
    case 'CONFIRMED':
      return <Badge className='bg-blue-100 text-blue-800'>Confirmed</Badge>
    case 'PROCESSING':
      return <Badge className='bg-purple-100 text-purple-800'>Processing</Badge>
    case 'COMPLETED':
      return <Badge className='bg-green-100 text-green-800'>Completed</Badge>
    case 'CANCELLED':
      return <Badge className='bg-red-100 text-red-800'>Cancelled</Badge>
    default:
      return <Badge className='bg-gray-100 text-gray-800'>Unknown</Badge>
  }
}

export default function OrderManagement() {
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<OrderData[]>([])

  const [viewItem, setViewItem] = useState<OrderData>()
  const { isOpen: isOpenViewModal, openModal: openViewModal, closeModal: closeViewModal } = useOpenModal()

  const columns: ColumnDef<OrderData>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <p className='flex justify-start' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          ID
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </p>
      ),
      cell: ({ row }) => <div className='truncate text-sm text-gray-700 max-w-xs text-start'>{row.original.id}</div>
    },
    {
      accessorKey: 'customerProfile.name',
      header: () => <p className='text-start'>Customer Name</p>,
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 max-w-xs text-start'>
          {row.original.customerProfile?.name || 'No name'}
        </div>
      )
    },
    {
      accessorKey: 'phone',
      header: () => <p className='text-start'>Phone</p>,
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 max-w-xs text-start'>{row.original.phone || 'No phone'}</div>
      )
    },
    {
      accessorKey: 'address',
      header: () => <p className='text-start'>Address</p>,
      cell: ({ row }) => (
        <div
          className='truncate text-sm text-gray-700 max-w-xs text-start'
          title={row.original.address || 'No address'}
        >
          {row.original.address || 'No address'}
        </div>
      )
    },
    {
      accessorKey: 'total_amount',
      header: () => <p className='text-start'>Total Amount</p>,
      cell: ({ row }) => {
        const amount = Number(row.original.total_amount)
        const formatted = isNaN(amount) ? '0' : amount.toLocaleString('vi-VN')
        return <div className='truncate text-sm text-gray-700 max-w-xs text-start'>{formatted}₫</div>
      }
    },
    {
      accessorKey: 'note',
      header: () => <p className='text-start'>Note</p>,
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 max-w-xs text-start' title={row.original.note || 'No note'}>
          {row.original.note || 'No note'}
        </div>
      )
    },
    {
      accessorKey: 'created_at',
      header: () => <p className='text-start'>Created At</p>,
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 max-w-xs text-start'>
          {dayjs(row.original.created_at).format('DD/MM/YYYY')}
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: () => <p className='text-start'>Status</p>,
      cell: ({ row }) => {
        const status = row.original.status
        return <div className='text-sm text-start'>{getStatusBadge(status)}</div>
      }
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

  const handleCancelView = () => {
    closeViewModal()
    setViewItem(undefined)
  }

  const fetchData = async (): Promise<void> => {
    setIsLoadingTable(true)
    try {
      // fetch data
      const orderRes = await orderApi.getAllOrders()
      setDataSource(orderRes.data)
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
      <h1 className='text-2xl font-bold mb-4'>Manage orders</h1>
      <div className='table-container'>
        <DataTable columns={columns} data={dataSource} isLoading={isLoadingTable} />
        <ViewOrderModal
          key={'view-order-modal'}
          viewItem={viewItem}
          closeModal={handleCancelView}
          isModalOpen={isOpenViewModal}
          openModal={openViewModal}
        />
      </div>
    </div>
  )
}
