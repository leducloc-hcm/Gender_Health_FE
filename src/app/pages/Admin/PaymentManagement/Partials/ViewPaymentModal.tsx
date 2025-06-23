import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import dayjs from 'dayjs'
import { Button } from '@/app/components/ui/button'
import type { PaymentDetail } from '@/app/pages/HomePage/TestPackages/models/PaymentTest'
import { getStatusBadge } from '../PaymentManagement'

type DataProps = {
  viewItem: PaymentDetail | undefined
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export default function ViewPaymentModal({ viewItem, isModalOpen, openModal, closeModal }: DataProps) {
  if (!viewItem) return null

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => (open ? openModal() : closeModal())}>
      <DialogContent className='min-w-[600px] max-h-[95vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='font-bold text-2xl mb-4'>Payment Detail - No. {viewItem.id}</DialogTitle>{' '}
        </DialogHeader>

        <div className='space-y-6'>
          {/* Customer Info */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <div className='text-sm text-gray-500'>Customer</div>
              <div className='font-medium text-gray-800'>{viewItem.order?.customerProfile?.name || 'No name'}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Phone</div>
              <div className='font-medium text-gray-800'>{viewItem.order?.phone || 'No phone'}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Address</div>
              <div className='font-medium text-gray-800'>{viewItem.order?.address || 'No address'}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Invoice Code</div>
              <div className='font-medium text-gray-800'>{viewItem.invoice_code || 'N/A'}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Created Date</div>
              <div className='font-medium text-gray-800'>{dayjs(viewItem.created_date).format('DD/MM/YYYY')}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Status</div>
              <div className='font-medium text-gray-800'>{getStatusBadge(viewItem.status)}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Amount</div>
              <div className='font-medium text-gray-800'>{Number(viewItem.amount).toLocaleString('vi-VN')}₫</div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='outline'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
