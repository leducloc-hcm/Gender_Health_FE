import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Clock, Plus, X, CheckCircle, CalendarIcon } from 'lucide-react'
import { Calendar } from '@/app/components/ui/calendar'
import { Input } from '@/app/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import { useForm } from 'react-hook-form'
import type { CalendarEvent, ConsultantFormData } from '../models/Consultant'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/app/components/ui/form'
import { Textarea } from '@/app/components/ui/textarea'
import {
  dateCalendarValidation,
  descriptionCalendarValidation,
  endTimeCalendarValidation,
  startTimeCalendarValidation,
  titleCalendarValidation
} from '../modules/CalendarValidation'
import { format, parse } from 'date-fns'
import { Button } from '@/app/components/ui/button'
import { cn } from '@/app/lib/utils'
import { scheduleApi } from '@/app/apis/Schedule.api'
import { toast } from 'react-toastify'
import { sConsultantProfile } from '@/app/hooks/sConsultantProfile'

const CalendarBooking = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    { title: 'Team Meeting', start: '2025-06-02T10:00:00', end: '2025-06-02T11:00:00' },
    { title: 'Project Review', start: '2025-06-03T14:00:00', end: '2025-06-03T15:30:00' }
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)

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
      data.consultantProfileId = sConsultantProfile.value.consultant_profile_id
      console.log('data: ', data)
      const response = await scheduleApi.creteConsultantSchedule(data)
      toast.success('Event created successfully!')
      form.reset()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error creating event:', error)
    }
  }

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
                                    {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
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
                // Convert dateStr to Date object for the form
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
              eventClassNames='rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-l-4 border-l-pink-300 bg-gradient-to-r from-pink-300 to-pink-400 hover:from-pink-500 hover:to-pink-600 font-medium text-sm backdrop-blur-sm'
              eventBackgroundColor='#ec4899'
              eventBorderColor='#db2777'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarBooking
