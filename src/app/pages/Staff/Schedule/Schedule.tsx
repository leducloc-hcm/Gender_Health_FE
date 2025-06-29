import { useEffect, useState } from 'react'
import { scheduleApi } from '@/app/apis/Schedule.api'
import { getScheduleColumns } from './partials/columns'
import type { schedule } from './partials/Schedule'
import { toast } from 'react-toastify'
import { useSocket } from '@/app/hooks/useSocket'
import DataTable from './partials/DataTable'
import { Activity } from 'lucide-react'

export interface WorkScheduleUpdate {
  workScheduleId: number
  status: string
}

const Schedule = () => {
  const { socket, reinitializeSocket } = useSocket()
  const [schedules, setSchedules] = useState<schedule[]>([])

  const fetchConsultantSchedule = async () => {
    try {
      const response = await scheduleApi.getAllConsultantApproveSchedule()
      const mappedSchedules = response.data.map((item) => ({
        ...item,
        acceptedBy: item.acceptedBy?.toString() || null
      }))
      setSchedules(mappedSchedules as schedule[])
    } catch (error: unknown) {
      console.error('Error fetching schedules:', error)
      setSchedules([])
    }
  }
  useEffect(() => {
    fetchConsultantSchedule()
    reinitializeSocket()
  }, [])
  useEffect(() => {
    if (!socket) return

    const handleNewWorkSchedule = () => {
      // Refresh the schedule list when a new schedule is created
      fetchConsultantSchedule()
      toast.info('New schedule request received')
    }

    socket.on('new_work_schedule_created', handleNewWorkSchedule)

    return () => {
      socket.off('new_work_schedule_created', handleNewWorkSchedule)
    }
  }, [socket])

  return (
    <div className='space-y-6'>
      <div className='bg-white p-6 rounded-lg  border'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <Activity className='h-6 w-6 text-blue-600' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Schedule Management</h1>
              <p className='text-gray-600 mt-1'>Monitor and manage schedule for all customers</p>
            </div>
          </div>
        </div>
      </div>
      <DataTable columns={getScheduleColumns(fetchConsultantSchedule)} data={schedules} />
    </div>
  )
}

export default Schedule
