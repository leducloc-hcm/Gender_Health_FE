import { stiApi } from '@/app/apis/sti.api'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import LoadingSpinner from '@/app/components/ui/loadingspinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import type { ResultOfTestUpdateForm, StiTrackingByIdResponse } from '@/app/pages/Staff/ResultOfTest/models/result.type'
import { AlertCircle, ArrowLeft, RefreshCw, Save, TestTube } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function UpdateResultOfTest() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testData, setTestData] = useState<StiTrackingByIdResponse | null>(null)
  const [resultForms, setResultForms] = useState<ResultOfTestUpdateForm[]>([])
  const [originalResults, setOriginalResults] = useState<any[]>([])

  useEffect(() => {
    if (id) {
      fetchTestDetails(parseInt(id))
    } else {
      setError('No test ID provided')
      setLoading(false)
    }
  }, [id])

  const fetchTestDetails = async (id: number) => {
    try {
      setLoading(true)
      setError(null)

      // Fetch both test details and existing results
      const [testDetailsResponse, existingResultsResponse] = await Promise.all([
        stiApi.getStiById(id),
        stiApi.getTestResultByStiTrackingId(id).catch(() => ({ data: [] })) // Handle case where no results exist yet
      ])

      if (!testDetailsResponse || !testDetailsResponse.data) {
        throw new Error('Invalid response data')
      }

      setTestData(testDetailsResponse)

      // Get existing results from the API call
      const existingResults = existingResultsResponse.data || []
      setOriginalResults(existingResults)

      if (testDetailsResponse.data.testPackages?.tests && testDetailsResponse.data.testPackages.tests.length > 0) {
        const initialForms: ResultOfTestUpdateForm[] = testDetailsResponse.data.testPackages.tests.map((testItem) => {
          // Find existing result for this test
          const existingResult = existingResults.find((result) => result.testCode === testItem.test?.code)

          return {
            testCode: testItem.test?.code || '',
            value: existingResult?.value || 0,
            abbreviation: existingResult?.abbreviation || '',
            id: existingResult?.id || 0 // Use the result ID, not test ID
          }
        })
        setResultForms(initialForms)
      } else {
        setResultForms([])
      }
    } catch (error) {
      console.error('Error fetching test details:', error)
      setError(`Failed to fetch test details: ${error instanceof Error ? error.message : 'Unknown error'}`)
      toast.error('Failed to fetch test details')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validForms = resultForms.filter(
      (form) => form.testCode.trim() !== '' && form.abbreviation.trim() !== '' && form.value > 0
    )

    if (validForms.length === 0) {
      toast.error('Please fill in at least one test result with value > 0')
      return
    }

    try {
      setSaving(true)

      // Only send forms that have existing result IDs (id > 0)
      const formsToUpdate = validForms.filter((form) => form.id > 0)

      if (formsToUpdate.length === 0) {
        toast.error('No existing results to update. Please create new results first.')
        return
      }

      await stiApi.updateTestResult(parseInt(id!), formsToUpdate)

      toast.success(`Successfully updated ${formsToUpdate.length} test results`)
      navigate('/staff/result-of-test')
    } catch (error) {
      console.error('Error updating test results:', error)
      toast.error('Failed to update test results')
    } finally {
      setSaving(false)
    }
  }

  const handleFormChange = (index: number, field: keyof ResultOfTestUpdateForm, value: string | number) => {
    setResultForms((prev) => prev.map((form, i) => (i === index ? { ...form, [field]: value } : form)))
  }

  const handleRetry = () => {
    if (id) {
      fetchTestDetails(parseInt(id))
    }
  }

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-lg p-8'>
        <div className='flex items-center space-x-3 mb-4'>
          <AlertCircle className='h-8 w-8 text-red-600' />
          <div>
            <h3 className='text-lg font-bold text-red-800'>Error Loading Test Data</h3>
            <p className='text-red-600'>{error}</p>
          </div>
        </div>
        <div className='flex space-x-3'>
          <Button onClick={handleRetry} className='bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2'>
            <RefreshCw className='w-4 h-4' />
            <span>Retry</span>
          </Button>
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
    )
  }

  if (!testData) {
    return (
      <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-8'>
        <div className='flex items-center space-x-3 mb-4'>
          <AlertCircle className='h-8 w-8 text-yellow-600' />
          <div>
            <h3 className='text-lg font-bold text-yellow-800'>No Test Data Found</h3>
            <p className='text-yellow-600'>The test data could not be loaded</p>
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
            <div className='p-2 bg-blue-100 rounded-lg'>
              <TestTube className='h-6 w-6 text-blue-600' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Update Test Results</h1>
              <p className='text-gray-600 mt-1'>Modify existing results for Stis Tracking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Test Information Summary */}
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
            <p className='text-sm text-gray-500 mt-1'>{resultForms.length} tests available</p>
            <p className='text-xs text-gray-400 mt-1'>{originalResults.length} existing results</p>
          </div>
        </div>
      </div>

      {/* Test Results Table Form */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <TestTube className='w-6 h-6 text-blue-600' />
            Update Test Results Entry Table
          </CardTitle>
          <CardDescription>
            Modify values and abbreviations for each test. Only filled tests will be updated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Table */}
            <div className='border rounded-lg overflow-hidden'>
              <Table>
                <TableHeader>
                  <TableRow className='bg-gray-50'>
                    <TableHead className='w-12 text-center'>#</TableHead>
                    <TableHead className='min-w-[200px]'>Test Name</TableHead>
                    <TableHead className='min-w-[120px]'>Test Code</TableHead>
                    <TableHead className='w-32'>Value *</TableHead>
                    <TableHead className='min-w-[200px]'>Abbreviation *</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resultForms.map((form, index) => {
                    const testName = testData.data.testPackages?.tests?.[index]?.test?.name || `Test ${index + 1}`
                    const testType =
                      testData.data.testPackages?.tests?.[index]?.test?.type_of_test?.name || 'Unknown Type'
                    const isFilled = form.value > 0 && form.abbreviation.trim() !== ''
                    const hasExisting = originalResults.some((result) => result.testCode === form.testCode)

                    return (
                      <TableRow key={index} className={`hover:bg-gray-50 ${isFilled ? 'bg-blue-50' : ''}`}>
                        {/* Index */}
                        <TableCell className='text-center'>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                              isFilled ? 'bg-blue-500' : 'bg-gray-400'
                            }`}
                          >
                            {index + 1}
                          </div>
                        </TableCell>

                        {/* Test Name */}
                        <TableCell>
                          <div>
                            <p className='font-semibold text-gray-900'>{testName}</p>
                            <p className='text-xs text-gray-500'>{testType}</p>
                            {hasExisting && (
                              <Badge
                                variant='outline'
                                className='text-xs mt-1 bg-green-50 text-green-700 border-green-200'
                              >
                                Has existing result
                              </Badge>
                            )}
                          </div>
                        </TableCell>

                        {/* Test Code (readonly) */}
                        <TableCell>
                          <code className='bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-800'>
                            {form.testCode || 'N/A'}
                          </code>
                        </TableCell>

                        {/* Value Input */}
                        <TableCell>
                          <Input
                            type='number'
                            step='0.0001'
                            min='0'
                            max='999.9999'
                            value={form.value === 0 ? '' : form.value.toString()}
                            onChange={(e) => {
                              const inputValue = e.target.value
                              if (inputValue === '') {
                                handleFormChange(index, 'value', 0)
                              } else {
                                const numericValue = parseFloat(inputValue)
                                if (!isNaN(numericValue)) {
                                  handleFormChange(index, 'value', numericValue)
                                }
                              }
                            }}
                            placeholder='0.0'
                            className='w-full'
                          />
                        </TableCell>

                        {/* Abbreviation Input */}
                        <TableCell>
                          <Input
                            value={form.abbreviation}
                            onChange={(e) => handleFormChange(index, 'abbreviation', e.target.value)}
                            placeholder='Enter test abbreviation'
                            className='w-full'
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='font-semibold text-blue-800'>Update Summary</h4>
                  <p className='text-sm text-blue-600'>
                    {
                      resultForms.filter((form) => form.value > 0 && form.abbreviation.trim() !== '' && form.id > 0)
                        .length
                    }{' '}
                    of {resultForms.length} tests ready to update
                  </p>
                  <p className='text-xs text-blue-500 mt-1'>{originalResults.length} existing results found</p>
                </div>
                <div className='text-right'>
                  <p className='text-sm text-blue-600'>StiTracking ID</p>
                  <p className='font-bold text-blue-800'>{id}</p>
                </div>
              </div>
            </div>

            <div className='flex justify-end space-x-3 pt-6 border-t border-gray-200'>
              <Button type='button' variant='outline' onClick={() => navigate('/staff/result-of-test')}>
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={
                  saving ||
                  resultForms.filter((form) => form.value > 0 && form.abbreviation.trim() !== '' && form.id > 0)
                    .length === 0
                }
                className='bg-blue-600 hover:bg-blue-700 flex items-center space-x-2 min-w-[180px]'
              >
                {saving ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    <span>Updating Results...</span>
                  </>
                ) : (
                  <>
                    <Save className='w-4 h-4' />
                    <span>
                      Update{' '}
                      {
                        resultForms.filter((form) => form.value > 0 && form.abbreviation.trim() !== '' && form.id > 0)
                          .length
                      }{' '}
                      Results
                    </span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
