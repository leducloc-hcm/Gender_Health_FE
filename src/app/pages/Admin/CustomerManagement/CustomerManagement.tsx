import { useEffect, useState } from 'react'
import type { UserResponse, UserResponseData } from './models/customerManagement.type'
import { userApi } from '@/app/apis/user.api'
import { toast } from 'react-toastify'
import DataTable from '@/app/pages/Admin/CustomerManagement/partials/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import dayjs from 'dayjs'

export default function CustomerManagement() {
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<UserResponseData[]>([])

  const fetchData = async () => {
    setIsLoadingTable(true)
    try {
      const response: UserResponse = await userApi.getAllUser()
      const customers = response.result.filter((user) => user.role === 'CUSTOMER')
      setDataSource(customers)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to fetch customer data')
    } finally {
      setIsLoadingTable(false)
    }
  }

  const handleBanAccount = async (id: number) => {
    try {
      await userApi.banAccount(id)
      toast.success('Account banned successfully')
      fetchData() // Refresh data
    } catch (error) {
      console.error('Failed to ban account:', error)
      toast.error('Failed to ban account')
    }
  }

  const handleUnbanAccount = async (id: number) => {
    try {
      await userApi.unBanAccount(id)
      toast.success('Account unbanned successfully')
      fetchData() // Refresh data
    } catch (error) {
      console.error('Failed to unban account:', error)
      toast.error('Failed to unban account')
    }
  }

  const columns: ColumnDef<UserResponseData>[] = [
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
      accessorKey: 'email',
      header: () => <p className='text-start'>Email</p>,
      cell: ({ row }) => <div className='truncate text-sm text-gray-700 text-start'>{row.original.email}</div>
    },
    {
      accessorKey: 'profile.name',
      header: () => <p className='text-start'>Customer Name</p>,
      accessorFn: (row) => row.profile?.name || '',
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 text-start'>{row.original.profile?.name || 'No name'}</div>
      ),
      filterFn: 'includesString'
    },
    {
      accessorKey: 'profile.dateOfBirth',
      header: () => <p className='text-start'>Date of Birth</p>,
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 text-start'>
          {row.original.profile?.dateOfBirth
            ? dayjs(row.original.profile.dateOfBirth).format('DD/MM/YYYY')
            : 'No Date of Birth'}
        </div>
      )
    },

    {
      accessorKey: 'created_at',
      header: () => <p className='text-start'>Created Date</p>,
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 text-start'>
          {dayjs(row.original.created_at).format('DD/MM/YYYY HH:mm')}
        </div>
      )
    },
    {
      id: 'actions',
      header: () => <p className='text-start'>Actions</p>,
      cell: ({ row }) => {
        const item = row.original
        const isActive = item.status === 'VERIFIED'
        return (
          <div className='flex items-center justify-start gap-2'>
            {isActive ? (
              <Button
                onClick={() => handleBanAccount(item.id)}
                className='bg-red-500 hover:bg-red-600 text-white'
                size='sm'
              >
                Ban
              </Button>
            ) : (
              <Button
                onClick={() => handleUnbanAccount(item.id)}
                className='bg-green-500 hover:bg-green-600 text-white'
                size='sm'
              >
                Unban
              </Button>
            )}
          </div>
        )
      }
    }
  ]

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Manage Customers</h1>
      <div className='table-container'>
        <DataTable columns={columns} data={dataSource} isLoading={isLoadingTable} />
      </div>
    </div>
  )
}
