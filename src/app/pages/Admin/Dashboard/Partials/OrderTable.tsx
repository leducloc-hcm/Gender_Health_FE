import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import type { OrderData } from '@/app/pages/HomePage/TestPackages/models/OrderTest'
import type { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { ArrowUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import DataTable from './DataTable'
import { getStatusBadge } from '../../OrderManagement/OrderManagement'

type DataProps = {
  dataOrder: OrderData[]
  isLoading: boolean
}

export default function OrderTable({ dataOrder, isLoading }: DataProps) {
  const [orderSoure, setOrderSoure] = useState<OrderData[]>([])

  const orderColumns: ColumnDef<OrderData>[] = [
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
      accessorFn: (row) => row.customerProfile?.name,
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 max-w-xs text-start'>
          {row.original.customerProfile?.name || 'No name'}
        </div>
      ),
      filterFn: 'includesString'
    },
    {
      accessorKey: 'created_at',
      header: () => <p className='text-start'>Created Date</p>,
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 max-w-xs text-start'>
          {dayjs(row.original.created_at).format('DD/MM/YYYY')}
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
      accessorKey: 'status',
      header: () => <p className='text-start'>Status</p>,
      cell: ({ row }) => {
        const status = row.original.status
        return <div className='text-sm text-start'>{getStatusBadge(status)}</div>
      }
    }
  ]

  useEffect(() => {
    if (Array.isArray(dataOrder)) {
      const sortedOrders = dataOrder.slice(0, 5)
      setOrderSoure(sortedOrders)
    }
  }, [dataOrder])
  return (
    <>
      <Card className='w-full h-full overflow-hidden bg-white transition-transform duration-200 hover:scale-105 hover:shadow-md'>
        <CardHeader>
          <CardTitle className='text-xl font-medium'>Recent Orders</CardTitle>
          <CardDescription className='text-lg text-gray-500 font-normal italic mb-4'>
            Showing the 5 most recent orders from customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='table-container'>
            <DataTable key={'order-table'} columns={orderColumns} data={orderSoure} isLoading={isLoading} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}
