import { stiApi } from '@/app/apis/sti.api'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import type { ResultOfTestForm, StiTrackingByIdResponse } from '@/app/pages/Staff/ResultOfTest/models/result.type'
import { AlertCircle, ArrowLeft, RefreshCw, Save, TestTube } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function CreateResultOfTest() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testData, setTestData] = useState<StiTrackingByIdResponse | null>(null)
  const [resultForms, setResultForms] = useState<ResultOfTestForm[]>([])

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

      const response: StiTrackingByIdResponse = await stiApi.getStiById(id)

      if (!response || !response.data) {
        throw new Error('Invalid response data')
      }

      setTestData(response)

      if (response.data.testPackages?.tests && response.data.testPackages.tests.length > 0) {
        const initialForms: ResultOfTestForm[] = response.data.testPackages.tests.map((testItem) => ({
          testCode: testItem.test?.code || '',
          value: 0,
          abbreviation: '',
          stisTrackingId: id
        }))
        setResultForms(initialForms)
      } else {
        // If no tests in testPackages, create empty form
        setResultForms([
          {
            testCode: '',
            value: 0,
            abbreviation: '',
            stisTrackingId: id
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching test details:', error)
      setError(`Failed to fetch test details: ${error instanceof Error ? error.message : 'Unknown error'}`)
      toast.error('Failed to fetch test details')
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (index: number, field: keyof ResultOfTestForm, value: string | number) => {
    setResultForms((prev) => prev.map((form, i) => (i === index ? { ...form, [field]: value } : form)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Filter and validate forms - only include forms with values
    const validForms = resultForms.filter(
      (form) => form.testCode.trim() !== '' && form.abbreviation.trim() !== '' && form.value > 0
    )

    if (validForms.length === 0) {
      toast.error('Please fill in at least one test result with value > 0')
      return
    }

    try {
      setSaving(true)
      console.log('Submitting test results:', validForms)
      await stiApi.createTestResult(validForms)
      toast.success(`Successfully created ${validForms.length} test results!`)
      navigate('/staff/result-of-test')
    } catch (error) {
      console.error('Error creating test results:', error)
      toast.error('Failed to create test results')
    } finally {
      setSaving(false)
    }
  }

  const handleRetry = () => {
    if (id) {
      fetchTestDetails(parseInt(id))
    }
  }

  // const formatDate = (dateString: string | null) => {
  //   if (!dateString) return 'Not set'
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   })
  // }

  // Loading state
  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 p-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-white rounded-lg shadow-sm p-12'>
            <div className='flex flex-col items-center justify-center space-y-4'>
              <div className='w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin'></div>
              <p className='text-gray-700 text-lg'>Loading test details...</p>
              <p className='text-gray-500 text-sm'>Test ID: {id}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 p-6'>
        <div className='max-w-7xl mx-auto'>
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
                onClick={handleRetry}
                className='bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2'
              >
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
        </div>
      </div>
    )
  }

  if (!testData) {
    return (
      <div className='min-h-screen bg-gray-50 p-6'>
        <div className='max-w-7xl mx-auto'>
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
              <Button
                onClick={() => navigate('/staff/result-of-test')}
                variant='outline'
                size='sm'
                className='flex items-center space-x-1'
              >
                <ArrowLeft className='w-4 h-4' />
                <span>Back</span>
              </Button>
              <div className='p-2 bg-green-100 rounded-lg'>
                <TestTube className='h-6 w-6 text-green-600' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>Create Test Results</h1>
                <p className='text-gray-600 mt-1'>Create results for Stis Tracking</p>
              </div>
            </div>
          </div>
        </div>

        {/* Test Information Summary */}
        <div className='bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200'>
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
                <Badge className='bg-indigo-100 text-indigo-800 mt-1'>
                  {testData.data.stisTracking?.status || 'REPORT_READY'}
                </Badge>
              </div>
            </div>
            <div className='text-right'>
              <p className='text-sm text-gray-600'>Test ID</p>
              <p className='text-2xl font-bold text-indigo-600'>#{testData.data.stisTracking?.id || id}</p>
              <p className='text-sm text-gray-500 mt-1'>{resultForms.length} tests available</p>
            </div>
          </div>
        </div>

        {/* Test Results Table Form */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <TestTube className='w-6 h-6 text-green-600' />
              Test Results Entry Table
            </CardTitle>
            <CardDescription>
              Enter values and abbreviations for each test. Only filled tests will be submitted.
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
                      <TableHead className='w-32 text-center'>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultForms.map((form, index) => {
                      const testName = testData.data.testPackages?.tests?.[index]?.test?.name || `Test ${index + 1}`
                      const testType =
                        testData.data.testPackages?.tests?.[index]?.test?.type_of_test?.name || 'Unknown Type'
                      const isFilled = form.value > 0 && form.abbreviation.trim() !== ''

                      return (
                        <TableRow key={index} className={`hover:bg-gray-50 ${isFilled ? 'bg-green-50' : ''}`}>
                          {/* Index */}
                          <TableCell className='text-center'>
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                isFilled ? 'bg-green-500' : 'bg-gray-400'
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
                              step='0.01'
                              min='0'
                              max='999.99'
                              value={form.value || ''}
                              onChange={(e) => handleFormChange(index, 'value', parseFloat(e.target.value) || 0)}
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

                          {/* Status */}
                          <TableCell className='text-center'>
                            {isFilled ? (
                              <Badge className='bg-green-100 text-green-800 text-xs'>Ready</Badge>
                            ) : (
                              <Badge variant='outline' className='text-gray-500 text-xs'>
                                Pending
                              </Badge>
                            )}
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
                    <h4 className='font-semibold text-blue-800'>Summary</h4>
                    <p className='text-sm text-blue-600'>
                      {resultForms.filter((form) => form.value > 0 && form.abbreviation.trim() !== '').length} of{' '}
                      {resultForms.length} tests ready to submit
                    </p>
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
                    resultForms.filter((form) => form.value > 0 && form.abbreviation.trim() !== '').length === 0
                  }
                  className='bg-green-600 hover:bg-green-700 flex items-center space-x-2 min-w-[180px]'
                >
                  {saving ? (
                    <>
                      <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                      <span>Creating Results...</span>
                    </>
                  ) : (
                    <>
                      <Save className='w-4 h-4' />
                      <span>
                        Create {resultForms.filter((form) => form.value > 0 && form.abbreviation.trim() !== '').length}{' '}
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
    </div>
  )
}
