import { stiApi } from '@/app/apis/sti.api'
import { Button } from '@/app/components/ui/button'
import { getResultColumns } from '@/app/pages/Staff/ResultOfTest/partials/getResultColumns'
import ResultDataTable from '@/app/pages/Staff/ResultOfTest/partials/ResultDataTable'
import type { Data, StiTrackingResponse } from '@/app/pages/Staff/StiTracking/models/sti.type'
import { FileText, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function ResultOfTest() {
  const navigate = useNavigate()
  const [stiData, setStiData] = useState<Data[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetchReportReadyTests()
  }, [])

  const fetchReportReadyTests = async () => {
    try {
      setLoading(true)
      const response: StiTrackingResponse = await stiApi.getAllStis()
      const reportReadyTests = response.data.filter(
        (test) => test.status === 'REPORT_READY' || test.status === 'RESULT_AVAILABLE'
      )
      setStiData(reportReadyTests)
    } catch (error) {
      console.error('Error fetching report ready tests:', error)
      toast.error('Failed to fetch report ready tests')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateResult = (testId: number) => {
    navigate(`/staff/result-of-test/create/${testId}`)
  }

  const handleViewResult = (testId: number) => {
    navigate(`/staff/result-of-test/view/${testId}`)
  }

  const handleDeleteResult = async (testId: number) => {
    if (!window.confirm('Are you sure you want to delete this test result?')) {
      return
    }
    try {
      setLoading(true)
      await stiApi.deleteTestResult(testId)
      toast.success('Test result deleted successfully')
      await fetchReportReadyTests()
    } catch (error) {
      console.error('Error deleting test result:', error)
      toast.error('Failed to delete test result')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-white p-6 rounded-lg shadow-sm border'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-indigo-100 rounded-lg'>
              <FileText className='h-6 w-6 text-indigo-600' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Test Results Management</h1>
              <p className='text-gray-600 mt-1'>Create, view and manage test results for report-ready tests</p>
            </div>
          </div>

          <Button
            onClick={fetchReportReadyTests}
            variant='outline'
            className='flex items-center space-x-2 hover:bg-gray-50'
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      <ResultDataTable
        data={stiData}
        columns={getResultColumns({
          onCreateResult: handleCreateResult,
          onViewResult: handleViewResult,
          onDeleteResult: handleDeleteResult
        })}
      />
    </div>
  )
}
