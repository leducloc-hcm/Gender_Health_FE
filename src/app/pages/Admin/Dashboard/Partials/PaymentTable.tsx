import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import type { PaymentDetail } from '@/app/pages/HomePage/TestPackages/models/PaymentTest'
import { useEffect, useState } from 'react'
import DataTable from './DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import dayjs from 'dayjs'
import { getStatusBadge } from '../../PaymentManagement/PaymentManagement'

type DataProps = {
  dataPayment: PaymentDetail[]
  isLoading: boolean
}
export default function PaymentTable({ dataPayment, isLoading }: DataProps) {
  const [paymentSoure, setPaymentSoure] = useState<PaymentDetail[]>([])

  const paymentColumns: ColumnDef<PaymentDetail>[] = [
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
      accessorKey: 'created_date',
      header: () => <p className='text-start'>Created Date</p>,
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 text-start'>
          {dayjs(row.original.created_date).format('DD/MM/YYYY')}
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
      accessorKey: 'status',
      header: () => <p className='text-start'>Status</p>,
      cell: ({ row }) => <div className='text-start'>{getStatusBadge(row.original.status)}</div>
    }
  ]

  useEffect(() => {
    if (Array.isArray(dataPayment)) {
      const sortedPayments = dataPayment.slice(0, 5)
      setPaymentSoure(sortedPayments)
    }
  }, [dataPayment])

  return (
    <Card className='w-full h-full overflow-hidden bg-white transition-transform duration-200 hover:scale-105 hover:shadow-md'>
      <CardHeader>
        <CardTitle className='text-xl font-medium'>Recent Payments</CardTitle>
        <CardDescription className='text-lg text-gray-500 font-normal italic mb-4'>
          Showing the 5 most recent payments from customers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='table-container'>
          <DataTable key={'payment-table'} columns={paymentColumns} data={paymentSoure} isLoading={isLoading} />
        </div>
      </CardContent>
    </Card>
  )
}
