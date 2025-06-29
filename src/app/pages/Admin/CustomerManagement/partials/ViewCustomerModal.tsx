import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import dayjs from 'dayjs'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Separator } from '@/app/components/ui/separator'
import type { CustomerData } from '../models/customerManagement.type'

type DataProps = {
  viewItem: CustomerData | undefined
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const getStatusBadge = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return <Badge className='bg-yellow-100 text-yellow-800'>Pending</Badge>
    case 'COMPLETED':
      return <Badge className='bg-green-100 text-green-800'>Completed</Badge>
    case 'CANCELLED':
      return <Badge className='bg-red-100 text-red-800'>Cancelled</Badge>
    case 'PROCESSING':
      return <Badge className='bg-blue-100 text-blue-800'>Processing</Badge>
    default:
      return <Badge className='bg-gray-100 text-gray-800'>{status}</Badge>
  }
}

export default function ViewCustomerModal({ viewItem, isModalOpen, openModal, closeModal }: DataProps) {
  if (!viewItem) return null

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => (open ? openModal() : closeModal())}>
      <DialogContent className='min-w-[800px] max-h-[95vh] '>
        <DialogHeader>
          <DialogTitle className='font-bold text-2xl mb-4'>Customer Detail - {viewItem.name}</DialogTitle>
        </DialogHeader>

        <div className='space-y-6 overflow-y-auto max-h-[73vh]'>
          {/* Customer Info */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <div className='text-sm text-gray-500'>Name</div>
              <div className='font-medium text-gray-800'>{viewItem.name}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Username</div>
              <div className='font-medium text-gray-800'>{viewItem.username}</div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Date of Birth</div>
              <div className='font-medium text-gray-800'>
                {viewItem.dateOfBirth ? dayjs(viewItem.dateOfBirth).format('DD/MM/YYYY') : 'N/A'}
              </div>
            </div>
            <div>
              <div className='text-sm text-gray-500'>Avatar</div>
              <div className='font-medium text-gray-800'>
                {viewItem.avatar ? (
                  <img src={viewItem.avatar} alt='Avatar' className='w-16 h-16 rounded-full object-cover' />
                ) : (
                  'No avatar'
                )}
              </div>
            </div>
            <div className='col-span-2'>
              <div className='text-sm text-gray-500'>Description</div>
              <div className='font-medium text-gray-800'>{viewItem.description || 'No description'}</div>
            </div>
          </div>

          <Separator />

          {/* Orders Section */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Orders ({viewItem.orders.length})</h3>
            {viewItem.orders.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>No orders found</div>
            ) : (
              <div className='space-y-4'>
                {viewItem.orders.map((order) => (
                  <div key={order.id} className='border rounded-lg p-4 bg-gray-50'>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                      <div>
                        <div className='text-xs text-gray-500'>Order ID</div>
                        <div className='font-medium'>{order.id}</div>
                      </div>
                      <div>
                        <div className='text-xs text-gray-500'>Status</div>
                        <div>{getStatusBadge(order.status)}</div>
                      </div>
                      <div>
                        <div className='text-xs text-gray-500'>Created Date</div>
                        <div className='font-medium'>{dayjs(order.created_at).format('DD/MM/YYYY HH:mm')}</div>
                      </div>
                      <div>
                        <div className='text-xs text-gray-500'>Total Amount</div>
                        <div className='font-medium text-green-600'>
                          {Number(order.total_amount).toLocaleString('vi-VN')}₫
                        </div>
                      </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                      <div>
                        <div className='text-xs text-gray-500'>Phone</div>
                        <div className='font-medium'>{order.phone || 'N/A'}</div>
                      </div>
                      <div>
                        <div className='text-xs text-gray-500'>Address</div>
                        <div className='font-medium'>{order.address || 'N/A'}</div>
                      </div>
                    </div>

                    {order.note && (
                      <div className='mb-4'>
                        <div className='text-xs text-gray-500'>Note</div>
                        <div className='font-medium'>{order.note}</div>
                      </div>
                    )}

                    {/* Order Items */}
                    <div>
                      <div className='text-sm font-medium text-gray-700 mb-2'>
                        Order Items ({order.orderItems.length})
                      </div>
                      {order.orderItems.length === 0 ? (
                        <div className='text-sm text-gray-500 italic'>No items in this order</div>
                      ) : (
                        <div className='space-y-2'>
                          {order.orderItems.map((item) => (
                            <div key={item.id} className='bg-white rounded border p-3'>
                              <div className='grid grid-cols-3 gap-4'>
                                <div>
                                  <div className='text-xs text-gray-500'>Item Code</div>
                                  <div className='font-medium text-sm'>{item.code}</div>
                                </div>
                                <div>
                                  <div className='text-xs text-gray-500'>Item Name</div>
                                  <div className='font-medium text-sm'>{item.name}</div>
                                </div>
                                <div>
                                  <div className='text-xs text-gray-500'>Price</div>
                                  <div className='font-medium text-sm text-green-600'>
                                    {Number(item.final_price).toLocaleString('vi-VN')}₫
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
