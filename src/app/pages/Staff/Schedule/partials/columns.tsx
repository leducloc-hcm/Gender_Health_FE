import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { sStaffProfile } from '@/app/hooks/sStaffProfile'
import { scheduleApi } from '@/app/apis/Schedule.api'
import { toast } from 'react-toastify'
import type { schedule } from './Schedule'

export const getScheduleColumns = (fetchConsultantSchedule: () => Promise<void>): ColumnDef<schedule>[] => {
  const staffId = sStaffProfile.use()

  const handleReject = async (id: number) => {
    if (!staffId?.id) {
      toast.error('Staff ID is missing', { position: 'top-right', autoClose: 1000 })
      return
    }
    try {
      const data = {
        scheduleId: id,
        staffProfileId: staffId.staff_profile_id,
        status: 'REJECT'
      }
      await scheduleApi.approveConsultantSchedule(data)
      toast.success('Reject Success!', { position: 'top-right', autoClose: 1000 })
      await fetchConsultantSchedule()
    } catch (error: any) {
      console.error('Error rejecting schedule:', error)
      toast.error(error?.response?.data?.message || 'Failed to reject schedule', {
        position: 'top-right',
        autoClose: 1000
      })
    }
  }

  const handleApprove = async (id: number) => {
    if (!staffId?.id) {
      toast.error('Staff ID is missing', { position: 'top-right', autoClose: 1000 })
      return
    }
    try {
      const data = {
        scheduleId: id,
        staffProfileId: staffId.staff_profile_id,
        status: 'APPROVED'
      }
      await scheduleApi.approveConsultantSchedule(data)
      toast.success('Approve Success!', { position: 'top-right', autoClose: 1000 })
      await fetchConsultantSchedule()
    } catch (error: any) {
      console.error('Error approving schedule:', error)
      toast.error(error?.response?.data?.message || 'Failed to approve schedule', {
        position: 'top-right',
        autoClose: 1000
      })
    }
  }

  return [
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Title
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => (
        <div className='truncate text-sm text-gray-700 max-w-xs flex text-start'>
          {row.original.title || 'No title'}
        </div>
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
      accessorKey: 'consultantProfileId',
      header: 'Consultant ID',
      cell: ({ row }) => row.original.consultantProfileId || 'Unknown'
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        try {
          return format(new Date(row.original.date), 'dd MMM yyyy')
        } catch {
          return 'Invalid Date'
        }
      }
    },
    {
      accessorKey: 'startTime',
      header: 'Start Time',
      cell: ({ row }) => row.original.startTime || 'N/A'
    },
    {
      accessorKey: 'endTime',
      header: 'End Time',
      cell: ({ row }) => row.original.endTime || 'N/A'
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          className={`text-xs ${
            row.original.status === 'APPROVED'
              ? 'bg-green-500'
              : row.original.status === 'REJECT'
                ? 'bg-red-500'
                : row.original.status === 'PENDING'
                  ? 'bg-yellow-500'
                  : 'bg-gray-500'
          } text-white`}
        >
          {row.original.status || 'Unknown'}
        </Badge>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => {
        try {
          return format(new Date(row.original.createdAt), 'dd MMM yyyy HH:mm')
        } catch {
          return 'Invalid Date'
        }
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const id = row.original.id
        return (
          <div className='flex gap-2'>
            {id && row.original.status === 'PENDING' ? (
              <>
                <Button
                  onClick={() => handleApprove(id)}
                  className='bg-green-500 hover:bg-green-600 text-white'
                  size='sm'
                >
                  Approve
                </Button>
                <Button onClick={() => handleReject(id)} className='bg-red-500 hover:bg-red-600 text-white' size='sm'>
                  Reject
                </Button>
              </>
            ) : null}
          </div>
        )
      }
    }
  ]
}
