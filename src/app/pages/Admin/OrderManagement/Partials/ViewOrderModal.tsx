import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import type { OrderData } from '@/app/pages/HomePage/TestPackages/models/OrderTest'
import { getStatusBadge } from '../OrderManagement'
import dayjs from 'dayjs'
import { Button } from '@/app/components/ui/button'

type DataProps = {
  viewItem: OrderData | undefined
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export default function ViewOrderModal({ viewItem, isModalOpen, openModal, closeModal }: DataProps) {
  if (!viewItem) return null

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => (open ? openModal() : closeModal())}>
      <DialogContent className='min-w-[600px] max-h-[95vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='font-bold text-2xl mb-4'>Order Detail - No. {viewItem.id}</DialogTitle>{' '}
        </DialogHeader>

        {/* <div className='grid grid-cols-2 gap-4 text-lg text-gray-700 mb-4'>
          <div>
            <strong>Customer:</strong> {viewItem.customerProfile?.name || 'N/A'}
          </div>
          <div>
            <strong>Phone:</strong> {viewItem.phone}
          </div>
          <div>
            <strong>Address:</strong> {viewItem.address}
          </div>
          <div>
            <strong>Status:</strong> {getStatusBadge(viewItem.status)}
          </div>
          <div>
            <strong>Total Amount:</strong> {Number(viewItem.total_amount).toLocaleString('vi-VN')}₫
          </div>
          <div>
            <strong>Created At:</strong> {dayjs(viewItem.created_at).format('DD/MM/YYYY')}
          </div>
          <div className='col-span-2'>
            <strong>Note:</strong> {viewItem.note || 'No note'}
          </div>
        </div> */}

         <div className='space-y-6'>
          {/* Customer Info */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <div className='text-sm text-gray-500'>Customer</div>
              <div className='font-medium text-gray-800'>{viewItem.customerProfile?.name || 'No name'}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Phone</div>
              <div className='font-medium text-gray-800'>{viewItem.phone}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Address</div>
              <div className='font-medium text-gray-800'>{viewItem.address}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Created at</div>
              <div className='font-medium text-gray-800'>{dayjs(viewItem.created_at).format('DD/MM/YYYY')}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Status</div>
              <div className='font-medium text-gray-800'>
                {getStatusBadge(viewItem.status)}
              </div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Total Amount</div>
              <div className='font-medium text-gray-800'>
                {Number(viewItem.total_amount).toLocaleString('vi-VN')}₫
              </div>
            </div>
            {viewItem.note && (
              <div className='col-span-2'>
                <div className='text-sm text-gray-500'>Note</div>
                <div className='text-gray-700'>{viewItem.note}</div>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div>
            <div className='text-lg font-semibold mb-2'>Order Items</div>
            <div className='border rounded-md divide-y'>
              {viewItem.orderItems.map((item) => (
                <div key={item.id} className='p-3 grid grid-cols-4 gap-3 text-sm text-gray-700'>
                  <div className='font-medium col-span-2'>{item.name}</div>
                  <div>{Number(item.final_price).toLocaleString('vi-VN')}₫</div>
                  <div className='text-gray-500'>{dayjs(item.testDate).format('DD/MM/YYYY')}</div>
                </div>
              ))}
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
