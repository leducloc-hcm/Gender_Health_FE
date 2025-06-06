import type { RegisterOptions } from 'react-hook-form'
import type { ConsultantFormData } from '../models/Consultant'

export const titleCalendarValidation = {
  required: 'Title is required',
  minLength: {
    value: 2,
    message: 'Title must be at least 2 characters'
  },
  maxLength: {
    value: 100,
    message: 'Title must be at most 100 characters'
  }
}

export const descriptionCalendarValidation = {
  required: 'Description is required'
}
export const dateCalendarValidation: RegisterOptions<ConsultantFormData, 'date'> = {
  required: 'Date is required',
  validate: {
    isValidDate: (value) => {
      if (!(value instanceof Date) || isNaN(value.getTime())) {
        return 'Please select a valid date'
      }
      return true
    },
    isNotPast: (value) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Đặt giờ về 00:00:00 để so sánh chính xác

      if (value < today) {
        return 'Date cannot be in the past'
      }
      return true
    }
  }
}
export const startTimeCalendarValidation: RegisterOptions<ConsultantFormData, 'startTime'> = {
  required: 'Start time is required',
  validate: {
    isValidTime: (value) => {
      // Kiểm tra xem giá trị thời gian có hợp lệ không
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/ // Định dạng HH:mm (24h)
      if (!timeRegex.test(value)) {
        return 'Please enter a valid time in HH:mm format'
      }
      return true
    },
    isNotPastForToday: (value, formValues) => {
      // Lấy ngày hiện tại và thời gian hiện tại (04:03 PM +07, 03/06/2025)
      const today = new Date()
      today.setHours(16, 3, 0, 0) // 04:03 PM +07

      // Lấy ngày được chọn từ form
      const selectedDate = formValues.date instanceof Date ? formValues.date : null

      // Nếu ngày được chọn là hôm nay, kiểm tra startTime không được sớm hơn thời gian hiện tại
      if (selectedDate && selectedDate.toDateString() === today.toDateString()) {
        const [hours, minutes] = value.split(':').map(Number)
        const selectedTime = new Date(selectedDate)
        selectedTime.setHours(hours, minutes, 0, 0)

        if (selectedTime < today) {
          return 'Start time cannot be earlier than current time (04:03 PM) for today'
        }
      }
      return true
    }
  }
}

// Validation rules for the endTime field
export const endTimeCalendarValidation: RegisterOptions<ConsultantFormData, 'endTime'> = {
  required: 'End time is required',
  validate: {
    isValidTime: (value) => {
      // Kiểm tra xem giá trị thời gian có hợp lệ không
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/ // Định dạng HH:mm (24h)
      if (!timeRegex.test(value)) {
        return 'Please enter a valid time in HH:mm format'
      }
      return true
    },
    isAfterStartTime: (value, formValues) => {
      // Kiểm tra endTime phải sau startTime
      const startTime = formValues.startTime
      if (!startTime || !value) return true // Nếu một trong hai chưa có giá trị, bỏ qua

      const [startHours, startMinutes] = startTime.split(':').map(Number)
      const [endHours, endMinutes] = value.split(':').map(Number)

      const start = new Date()
      start.setHours(startHours, startMinutes, 0, 0)
      const end = new Date()
      end.setHours(endHours, endMinutes, 0, 0)

      if (end <= start) {
        return 'End time must be later than start time'
      }
      return true
    }
  }
}
