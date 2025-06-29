import { useEffect, useState, useCallback } from 'react'
import DataTable from './partials/DataTable'
import type { ConsultantManagementResponse } from './models/ConsultingManagement'
import { sConsultantProfile } from '@/app/hooks/sConsultantProfile'
import { consultingManagementApi } from '@/app/apis/consultingManagment.api'
import { useConsultingColumns } from './partials/columnsWithModal'

const ConsultingManagement = () => {
  const [consultingData, setConsultingData] = useState<ConsultantManagementResponse[]>([])
  const consultantProfile = sConsultantProfile.use()

  const fetchConsultingData = useCallback(async () => {
    try {
      const response = await consultingManagementApi.getConsultantManagement(consultantProfile.consultant_profile_id)
      setConsultingData(response.data.reverse())
    } catch (error) {
      console.error('Error fetching consulting data:', error)
    }
  }, [consultantProfile.consultant_profile_id])

  const { columns, Modal } = useConsultingColumns({
    onRefresh: fetchConsultingData
  })

  useEffect(() => {
    if (consultantProfile.consultant_profile_id) {
      fetchConsultingData()
    }
  }, [consultantProfile.consultant_profile_id, fetchConsultingData])

  return (
    <div>
      <div className='p-4'>
        <h1 className='text-2xl font-bold mb-4'>Consulting Management</h1>
        <div className='table-container'>
          <DataTable columns={columns} data={consultingData} />
        </div>
      </div>
      <Modal />
    </div>
  )
}

export default ConsultingManagement
