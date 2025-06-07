import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Clock, Plus, X, CheckCircle, CalendarIcon } from 'lucide-react'
import { Calendar } from '@/app/components/ui/calendar'
import { Input } from '@/app/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import { useForm } from 'react-hook-form'
import type { ConsultantFormData } from '../models/Consultant'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/app/components/ui/form'
import { Textarea } from '@/app/components/ui/textarea'
import {
  dateCalendarValidation,
  descriptionCalendarValidation,
  endTimeCalendarValidation,
  startTimeCalendarValidation,
  titleCalendarValidation
} from '../modules/CalendarValidation'
import { parse } from 'date-fns'
import { Button } from '@/app/components/ui/button'
import { cn } from '@/app/lib/utils'
import { scheduleApi } from '@/app/apis/Schedule.api'
import { toast } from 'react-toastify'
import { sConsultantProfile } from '@/app/hooks/sConsultantProfile'
import { authApi } from '@/app/apis/auth.api'
import { useSocket } from '@/app/hooks/useSocket'

interface ScheduleResponse {
  id: number
  status: string
  data: {
    id: number
    status: string
  }
}

interface ExtendedProps {
  status: string
  description: string
  fullTitle: string
  id: number
}

interface BookedBy {
  id: string
  name: string
  email?: string
}

export interface DataResponseCalendar {
  id: number
  consultantProfileId: number
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  status: string
  createdAt: string
  acceptedAt?: string
  acceptedBy?: number
  bookedBy: BookedBy | null
  bookedAt: string | null
}

interface CalendarEvent {
  title: string
  start: string
  end: string
  extendedProps: ExtendedProps
}

const CalendarBooking = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { socket, reinitializeSocket } = useSocket()

  const mapToCalendarEvents = (apiData: DataResponseCalendar[]): CalendarEvent[] => {
    return apiData.map((item: DataResponseCalendar) => {
      // Ensure date is in YYYY-MM-DD format
      const datePart = item.date.split('T')[0]
      const start = `${datePart}T${item.startTime}:00`
      const end = `${datePart}T${item.endTime}:00`

      return {
        title: item.title,
        start,
        end,
        extendedProps: {
          status: item.status,
          description: item.description,
          fullTitle: item.title,
          id: item.id
        } as ExtendedProps
      }
    })
  }

  const form = useForm<ConsultantFormData>({
    mode: 'onBlur',
    defaultValues: {
      consultantProfileId: 0,
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: ''
    }
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
    setValue
  } = form

  const onSubmit = async (data: ConsultantFormData) => {
    try {
      // Format date to YYYY-MM-DD for backend, preserving the local date
      const date = new Date(data.date)
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

      const payload = {
        ...data,
        consultantProfileId: sConsultantProfile.value.consultant_profile_id,
        date: formattedDate
      }

      const response = (await scheduleApi.creteConsultantSchedule(payload)) as unknown as ScheduleResponse

      // Add the new event to the calendar immediately with proper date handling
      const newEvent: CalendarEvent = {
        title: data.title,
        start: `${formattedDate}T${data.startTime}:00`,
        end: `${formattedDate}T${data.endTime}:00`,
        extendedProps: {
          status: 'PENDING',
          description: data.description,
          fullTitle: data.title,
          id: response.data.id
        } as ExtendedProps
      }

      setEvents((prevEvents) => {
        const updatedEvents = [...prevEvents, newEvent]
        console.log('Updated events:', updatedEvents)
        return updatedEvents
      })

      toast.success('Event created successfully!')
      form.reset()
      setIsModalOpen(false)

      await fetchCalendarSchedule()
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error('Failed to create event. Please try again.')
    }
  }

  const fetchCalendarSchedule = async () => {
    try {
      const profileResponse = await authApi.getProfileConsultant()
      const consultantProfileId = profileResponse.result.consultant_profile_id
      const response = await scheduleApi.getConsultantSchedule(consultantProfileId as number)
      const mappedEvents = mapToCalendarEvents(response.data)
      setEvents(mappedEvents)
    } catch (error) {
      console.error('Error fetching calendar schedule:', error)
    }
  }

  // Add initial data fetch
  useEffect(() => {
    fetchCalendarSchedule()
    reinitializeSocket()
  }, [])

  useEffect(() => {
    if (!socket) return

    const handleWorkScheduleUpdate = (data: { workScheduleId: number; status: string }) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) => {
          const extendedProps = event.extendedProps as ExtendedProps
          if (extendedProps.id === data.workScheduleId) {
            return {
              ...event,
              extendedProps: {
                ...extendedProps,
                status: data.status
              }
            }
          }
          return event
        })
      )

      if (data.status === 'APPROVED') {
        toast.success('Schedule has been approved!')
      } else if (data.status === 'REJECTED') {
        toast.error('Schedule has been rejected')
      }
    }

    socket.on('work_schedule_status_update', handleWorkScheduleUpdate)

    return () => {
      socket.off('work_schedule_status_update', handleWorkScheduleUpdate)
    }
  }, [socket])

  const closeModal = () => {
    setIsModalOpen(false)
    reset()
    clearErrors()
  }

  const handleInputFocus = (fieldName: keyof ConsultantFormData) => {
    clearErrors(fieldName)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      <div className='max-w-7xl mx-auto p-6'>
        <div className='flex justify-between items-center mb-8'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-emerald-100 rounded-lg'></div>
            <div>
              <h1 className='text-3xl font-bold text-slate-800'>Schedule Calendar</h1>
              <p className='text-slate-600 mt-1'>Manage your events and appointments</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className='group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 ease-in-out transform hover:scale-105'
          >
            <Plus className='h-5 w-5 group-hover:rotate-90 transition-transform duration-200' />
            <span>Add Event</span>
          </button>
        </div>

        {isModalOpen && (
          <div>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
                  <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100'>
                    <div className='flex items-center justify-between p-6 border-b border-slate-200'>
                      <div className='flex items-center space-x-3'>
                        <div className='p-2 bg-emerald-100 rounded-lg'>
                          <Plus className='h-5 w-5 text-emerald-600' />
                        </div>
                        <h2 className='text-xl font-semibold text-slate-800'>Create New Event</h2>
                      </div>
                      <button
                        onClick={closeModal}
                        className='p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200'
                      >
                        <X className='h-5 w-5 text-slate-500' />
                      </button>
                    </div>

                    <div className='p-6 space-y-5'>
                      <FormField
                        control={control}
                        name='title'
                        rules={titleCalendarValidation}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='block text-sm font-medium text-slate-700'>Event Title</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e)
                                  // Chỉ xóa lỗi nếu cần, hoặc bỏ dòng này
                                  // clearErrors('title');
                                }}
                                type='text'
                                placeholder='Enter event title...'
                                className={`w-full h-[42px] p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                  errors.title
                                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                                    : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
                                }`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name='description'
                        rules={descriptionCalendarValidation}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='block text-sm font-medium text-slate-700'>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e)
                                }}
                                placeholder='Enter event description...'
                                className={`w-full  pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                  errors.description
                                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                                    : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
                                }`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name='date'
                        rules={dateCalendarValidation}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='block text-sm font-medium text-slate-700'>Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant='outline'
                                    className={cn(
                                      'w-[240px] justify-start text-left font-normal',
                                      !field.value && 'text-muted-foreground',
                                      errors.date && 'border-red-300 text-red-500' // Thêm style khi có lỗi
                                    )}
                                  >
                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                    {field.value ? (
                                      new Date(field.value).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                      })
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className='w-auto p-0' align='start'>
                                <Calendar
                                  mode='single'
                                  selected={field.value instanceof Date ? field.value : undefined}
                                  onSelect={(date) => field.onChange(date)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className='grid grid-cols-2 gap-4'>
                        <FormField
                          control={control}
                          name='startTime'
                          rules={startTimeCalendarValidation}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='block text-sm font-medium text-slate-700'>Start Time</FormLabel>
                              <div className='relative'>
                                <Clock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400' />
                                <FormControl>
                                  <Input
                                    {...field}
                                    onFocus={() => handleInputFocus('startTime')}
                                    type='time'
                                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                      errors.startTime
                                        ? 'border-red-300 focus:ring-red-500 bg-red-50'
                                        : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
                                    }`}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage /> {/* Hiển thị thông báo lỗi */}
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name='endTime'
                          rules={endTimeCalendarValidation} // Áp dụng validation
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='block text-sm font-medium text-slate-700'>End Time</FormLabel>
                              <div className='relative'>
                                <Clock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400' />
                                <FormControl>
                                  <Input
                                    {...field}
                                    onFocus={() => handleInputFocus('endTime')}
                                    type='time'
                                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                      errors.endTime
                                        ? 'border-red-300 focus:ring-red-500 bg-red-50'
                                        : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
                                    }`}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage /> {/* Hiển thị thông báo lỗi */}
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className='flex justify-end space-x-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl'>
                      <button
                        onClick={closeModal}
                        className='px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-medium'
                      >
                        Cancel
                      </button>
                      <button
                        type='submit'
                        className='flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl'
                      >
                        <CheckCircle className='h-4 w-4' />
                        <span>Create Event</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        )}

        <div className='bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden'>
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
              dateClick={(info) => {
                alert('Clicked on: ' + info.dateStr)
                setIsModalOpen(true)
                const selectedDate = parse(info.dateStr, 'yyyy-MM-dd', new Date())
                setValue('date', selectedDate)
              }}
              eventClick={(info) => {
                alert(
                  `Event: ${info.event.title}\nStart: ${info.event.start?.toISOString()}\nEnd: ${info.event.end?.toISOString() || 'No end time'}`
                )
              }}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }}
              height='auto'
              dayHeaderClassNames='bg-slate-50 text-slate-700 font-semibold py-3'
              viewClassNames='bg-white'
              dayCellClassNames='border-b border-slate-100 hover:bg-emerald-50 transition-colors duration-200'
              slotLabelClassNames='text-slate-600 font-medium'
              eventClassNames='rounded-md shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-pink-400 bg-pink-100 hover:bg-pink-200 font-medium text-xs text-slate-800 truncate max-w-[95%] overflow-hidden whitespace-nowrap text-ellipsis py-1 px-2'
              eventBackgroundColor='#f9e8f0'
              eventBorderColor='#ec4899'
              eventContent={(arg) => {
                const status = arg.event.extendedProps.status
                let statusColors = {
                  backgroundColor: '#f9e8f0',
                  borderColor: '#ec4899',
                  textColor: '#374151'
                }

                // Set colors based on status
                switch (status) {
                  case 'PENDING':
                    statusColors = {
                      backgroundColor: '#fef3c7', // yellow-100
                      borderColor: '#f59e0b', // yellow-500
                      textColor: '#92400e' // yellow-800
                    }
                    break
                  case 'AVAILABLE':
                    statusColors = {
                      backgroundColor: '#dbeafe', // blue-100
                      borderColor: '#3b82f6', // blue-500
                      textColor: '#1e3a8a' // blue-800
                    }
                    break
                  case 'REJECTED':
                    statusColors = {
                      backgroundColor: '#fee2e2', // red-100
                      borderColor: '#ef4444', // red-500
                      textColor: '#991b1b' // red-800
                    }
                    break
                  default:
                    // Keep default pink colors for unknown status
                    break
                }

                return (
                  <div
                    className='relative rounded-md shadow-sm hover:shadow-md transition-all duration-200 font-medium text-xs truncate max-w-[95%] overflow-hidden whitespace-nowrap text-ellipsis py-1 px-2'
                    style={{
                      backgroundColor: statusColors.backgroundColor,
                      borderLeft: `4px solid ${statusColors.borderColor}`,
                      color: statusColors.textColor
                    }}
                  >
                    <div className='truncate'>{arg.event.title}</div>
                    <div className='text-xs opacity-75 truncate'>{status}</div>
                  </div>
                )
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarBooking
