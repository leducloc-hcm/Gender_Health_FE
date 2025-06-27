import { stiApi } from '@/app/apis/sti.api'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import LoadingSpinner from '@/app/components/ui/loadingspinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import type { ResultOfTestResponse, StiTrackingByIdResponse } from '@/app/pages/Staff/ResultOfTest/models/result.type'
import { AlertCircle, ArrowLeft, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function ViewResultOfTest() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testData, setTestData] = useState<StiTrackingByIdResponse | null>(null)
  const [testResults, setTestResults] = useState<ResultOfTestResponse | null>(null)

  useEffect(() => {
    if (id) {
      fetchTestData(parseInt(id))
    } else {
      setError('No test ID provided')
      setLoading(false)
    }
  }, [id])

  const fetchTestData = async (testId: number) => {
    try {
      setLoading(true)
      setError(null)

      // Fetch both test details and results
      const [testDetailsResponse, testResultsResponse] = await Promise.all([
        stiApi.getStiById(testId),
        stiApi.getTestResultByStiTrackingId(testId)
      ])

      setTestData(testDetailsResponse)
      setTestResults(testResultsResponse)
    } catch (error) {
      console.error('Error fetching test data:', error)
      setError(`Failed to fetch test data: ${error instanceof Error ? error.message : 'Unknown error'}`)
      toast.error('Failed to fetch test data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className='space-y-6'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-8'>
          <div className='flex items-center space-x-3 mb-4'>
            <AlertCircle className='h-8 w-8 text-red-600' />
            <div>
              <h3 className='text-lg font-bold text-red-800'>Error Loading Test Data</h3>
              <p className='text-red-600'>{error}</p>
            </div>
          </div>
          <div className='flex space-x-3'>
            <Button
              onClick={() => navigate('/staff/result-of-test')}
              variant='outline'
              className='border-red-300 text-red-700 hover:bg-red-50'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to List
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!testData || !testResults) {
    return (
      <div className='space-y-6'>
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-8'>
          <div className='flex items-center space-x-3 mb-4'>
            <AlertCircle className='h-8 w-8 text-yellow-600' />
            <div>
              <h3 className='text-lg font-bold text-yellow-800'>No Test Data Found</h3>
              <p className='text-yellow-600'>The test data or results could not be loaded</p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/staff/result-of-test')}
            variant='outline'
            className='border-yellow-300 text-yellow-700 hover:bg-yellow-50'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to List
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-white p-6 rounded-lg shadow-sm border'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <Button
              onClick={() => navigate('/staff/result-of-test')}
              variant='outline'
              size='sm'
              className='flex items-center space-x-1'
            >
              <ArrowLeft className='w-4 h-4' />
              <span>Back</span>
            </Button>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>View Test Results</h1>
              <p className='text-gray-600 mt-1'>Test results for STI tracking</p>
            </div>
          </div>
        </div>
      </div>
      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <img
              className='h-16 w-16 rounded-full object-cover border-4 border-white shadow-md'
              src={testData.data.stisTracking?.orderItem?.order?.customerProfile?.avatar || '/default-avatar.png'}
              alt=''
              onError={(e) => {
                e.currentTarget.src = '/default-avatar.png'
              }}
            />
            <div>
              <h2 className='text-xl font-bold text-gray-900'>
                {testData.data.stisTracking?.orderItem?.order?.customerProfile?.name || 'Unknown Customer'}
              </h2>
              <p className='text-gray-600'>
                @{testData.data.stisTracking?.orderItem?.order?.customerProfile?.username || 'unknown'}
              </p>
              <Badge className='bg-blue-100 text-blue-800 mt-1'>
                {testData.data.stisTracking?.status || 'RESULT_AVAILABLE'}
              </Badge>
            </div>
          </div>
          <div className='text-right'>
            <p className='text-sm text-gray-600'>Test ID</p>
            <p className='text-2xl font-bold text-blue-600'>#{testData.data.stisTracking?.id || id}</p>
            <p className='text-sm text-gray-500 mt-1'>{testResults.data.length} results available</p>
          </div>
        </div>
      </div>
      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <Eye className='w-6 h-6 text-blue-600' />
            Test Results
          </CardTitle>
          <CardDescription>Detailed test results and values for STI tracking #{id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='border rounded-lg overflow-hidden'>
            <Table>
              <TableHeader>
                <TableRow className='bg-gray-50'>
                  <TableHead className='w-12 text-center'>#</TableHead>
                  <TableHead>Test Code</TableHead>
                  <TableHead>Abbreviation</TableHead>
                  <TableHead className='text-right'>Value</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testResults.data.map((result, index) => (
                  <TableRow key={result.id} className='hover:bg-gray-50'>
                    <TableCell className='text-center'>
                      <div className='w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold'>
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className='bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800'>
                        {result.testCode}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className='font-semibold text-gray-900'>{result.abbreviation}</span>
                    </TableCell>
                    <TableCell className='text-right'>
                      <span className='text-lg font-bold text-indigo-600'>{result.value}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className='bg-green-100 text-green-800'>{result.result || 'Completed'}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className='text-sm text-gray-500'>
                        {new Date(result.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {testResults.data.length === 0 && (
            <div className='text-center py-8'>
              <p className='text-gray-500'>No test results found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
