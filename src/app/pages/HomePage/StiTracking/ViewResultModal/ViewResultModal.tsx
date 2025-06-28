import { stiApi } from '@/app/apis/sti.api'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import LoadingSpinner from '@/app/components/ui/loadingspinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import type { ResultOfTestResponse } from '@/app/pages/Staff/ResultOfTest/models/result.type'
import { AlertCircle, Eye, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface ViewResultModalProps {
  isOpen: boolean
  onClose: () => void
  testId: number
  testName: string
}

export default function ViewResultModal({ isOpen, onClose, testId, testName }: ViewResultModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<ResultOfTestResponse | null>(null)

  const fetchTestResults = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await stiApi.getTestResultByStiTrackingId(testId)
      setTestResults(response)
    } catch (error) {
      console.error('Error fetching test results:', error)
      setError('Failed to fetch test results')
      toast.error('Failed to load test results')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && testId) {
      fetchTestResults()
    }
  }, [isOpen, testId])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-[90vw] lg:max-w-5xl max-h-[90vh] flex flex-col p-0 gap-0'>
        <DialogHeader className='px-6 pt-6 pb-4 border-b border-gray-200 flex-shrink-0'>
          <div className='flex items-center justify-between'>
            <DialogTitle className='flex items-center gap-3 text-xl font-bold text-gray-900'>
              <div className='p-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-lg'>
                <Eye className='w-5 h-5 text-white' />
              </div>
              Test Results
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className='flex-1 overflow-y-auto px-6 py-4'>
          <div className='space-y-6'>
            <div className='bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-lg border border-pink-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>{testName}</h3>
                  <p className='text-sm text-gray-600'>Test ID: #{testId}</p>
                </div>
                <Badge className='bg-green-100 text-green-800 border-green-300'>Results Available</Badge>
              </div>
            </div>
            {loading && (
              <div className='flex justify-center py-8'>
                <LoadingSpinner />
              </div>
            )}
            {error && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
                <div className='flex items-center space-x-3'>
                  <AlertCircle className='h-6 w-6 text-red-600' />
                  <div>
                    <h3 className='text-lg font-semibold text-red-800'>Error Loading Results</h3>
                    <p className='text-red-600'>{error}</p>
                  </div>
                </div>
                <Button
                  onClick={fetchTestResults}
                  variant='outline'
                  className='mt-4 border-red-300 text-red-700 hover:bg-red-50'
                >
                  Try Again
                </Button>
              </div>
            )}
            {testResults && !loading && !error && (
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <h4 className='text-lg font-semibold text-gray-900'>Test Results</h4>
                  <Badge variant='secondary'>
                    {testResults.data.length} result{testResults.data.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                {testResults.data.length > 0 ? (
                  <div className='border rounded-lg overflow-hidden bg-white'>
                    <Table>
                      <TableHeader>
                        <TableRow className='bg-gray-50'>
                          <TableHead className='w-12 text-center font-semibold'>#</TableHead>
                          <TableHead className='font-semibold'>Test Code</TableHead>
                          <TableHead className='font-semibold'>Abbreviation</TableHead>
                          <TableHead className='text-right font-semibold'>Value</TableHead>
                          <TableHead className='font-semibold'>Result</TableHead>
                          <TableHead className='font-semibold'>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {testResults.data.map((result, index) => (
                          <TableRow key={result.id} className='hover:bg-gray-50 transition-colors'>
                            <TableCell className='text-center'>
                              <div className='w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white flex items-center justify-center text-sm font-bold'>
                                {index + 1}
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className='bg-gray-100 px-3 py-1 rounded-md text-sm font-mono text-gray-800 border'>
                                {result.testCode}
                              </code>
                            </TableCell>
                            <TableCell>
                              <span className='font-semibold text-gray-900'>{result.abbreviation}</span>
                            </TableCell>
                            <TableCell className='text-right'>
                              <span className='text-lg font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded'>
                                {result.value}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge className='bg-green-100 text-green-800 border-green-300'>
                                {result.result || 'Normal'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className='text-sm text-gray-600'>
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
                ) : (
                  <div className='text-center py-8 bg-gray-50 rounded-lg border border-gray-200'>
                    <AlertCircle className='w-12 h-12 text-gray-400 mx-auto mb-3' />
                    <p className='text-gray-600 text-lg font-medium'>No test results found</p>
                    <p className='text-gray-500 text-sm mt-1'>Results may still be processing</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className='px-6 pb-2 pt-4 border-t border-gray-200 flex-shrink-0'>
          <div className='flex justify-end space-x-3'>
            <Button variant='outline' onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
