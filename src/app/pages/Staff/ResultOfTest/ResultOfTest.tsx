import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { stiApi } from '@/app/apis/sti.api'
import type { StiTrackingResponse, Data } from '@/app/pages/Staff/StiTracking/models/sti.type'
import { toast } from 'react-toastify'
import { Plus, FileText, TestTube, User, Search, Filter, RefreshCw, Eye } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Input } from '@/app/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'

export default function ResultOfTest() {
  const navigate = useNavigate()
  const [stiData, setStiData] = useState<Data[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredData = stiData.filter(
    (test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.orderItem.order.customerProfile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.id.toString().includes(searchTerm)
  )

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 p-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-white rounded-lg shadow-sm p-12'>
            <div className='flex flex-col items-center justify-center space-y-4'>
              <div className='w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin'></div>
              <p className='text-gray-500'>Loading report ready tests...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <div className='bg-white p-6 rounded-lg shadow-sm border'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-indigo-100 rounded-lg'>
                <FileText className='h-6 w-6 text-indigo-600' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>Test Results Management</h1>
                <p className='text-gray-600 mt-1'>Create and manage test results for report-ready tests</p>
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

        {/* Statistics */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-gradient-to-r from-indigo-50 to-blue-100 p-4 rounded-lg border border-indigo-200'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-indigo-500 rounded-lg'>
                <FileText className='h-5 w-5 text-white' />
              </div>
              <div>
                <p className='text-sm font-medium text-indigo-600'>Report Ready Tests</p>
                <p className='text-2xl font-bold text-indigo-900'>{stiData.length}</p>
              </div>
            </div>
          </div>

          <div className='bg-gradient-to-r from-green-50 to-emerald-100 p-4 rounded-lg border border-green-200'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-green-500 rounded-lg'>
                <TestTube className='h-5 w-5 text-white' />
              </div>
              <div>
                <p className='text-sm font-medium text-green-600'>Ready for Results</p>
                <p className='text-2xl font-bold text-green-900'>{filteredData.length}</p>
              </div>
            </div>
          </div>

          <div className='bg-gradient-to-r from-purple-50 to-violet-100 p-4 rounded-lg border border-purple-200'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-purple-500 rounded-lg'>
                <User className='h-5 w-5 text-white' />
              </div>
              <div>
                <p className='text-sm font-medium text-purple-600'>Unique Customers</p>
                <p className='text-2xl font-bold text-purple-900'>
                  {new Set(stiData.map((test) => test.orderItem.order.customerProfile.id)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className='bg-white p-4 rounded-lg border shadow-sm'>
          <div className='flex items-center space-x-4'>
            <div className='relative flex-1 max-w-sm'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <Input
                placeholder='Search by test name, customer, or ID...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 border-gray-300'
              />
            </div>

            <Badge variant='outline' className='flex items-center space-x-1'>
              <Filter className='h-3 w-3' />
              <span>{filteredData.length} results</span>
            </Badge>
          </div>
        </div>

        {/* Table */}
        <div className='bg-white rounded-lg border shadow-sm overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow className='bg-gray-50'>
                <TableHead className='font-semibold text-gray-700'>Customer Info</TableHead>
                <TableHead className='font-semibold text-gray-700'>Test Details</TableHead>
                <TableHead className='font-semibold text-gray-700'>Test ID</TableHead>
                <TableHead className='font-semibold text-gray-700'>Status</TableHead>
                <TableHead className='font-semibold text-gray-700'>Report Date</TableHead>
                <TableHead className='font-semibold text-gray-700'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((test) => (
                  <TableRow key={test.id} className='hover:bg-gray-50 transition-colors'>
                    <TableCell>
                      <div className='flex items-center space-x-3 min-w-[200px]'>
                        <div className='relative'>
                          <img
                            className='h-12 w-12 rounded-full object-cover border-2 border-gray-200'
                            src={test.orderItem.order.customerProfile.avatar || '/default-avatar.png'}
                            alt=''
                          />
                          <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white'></div>
                        </div>
                        <div>
                          <div className='text-sm font-semibold text-gray-900'>
                            {test.orderItem.order.customerProfile.name}
                          </div>
                          <div className='text-xs text-gray-500'>@{test.orderItem.order.customerProfile.username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='space-y-1'>
                        <div className='text-sm font-semibold text-gray-900'>{test.name}</div>
                        <div className='text-xs text-gray-500'>Order: {test.orderItem.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm font-medium text-blue-600'>#{test.id}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className='bg-indigo-50 text-indigo-700 border-indigo-200 flex items-center gap-1'>
                        <FileText className='w-3 h-3' />
                        {test.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm text-gray-600'>{formatDate(test.reportDate)}</div>
                    </TableCell>
                    <TableCell>
                      <div className='flex space-x-2'>
                        <Button
                          onClick={() => handleCreateResult(test.id)}
                          size='sm'
                          className='bg-green-600 hover:bg-green-700 text-white flex items-center space-x-1'
                        >
                          <Plus className='w-4 h-4' />
                          <span>Create Result</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className='h-32 text-center'>
                    <div className='flex flex-col items-center justify-center space-y-2'>
                      <FileText className='h-8 w-8 text-gray-400' />
                      <p className='text-gray-500'>No report ready tests found</p>
                      <p className='text-sm text-gray-400'>Tests will appear here when reports are ready</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
