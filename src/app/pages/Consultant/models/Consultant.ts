export interface ConsultantFormData {
  consultantProfileId: number
  title: string
  description: string
  date: Date | string
  startTime: string
  endTime: string
  consultant_profile_id?: number
}

export interface CalendarEvent {
  title: string
  start: string
  end: string
  extendedProps?: {
    description: string
  }
}
