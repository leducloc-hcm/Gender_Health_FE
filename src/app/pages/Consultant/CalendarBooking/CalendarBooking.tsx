import type React from 'react'
import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Calendar, Clock, Plus, X, CheckCircle } from 'lucide-react'

interface CalendarEvent {
  title: string
  start: string
  end: string
}

const CalendarBooking = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    { title: 'Team Meeting', start: '2025-06-02T10:00:00', end: '2025-06-02T11:00:00' },
    { title: 'Project Review', start: '2025-06-03T14:00:00', end: '2025-06-03T15:30:00' }
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: '', date: '', startTime: '', endTime: '' })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!newEvent.title.trim()) newErrors.title = 'Event title is required'
    if (!newEvent.date) newErrors.date = 'Date is required'
    if (!newEvent.startTime) newErrors.startTime = 'Start time is required'
    if (!newEvent.endTime) newErrors.endTime = 'End time is required'

    if (newEvent.startTime && newEvent.endTime && newEvent.startTime >= newEvent.endTime) {
      newErrors.endTime = 'End time must be after start time'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAssignWork = () => {
    if (validateForm()) {
      const event: CalendarEvent = {
        title: newEvent.title,
        start: `${newEvent.date}T${newEvent.startTime}:00`,
        end: `${newEvent.date}T${newEvent.endTime}:00`
      }
      setEvents([...events, event])
      setNewEvent({ title: '', date: '', startTime: '', endTime: '' })
      setErrors({})
      setIsModalOpen(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewEvent((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setNewEvent({ title: '', date: '', startTime: '', endTime: '' })
    setErrors({})
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      <div className='max-w-7xl mx-auto p-6'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-emerald-100 rounded-lg'>
              <Calendar className='h-6 w-6 text-emerald-600' />
            </div>
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

        {/* Modal Overlay */}
        {isModalOpen && (
          <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100'>
              {/* Modal Header */}
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

              {/* Modal Body */}
              <div className='p-6 space-y-5'>
                {/* Event Title */}
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>Event Title</label>
                  <input
                    type='text'
                    name='title'
                    value={newEvent.title}
                    onChange={handleInputChange}
                    placeholder='Enter event title...'
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.title
                        ? 'border-red-300 focus:ring-red-500 bg-red-50'
                        : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
                    }`}
                  />
                  {errors.title && (
                    <p className='text-red-500 text-sm mt-1 flex items-center space-x-1'>
                      <span>⚠️</span>
                      <span>{errors.title}</span>
                    </p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>Date</label>
                  <input
                    type='date'
                    name='date'
                    value={newEvent.date}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.date
                        ? 'border-red-300 focus:ring-red-500 bg-red-50'
                        : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
                    }`}
                  />
                  {errors.date && (
                    <p className='text-red-500 text-sm mt-1 flex items-center space-x-1'>
                      <span>⚠️</span>
                      <span>{errors.date}</span>
                    </p>
                  )}
                </div>

                {/* Time Range */}
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>Start Time</label>
                    <div className='relative'>
                      <Clock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400' />
                      <input
                        type='time'
                        name='startTime'
                        value={newEvent.startTime}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.startTime
                            ? 'border-red-300 focus:ring-red-500 bg-red-50'
                            : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
                        }`}
                      />
                    </div>
                    {errors.startTime && (
                      <p className='text-red-500 text-sm mt-1 flex items-center space-x-1'>
                        <span>⚠️</span>
                        <span>{errors.startTime}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>End Time</label>
                    <div className='relative'>
                      <Clock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400' />
                      <input
                        type='time'
                        name='endTime'
                        value={newEvent.endTime}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.endTime
                            ? 'border-red-300 focus:ring-red-500 bg-red-50'
                            : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
                        }`}
                      />
                    </div>
                    {errors.endTime && (
                      <p className='text-red-500 text-sm mt-1 flex items-center space-x-1'>
                        <span>⚠️</span>
                        <span>{errors.endTime}</span>
                      </p>
                    )}
                  </div>
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
                  onClick={handleAssignWork}
                  className='flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl'
                >
                  <CheckCircle className='h-4 w-4' />
                  <span>Create Event</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Container */}
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
              }}
              eventClick={(info) => {
                alert(`Event: ${info.event.title}\nStart: ${info.event.start?.toISOString()}`)
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
