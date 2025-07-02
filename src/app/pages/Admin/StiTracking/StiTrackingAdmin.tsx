import { useState, useEffect } from 'react'
import { stiApi } from '@/app/apis/sti.api'
import { toast } from 'react-toastify'
import { RefreshCw, Activity } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import Swal from 'sweetalert2'
import type { Data, StiTrackingResponse } from '@/app/pages/Admin/StiTracking/models/sti.type'
import StiDataTable from '@/app/pages/Admin/StiTracking/partials/StiDataTable'
import { getStiColumns } from '@/app/pages/Admin/StiTracking/partials/getStiColumns'

export default function StiTrackingAdmin() {
  const [stiData, setStiData] = useState<Data[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    fetchStiData()
  }, [])

  const fetchStiData = async () => {
    try {
      setLoading(true)
      const response: StiTrackingResponse = await stiApi.getAllStis()
      setStiData(response.data)
    } catch (error) {
      console.error('Error fetching STI data:', error)
      toast.error('Failed to fetch STI tracking data')
    } finally {
      setLoading(false)
    }
  }

  const handlePscVisited = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to mark PSC as visited?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Mark PSC',
      cancelButtonText: 'Cancel'
    })

    if (!result.isConfirmed) return

    const actionKey = `psc-${id}`
    try {
      setActionLoading((prev) => ({ ...prev, [actionKey]: true }))

      const data = {
        id: id,
        pscVisited: new Date().toISOString()
      }

      await stiApi.createPscVisited(id, data)
      await fetchStiData()
      toast.success('PSC visited status updated successfully!')
    } catch (error) {
      console.error('Error updating PSC visited:', error)
      toast.error('Failed to update PSC visited status')
    } finally {
      setActionLoading((prev) => ({ ...prev, [actionKey]: false }))
    }
  }

  const handleSampleCollected = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to mark sample as collected?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Mark sample',
      cancelButtonText: 'Cancel'
    })

    if (!result.isConfirmed) return
    const actionKey = `sample-${id}`
    try {
      setActionLoading((prev) => ({ ...prev, [actionKey]: true }))

      const data = {
        id: id,
        collectedDate: new Date().toISOString()
      }

      await stiApi.createSampleCollected(id, data)
      await fetchStiData()
      toast.success('Sample collected status updated successfully!')
    } catch (error) {
      console.error('Error updating sample collected:', error)
      toast.error('Failed to update sample collected status')
    } finally {
      setActionLoading((prev) => ({ ...prev, [actionKey]: false }))
    }
  }

  const handleReportDate = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to set the report date?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Set report',
      cancelButtonText: 'Cancel'
    })

    if (!result.isConfirmed) return
    const actionKey = `report-${id}`
    try {
      setActionLoading((prev) => ({ ...prev, [actionKey]: true }))

      const data = {
        id: id,
        reportDate: new Date().toISOString()
      }

      await stiApi.createReportDate(id, data)
      await fetchStiData()
      toast.success('Report date updated successfully!')
    } catch (error) {
      console.error('Error updating report date:', error)
      toast.error('Failed to update report date')
    } finally {
      setActionLoading((prev) => ({ ...prev, [actionKey]: false }))
    }
  }

  const handleRollback = async (id: number, currentStatus: string) => {
    const getStatusText = (status: string) => {
      switch (status) {
        case 'PSC_VISITED':
          return 'Waiting for PSC Visit'
        case 'COLLECTED':
          return 'PSC Visited'
        case 'REPORT_READY':
          return 'Collected'
        case 'RESULT_AVAILABLE':
          return 'Report Ready'
        default:
          return 'previous step'
      }
    }

    const result = await Swal.fire({
      title: 'Are you sure you want to rollback?',
      text: `This will revert the status back to "${getStatusText(currentStatus)}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, rollback',
      cancelButtonText: 'Cancel'
    })

    if (!result.isConfirmed) return

    const actionKey = `rollback-${id}`
    try {
      setActionLoading((prev) => ({ ...prev, [actionKey]: true }))

      const data = {
        id: id,
        status: currentStatus
      }

      await stiApi.createRollBack(data)
      await fetchStiData()
      toast.success('Status rolled back successfully!')
    } catch (error) {
      console.error('Error rolling back status:', error)
      toast.error('Failed to rollback status')
    } finally {
      setActionLoading((prev) => ({ ...prev, [actionKey]: false }))
    }
  }

  return (
    <div className='space-y-6'>
      <div className='bg-white p-6 rounded-lg  border'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <Activity className='h-6 w-6 text-blue-600' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>STI Tracking Management</h1>
              <p className='text-gray-600 mt-1'>Monitor and manage STI test progress for all customers</p>
            </div>
          </div>

          <Button
            onClick={fetchStiData}
            variant='outline'
            className='flex items-center space-x-2 hover:bg-gray-50'
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      <StiDataTable
        data={stiData}
        columns={getStiColumns({
          onPscVisited: handlePscVisited,
          onSampleCollected: handleSampleCollected,
          onReportDate: handleReportDate,
          onRollback: handleRollback,
          actionLoading
        })}
      />
    </div>
  )
}
