import { signify } from 'react-signify'

export const sStaffSchedule = signify([
  {
    createdAt: '',
    dismissedAt: '',
    id: 0,
    message: '',
    metadata: {
      consultantWorkScheduleId: 0
    },
    orderId: 0,
    paymentId: 0,
    questionId: 0,
    readAt: '',
    recipientId: 0,
    replyId: 0,
    status: '',
    title: '',
    type: ''
  }
])

export const setStaffSchedule = (data: any) => {
  sStaffSchedule.set((prev) => {
    prev.value = data
  })
}
