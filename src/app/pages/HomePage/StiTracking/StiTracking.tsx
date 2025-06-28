import { useState, useEffect } from 'react'
import { stiApi } from '@/app/apis/sti.api'
import type { StiTrackingResponse, Data } from '@/app/pages/Staff/StiTracking/models/sti.type'
import { toast } from 'react-toastify'
import { User, TestTube, FileText, CheckCircle, Clock, Calendar, Activity, AlertCircle, Heart, Eye } from 'lucide-react'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { sUserProfile } from '@/app/hooks/sUserProfile'
import LoadingSpinner from '@/app/components/ui/loadingspinner'
import ViewResultModal from '@/app/pages/HomePage/StiTracking/ViewResultModal/ViewResultModal'

export default function StiTracking() {
  const [stiData, setStiData] = useState<Data[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTest, setSelectedTest] = useState<{ id: number; name: string } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // ...existing code for formatDate, getStatusConfig, and ProgressTimeline...

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusConfig = (status: string) => {
    const statusConfig = {
      WAITING_FOR_PSC_VISIT: {
        color: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300',
        icon: Clock,
        text: 'Waiting for Visit',
        description: 'Please visit the Patient Service Center to proceed with your test.',
        bgGradient: 'bg-yellow-100'
      },
      PSC_VISITED: {
        color: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-300',
        icon: User,
        text: 'PSC Visited',
        description: 'You have successfully visited the PSC. Sample collection is next.',
        bgGradient: 'bg-blue-100'
      },
      COLLECTED: {
        color: 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-300',
        icon: TestTube,
        text: 'Sample Collected',
        description: 'Your sample has been collected and is being processed.',
        bgGradient: 'bg-purple-100'
      },
      REPORT_READY: {
        color: 'bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 border-indigo-300',
        icon: FileText,
        text: 'Report Ready',
        description: 'Your test report is ready and being finalized.',
        bgGradient: 'bg-indigo-100'
      },
      RESULT_AVAILABLE: {
        color: 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-300',
        icon: CheckCircle,
        text: 'Results Available',
        description: 'Your test results are now available. Click to view your results.',
        bgGradient: 'bg-emerald-100'
      }
    }

    return statusConfig[status as keyof typeof statusConfig] || statusConfig.WAITING_FOR_PSC_VISIT
  }

  const ProgressTimeline = ({ item }: { item: Data }) => {
    const steps = [
      {
        key: 'psc',
        label: 'PSC Visit',
        icon: User,
        isCompleted: !!item.pscVisited,
        date: item.pscVisited,
        description: 'Visit Patient Service Center'
      },
      {
        key: 'sample',
        label: 'Sample Collection',
        icon: TestTube,
        isCompleted: !!item.collectedDate,
        date: item.collectedDate,
        description: 'Sample collected for testing'
      },
      {
        key: 'report',
        label: 'Report Generation',
        icon: FileText,
        isCompleted: !!item.reportDate,
        date: item.reportDate,
        description: 'Test report generated'
      },
      {
        key: 'result',
        label: 'Results Available',
        icon: CheckCircle,
        isCompleted: !!item.resultAvailable,
        date: item.resultAvailable,
        description: 'Results ready for viewing'
      }
    ]

    return (
      <div className='bg-gradient-to-r from-pink-50 via-rose-50 to-pink-100 rounded-xl p-6 border border-pink-200'>
        <h4 className='text-sm font-semibold text-pink-800 mb-4 flex items-center gap-2'>
          <Heart className='w-4 h-4 text-pink-600' />
          Test Progress
        </h4>

        <div className='min-h-[150px] flex flex-col justify-between'>
          <div className='flex items-start justify-between relative'>
            <div className='absolute top-6 left-6 right-6 h-0.5 bg-pink-200 z-0'>
              <div
                className='h-full bg-gradient-to-r from-pink-400 to-rose-400 transition-all duration-500 ease-in-out'
                style={{
                  width: `${(steps.filter((step) => step.isCompleted).length / steps.length) * 100}%`
                }}
              />
            </div>

            {steps.map((step, index) => {
              const isActive = !step.isCompleted && (index === 0 || steps[index - 1].isCompleted)
              const Icon = step.icon

              return (
                <div key={step.key} className='flex flex-col items-center relative z-10 flex-1'>
                  <div
                    className={`
                    w-12 h-12 rounded-full flex items-center justify-center border-3 transition-all duration-300 shadow-lg
                    ${
                      step.isCompleted
                        ? 'bg-gradient-to-r from-pink-400 to-rose-400 border-pink-500 text-white scale-110'
                        : isActive
                          ? 'bg-gradient-to-r from-pink-200 to-rose-200 border-pink-400 text-pink-700 '
                          : 'bg-white border-pink-300 text-pink-400'
                    }
                  `}
                  >
                    <Icon className='w-5 h-5' />
                  </div>

                  <div className='text-center mt-3 w-[150px] min-h-[70px] flex flex-col'>
                    <h3
                      className={`text-sm font-semibold ${
                        step.isCompleted ? 'text-pink-700' : isActive ? 'text-pink-600' : 'text-pink-400'
                      }`}
                    >
                      {step.label}
                    </h3>

                    <p className='text-xs text-pink-600 mb-2 leading-tight flex-grow'>{step.description}</p>

                    <div className='h-6 flex items-center justify-center mb-1'>
                      {step.isCompleted && (
                        <Badge className='bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 text-xs border-pink-300'>
                          ✓ Completed
                        </Badge>
                      )}
                      {isActive && (
                        <Badge className='bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs border-blue-300 animate-pulse'>
                          ⏳ Current
                        </Badge>
                      )}
                    </div>

                    <div className='h-4 flex items-center justify-center'>
                      {step.date && (
                        <div className='flex items-center space-x-1 text-xs text-pink-500'>
                          <Calendar className='w-3 h-3' />
                          <span>{formatDate(step.date)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const handleViewResults = (testId: number, testName: string) => {
    setSelectedTest({ id: testId, name: testName })
    setIsModalOpen(true)
  }

  const TestCard = ({ test }: { test: Data }) => {
    const statusConfig = getStatusConfig(test.status)
    const StatusIcon = statusConfig.icon
    const isResultAvailable = test.status === 'RESULT_AVAILABLE'

    return (
      <div
        className={`bg-gradient-to-r ${statusConfig.bgGradient} rounded-xl border-2 border-pink-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6 relative overflow-hidden`}
      >
        <div className='relative z-10'>
          <div className='flex items-start justify-between mb-6'>
            <div className='flex items-center space-x-3'>
              <div className='p-3 bg-gradient-to-r from-pink-400 to-rose-400 rounded-lg shadow-md'>
                <TestTube className='h-6 w-6 text-white' />
              </div>
              <div>
                <h3 className='text-xl font-bold text-gray-800 mb-1'>{test.name}</h3>
                <p className='text-sm text-pink-600 font-medium'>Test ID: #{test.id}</p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <Badge
                className={`${statusConfig.color} border-2 flex items-center gap-2 px-3 py-2 text-sm font-semibold shadow-sm`}
              >
                <StatusIcon className='w-4 h-4' />
                {statusConfig.text}
              </Badge>

              {isResultAvailable && (
                <Button
                  onClick={() => handleViewResults(test.id, test.name)}
                  className='bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300'
                  size='sm'
                >
                  <Eye className='w-4 h-4 mr-2' />
                  View Results
                </Button>
              )}
            </div>
          </div>

          <div className='mb-6 p-4 bg-white/70 rounded-lg border border-pink-200'>
            <p className='text-sm text-gray-700 mb-3 font-medium'>{statusConfig.description}</p>

            <div className='flex flex-wrap gap-4 text-xs text-gray-600'>
              <div className='flex items-center space-x-1'>
                <Calendar className='w-4 h-4 text-pink-500' />
                <span className='font-medium'>Ordered:</span>
                <span>{formatDate(test.createdAt)}</span>
              </div>
              {test.updatedAt !== test.createdAt && (
                <div className='flex items-center space-x-1'>
                  <Activity className='w-4 h-4 text-pink-500' />
                  <span className='font-medium'>Last updated:</span>
                  <span>{formatDate(test.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>

          <ProgressTimeline item={test} />
        </div>
      </div>
    )
  }

  const customerProfile = sUserProfile.use()
  const customerProfileId = customerProfile?.customer_profile_id

  const fetchStiData = async () => {
    try {
      setLoading(true)
      const response: StiTrackingResponse = await stiApi.getStiByCustomerProfileId(customerProfileId)
      setStiData(response.data)
    } catch (error) {
      console.error('Error fetching STI data:', error)
      setError('Failed to fetch your STI tracking data')
      toast.error('Failed to load your test information')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStiData()
  }, [customerProfileId])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-xl p-6 shadow-lg'>
            <div className='flex items-center space-x-3'>
              <AlertCircle className='h-8 w-8 text-red-600' />
              <div>
                <h3 className='text-lg font-bold text-red-800'>Error Loading Tests</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-6'>
      <div className='max-w-6xl mx-auto space-y-8'>
        <div className='bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-2 border-pink-200 p-8'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-xl shadow-lg'>
                <Heart className='h-8 w-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent'>
                  My STI Test Tracking
                </h1>
                <p className='text-gray-600 mt-2 text-lg'>Track the progress of your health tests with care 💗</p>
              </div>
            </div>

            <div className='text-right flex flex-col items-center'>
              <div className='text-2xl font-bold text-pink-600'>{stiData.length}</div>
              <div className='text-sm text-gray-500'>Total Tests</div>
            </div>
          </div>
        </div>

        {stiData.length > 0 ? (
          <div className='grid grid-cols-1 gap-6'>
            {stiData.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        ) : (
          <div className='bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-2 border-pink-200 p-12'>
            <div className='text-center'>
              <div className='p-6 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center'>
                <TestTube className='h-12 w-12 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-3'>No Tests Found</h3>
              <p className='text-gray-600 text-lg max-w-md mx-auto'>
                You don't have any STI tests yet. Visit our services to book a test and start taking care of your
                health! 💖
              </p>
            </div>
          </div>
        )}
      </div>

      {/* View Results Modal */}
      {selectedTest && (
        <ViewResultModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedTest(null)
          }}
          testId={selectedTest.id}
          testName={selectedTest.name}
        />
      )}
    </div>
  )
}
