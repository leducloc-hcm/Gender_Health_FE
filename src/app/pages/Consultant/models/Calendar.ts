export interface ScheduleResponse {
  id: number
  status: string
  data: {
    id: number
    status: string
  }
}

export interface BookedBy {
  id: string
  name: string
  email?: string
}

export interface DataResponseCalendar {
  message: string
  data: SieuNhanDo[]
}

export interface SieuNhanDo {
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

export interface CalendarEvent {
  title: string
  start: string
  end: string
  extendedProps: ExtendedProps
}

export interface ExtendedProps {
  status: string
  description: string
  fullTitle: string
  id: number
}
export interface ConsultantScheduleResponse {
  message: string
  data: DataResponseCalendar[]
}
