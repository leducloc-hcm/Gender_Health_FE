import { useEffect, useState } from 'react'
import { scheduleApi } from '@/app/apis/Schedule.api'
import { getScheduleColumns } from './partials/columns'
import DataTable from '../BlogStaff/DataTable'
import type { schedule } from './partials/Schedule'

const Schedule = () => {
  const [schedules, setSchedules] = useState<schedule[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchConsultantSchedule = async () => {
    setIsLoading(true)
    try {
      const response = await scheduleApi.getAllConsultantApproveSchedule()
      console.log('response: ', response)
      const normalizedData = Array.isArray(response?.data)
        ? response.data.map((item: any) => ({
            id: item.id,
            consultantProfileId: item.consultantProfileId,
            title: item.title,
            description: item.description,
            date: item.date,
            startTime: item.startTime,
            endTime: item.endTime,
            status: item.status,
            createdAt: item.createdAt,
            acceptedAt: item.acceptedAt ?? null,
            acceptedBy: item.acceptedBy ?? null,
            bookedBy: item.bookedBy ?? null,
            bookedAt: item.bookedAt ?? null
          }))
        : []
      setSchedules(normalizedData)
    } catch (error) {
      console.error('Error fetching schedules:', error)
      setSchedules([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchConsultantSchedule()
  }, [])

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Schedule Approve Management</h1>
      <DataTable columns={getScheduleColumns(fetchConsultantSchedule)} data={schedules} />
    </div>
  )
}

export default Schedule
