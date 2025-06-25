import { Button } from '@/app/components/ui/button'
import { Card, CardContent } from '@/app/components/ui/card'
import { AlertCircle, CheckCircle, Clock, Clock3, Info, LogIn, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CalendarEventResponse } from './models/CustomerCalendar'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/react'
import { customerApi } from '@/app/apis/customer.api'
import { sUserProfile } from '@/app/hooks/sUserProfile'
import { AnimatePresence, motion } from 'framer-motion'

interface CalendarEvent {
  title: string
  start: string
  end: string
  extendedProps?: {
    status?: string
    description?: string
    consultantName?: string
    meetingLink?: string
    customerNote?: string
    consultantNote?: string
    rating?: string
    feedback?: string
  }
}

interface SelectedEvent {
  title: string
  start: string | null
  end: string
  status?: string
  description?: string
  location?: string
  startTime?: string
  endTime?: string
  customerName?: string
}

const CustomerCalendar = () => {
  const userProfile = sUserProfile.use()
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [, setShowLoginModal] = useState(false)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null)

  const navigate = useNavigate()

  const token = localStorage.getItem('access_token')
  const handleCloseModal = () => {
    setShowLoginModal(false)
    navigate('/')
  }
  const handleLogin = () => {
    navigate('/auth/login')
  }

  const mapToCalendarEvents = (apiData: CalendarEventResponse[]) => {
    return apiData.map((item: CalendarEventResponse) => {
      const datePart = item.date.split('T')[0]
      const start = `${datePart}`
      const end = `${datePart}`

      return {
        title: item.title || 'Event',
        start,
        end,
        extendedProps: {
          status: item.status || 'PENDING',
          description: item.description || 'No description available',
          location: item.location || 'Not specified',
          startTime: item.startTime || '',
          endTime: item.endTime || '',
          customerName: item.customerProfile?.name || 'Customer'
        }
      }
    })
  }
  useEffect(() => {
    const fetchCustomerCalendar = async () => {
      try {
        const response = await customerApi.getSelfSchedule(userProfile?.customer_profile_id)
        console.log('dataCalendar: ', response)

        // Kiểm tra xem response có data không
        if (response && response.data && Array.isArray(response.data)) {
          const mappedEvents = mapToCalendarEvents(response.data)
          setEvents(mappedEvents)
        }
      } catch (error) {
        console.error('Failed to fetch customer calendar:', error)
      }
    }

    if (userProfile?.customer_profile_id && userProfile.customer_profile_id > 0) {
      fetchCustomerCalendar()
    }
  }, [userProfile?.customer_profile_id])

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'waiting_for_start':
        return <Clock3 className='h-4 w-4 text-amber-500' />
      case 'active':
        return <CheckCircle className='h-4 w-4 text-green-500' />
      case 'completed':
        return <CheckCircle className='h-4 w-4 text-blue-500' />
      case 'cancelled':
        return <AlertCircle className='h-4 w-4 text-red-500' />
      default:
        return <Info className='h-4 w-4 text-gray-500' />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'waiting_for_start':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }
  if (!token) {
    return (
      <>
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <Card className='w-full max-w-md mx-auto shadow-2xl border-0 bg-white relative'>
            <button
              onClick={handleCloseModal}
              className='absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors'
            >
              <X className='w-4 h-4 text-gray-600' />
            </button>

            <CardContent className='p-8 text-center'>
              <div className='w-20 h-20 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                <LogIn className='w-10 h-10 text-pink-600' />
              </div>

              <h2 className='text-2xl font-bold text-gray-900 mb-3'>Login Required</h2>

              <p className='text-gray-600 mb-6 leading-relaxed'>
                To access your menstrual cycle tracking and get personalized health insights, please log in to your
                account.
              </p>

              <div className='space-y-3'>
                <Button
                  onClick={handleLogin}
                  className='w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200'
                >
                  <LogIn className='w-4 h-4 mr-2' />
                  Login to Continue
                </Button>

                <Button
                  variant='outline'
                  onClick={handleCloseModal}
                  className='w-full py-3 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg'
                >
                  Maybe Later
                </Button>
              </div>

              <p className='text-sm text-gray-500 mt-4'>
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/auth/register')}
                  className='text-pink-600 hover:text-pink-700 font-medium hover:underline'
                >
                  Sign up here
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <div className='bg-gradient-to-br from-white to-rose-50/30 rounded-3xl shadow-2xl border border-rose-100 overflow-hidden backdrop-blur-sm'>
        <div className='bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4'>
          <h1 className='text-2xl font-bold text-white flex items-center gap-2'>
            <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>📅</div>
            My Calendar
          </h1>
          <p className='text-rose-100 text-sm mt-1'>Track your appointments and schedules</p>
        </div>
        <div className='p-6'>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView='dayGridMonth'
            events={events}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            eventClick={(info) => {
              console.log('info: ', info)
              setSelectedEvent({
                title: info.event.title,
                start: info.event.start?.toLocaleString() || null,
                end: info.event.end?.toLocaleString() || 'No end time',
                status: info.event.extendedProps.status,
                description: info.event.extendedProps.description,
                location: info.event.extendedProps.location,
                startTime: info.event.extendedProps.startTime,
                endTime: info.event.extendedProps.endTime,
                customerName: info.event.extendedProps.customerName
              })
              setIsEventModalOpen(true)
            }}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            height='auto'
            dayHeaderClassNames='bg-gradient-to-r from-rose-50 to-pink-50 text-gray-700 font-bold py-4 text-center border-b-2 border-rose-200'
            viewClassNames='bg-white rounded-xl'
            dayCellClassNames='border border-rose-100/50 hover:bg-rose-50/40 transition-all duration-300 min-h-[120px]'
            slotLabelClassNames='text-gray-600 font-semibold text-sm'
            eventBackgroundColor='transparent'
            eventBorderColor='transparent'
            eventContent={(arg) => {
              const status = arg.event.extendedProps.status
              let statusColors = {
                backgroundColor: 'bg-gradient-to-r from-pink-100 to-rose-100',
                borderColor: 'border-pink-400',
                textColor: 'text-pink-800',
                dotColor: 'bg-pink-500'
              }

              switch (status) {
                case 'WAITING_FOR_START':
                  statusColors = {
                    backgroundColor: 'bg-gradient-to-r from-amber-100 to-yellow-100',
                    borderColor: 'border-amber-400',
                    textColor: 'text-amber-800',
                    dotColor: 'bg-amber-500'
                  }
                  break
                case 'ACTIVE':
                  statusColors = {
                    backgroundColor: 'bg-gradient-to-r from-green-100 to-emerald-100',
                    borderColor: 'border-green-400',
                    textColor: 'text-green-800',
                    dotColor: 'bg-green-500'
                  }
                  break
                case 'COMPLETED':
                  statusColors = {
                    backgroundColor: 'bg-gradient-to-r from-blue-100 to-sky-100',
                    borderColor: 'border-blue-400',
                    textColor: 'text-blue-800',
                    dotColor: 'bg-blue-500'
                  }
                  break
                case 'CANCELLED':
                  statusColors = {
                    backgroundColor: 'bg-gradient-to-r from-red-100 to-rose-100',
                    borderColor: 'border-red-400',
                    textColor: 'text-red-800',
                    dotColor: 'bg-red-500'
                  }
                  break
                default:
                  break
              }

              return (
                <div
                  className={`relative rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium text-xs p-3 cursor-pointer transform hover:scale-105 ${statusColors.backgroundColor} ${statusColors.borderColor} ${statusColors.textColor} border-2 backdrop-blur-sm`}
                >
                  <div className='flex items-center gap-2 mb-1'>
                    <div className={`w-2 h-2 rounded-full ${statusColors.dotColor} animate-pulse`}></div>
                    <div className='font-semibold truncate flex-1'>{arg.event.title}</div>
                  </div>
                </div>
              )
            }}
          />
        </div>
      </div>
      <AnimatePresence>
        {isEventModalOpen && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4'
            onClick={() => setIsEventModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 300 }}
              className='bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='relative bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 p-6'>
                <div className='absolute inset-0 bg-black/10'></div>
                <div className='relative flex items-center justify-between'>
                  <div>
                    <h2 className='text-2xl font-bold text-white'>Event Details</h2>
                    <p className='text-pink-100 text-sm mt-1'>View event information</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsEventModalOpen(false)}
                    className='p-2 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm'
                  >
                    <X className='h-6 w-6 text-white' />
                  </motion.button>
                </div>
              </div>

              <div className='p-6 space-y-6'>
                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className='space-y-2'
                >
                  <div className='flex items-center gap-2'>
                    <label className='text-sm font-semibold text-slate-700 uppercase tracking-wide'>Title</label>
                  </div>
                  <p className='text-xl font-bold text-slate-900 bg-slate-50 p-4 rounded-xl border border-slate-200'>
                    {selectedEvent.title}
                  </p>
                </motion.div>

                {/* Time Information */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className='space-y-2'
                  >
                    <div className='flex items-center gap-2'>
                      <Clock className='h-4 w-4 text-emerald-600' />
                      <label className='text-sm font-semibold text-slate-700 uppercase tracking-wide'>Start Time</label>
                    </div>
                    <p className='text-slate-900 bg-pink-50 p-3 rounded-lg border border-pink-200 font-medium'>
                      {selectedEvent.start}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className='space-y-2'
                  >
                    <div className='flex items-center gap-2'>
                      <Clock className='h-4 w-4 text-red-600' />
                      <label className='text-sm font-semibold text-slate-700 uppercase tracking-wide'>End Time</label>
                    </div>
                    <p className='text-slate-900 bg-rose-50 p-3 rounded-lg border border-rose-200 font-medium'>
                      {selectedEvent.end}
                    </p>
                  </motion.div>
                </div>

                {/* Status */}
                {selectedEvent.status && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className='space-y-2'
                  >
                    <div className='flex items-center gap-2'>
                      {getStatusIcon(selectedEvent.status)}
                      <label className='text-sm font-semibold text-slate-700 uppercase tracking-wide'>Status</label>
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-medium capitalize ${getStatusColor(selectedEvent.status)}`}
                    >
                      {getStatusIcon(selectedEvent.status)}
                      {selectedEvent.status}
                    </div>
                  </motion.div>
                )}

                {/* Description */}
                {selectedEvent.description && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className='space-y-2'
                  >
                    <div className='flex items-center gap-2'>
                      <Info className='h-4 w-4 text-rose-600' />
                      <label className='text-sm font-semibold text-slate-700 uppercase tracking-wide'>
                        Consultant Notes
                      </label>
                    </div>
                    <div className='bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-xl border border-rose-200'>
                      <p className='text-slate-800 leading-relaxed'>{selectedEvent.description}</p>
                    </div>
                  </motion.div>
                )}

                {/* Time Details */}
                {(selectedEvent.startTime || selectedEvent.endTime) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className='space-y-2'
                  >
                    <div className='flex items-center gap-2'>
                      <Clock className='h-4 w-4 text-blue-600' />
                      <label className='text-sm font-semibold text-slate-700 uppercase tracking-wide'>
                        Schedule Time
                      </label>
                    </div>
                    <div className='bg-gradient-to-r from-blue-50 to-sky-50 p-4 rounded-xl border border-blue-200'>
                      {selectedEvent.startTime && (
                        <p className='text-slate-800 font-medium'>
                          Start: {new Date(selectedEvent.startTime).toLocaleString()}
                        </p>
                      )}
                      {selectedEvent.endTime && (
                        <p className='text-slate-800 font-medium'>
                          End: {new Date(selectedEvent.endTime).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className='bg-gradient-to-r from-slate-50 to-slate-100 p-6 border-t border-slate-200'
              >
                <div className='flex justify-end gap-3'>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEventModalOpen(false)}
                    className='px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium'
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CustomerCalendar
