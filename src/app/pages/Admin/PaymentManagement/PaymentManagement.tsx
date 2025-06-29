import { useEffect, useState } from 'react'
import type { PaymentDetail } from '../../HomePage/TestPackages/models/PaymentTest'
import { paymentApi } from '@/app/apis/payment.api'
import { toast } from 'react-toastify'
import { ArrowUpDown } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/app/components/ui/button'
import dayjs from 'dayjs'
import { Badge } from '@/app/components/ui/badge'
import DataTable from './Partials/DataTable'
import { useOpenModal } from '@/app/hooks/useOpenModal'
import ViewPaymentModal from './Partials/ViewPaymentModal'

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PENDING':
      return <Badge className='bg-yellow-100 text-yellow-800'>Pending</Badge>
    case 'PAID':
      return <Badge className='bg-green-100 text-green-800'>Paid</Badge>
    case 'FAILED':
      return <Badge className='bg-red-100 text-red-800'>Failed</Badge>
    case 'REFUNDED':
      return <Badge className='bg-blue-100 text-blue-800'>Refunded</Badge>
    default:
      return <Badge className='bg-gray-100 text-gray-800'>Unknown</Badge>
  }
}

export default function PaymentManagement() {
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<PaymentDetail[]>([])

  const [viewItem, setViewItem] = useState<PaymentDetail>()
  const { isOpen: isOpenViewModal, openModal: openViewModal, closeModal: closeViewModal } = useOpenModal()

  const columns: ColumnDef<PaymentDetail>[] = [
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
      accessorFn: (row) => row.order?.customerProfile?.name,
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 text-start'>
          {row.original.order?.customerProfile?.name || 'No name'}
        </div>
      ),
      filterFn: 'includesString'
    },
    {
      accessorKey: 'order.phone',
      header: () => <p className='text-start'>Phone</p>,
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 text-start'>{row.original.order?.phone || 'No phone'}</div>
      )
    },
    {
      accessorKey: 'order.address',
      header: () => <p className='text-start'>Address</p>,
      cell: ({ row }) => (
        <div
          className='truncate text-sm text-gray-700 max-w-xs text-start'
          title={row.original.order.address || 'No address'}
        >
          {row.original.order.address || 'No address'}
        </div>
      )
    },
    {
      accessorKey: 'amount',
      header: () => <p className='text-start'>Total Amount</p>,
      cell: ({ row }) => {
        const amount = Number(row.original.amount)
        const formatted = isNaN(amount) ? '0' : amount.toLocaleString('vi-VN')
        return <div className='truncate text-sm text-gray-700 text-start'>{formatted}₫</div>
      }
    },
    {
      accessorKey: 'invoice_code',
      header: () => <p className='text-start'>Invoice Code</p>,
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 text-start'>{row.original.invoice_code || 'No code'}</div>
      )
    },
    {
      accessorKey: 'created_date',
      header: () => <p className='text-start'>Created Date</p>,
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 text-start'>
          {dayjs(row.original.created_date).format('DD/MM/YYYY')}
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: () => <p className='text-start'>Status</p>,
      cell: ({ row }) => <div className='text-start'>{getStatusBadge(row.original.status)}</div>
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
      const paymentRes = await paymentApi.getAllPayments()
      setDataSource(paymentRes.data)
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
      <h1 className='text-2xl font-bold mb-4'>Manage payments</h1>
      <div className='table-container'>
        <DataTable columns={columns} data={dataSource} isLoading={isLoadingTable} />
        <ViewPaymentModal
          key={'view-payment-modal'}
          viewItem={viewItem}
          closeModal={handleCancelView}
          isModalOpen={isOpenViewModal}
          openModal={openViewModal}
        />
      </div>
    </div>
  )
}
