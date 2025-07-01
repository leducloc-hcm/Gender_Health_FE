import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import dayjs from 'dayjs'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Edit } from 'lucide-react'
import DeleteDialog from '@/app/pages/Admin/Common/DeleteDialog'
import type { SpecialtyDataResponse } from '../Models/SpecialtyManagement'

type DataProps = {
  viewItem: SpecialtyDataResponse | undefined
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
  onEdit: (specialty: SpecialtyDataResponse) => void
  onDelete: (id: number) => void
  isDeleting?: boolean
}

export default function ViewSpecialtyModal({
  viewItem,
  isModalOpen,
  openModal,
  closeModal,
  onEdit,
  onDelete,
  isDeleting = false
}: DataProps) {
  if (!viewItem) return null

  const handleEdit = () => {
    onEdit(viewItem)
    closeModal()
  }

  const handleDelete = (id: number) => {
    onDelete(id)
    closeModal()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => (open ? openModal() : closeModal())}>
      <DialogContent className='min-w-[600px] max-h-[95vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='font-bold text-2xl mb-4'>Specialty Detail - {viewItem.name}</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          <div className='grid grid-cols-1 gap-4'>
            <div>
              <div className='text-sm text-gray-500'>ID</div>
              <div className='font-medium text-gray-800'>#{viewItem.id}</div>
            </div>

            <div>
              <div className='text-sm text-gray-500'>Name</div>
              <div className='font-medium text-gray-800'>{viewItem.name}</div>
            </div>

            <div>
              <div className='text-sm text-gray-500'>Description</div>
              <div className='font-medium text-gray-800'>{viewItem.description || 'No description'}</div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='text-sm text-gray-500'>Created Date</div>
                <div className='font-medium text-gray-800'>{dayjs(viewItem.createdAt).format('DD/MM/YYYY HH:mm')}</div>
              </div>
              <div>
                <div className='text-sm text-gray-500'>Updated Date</div>
                <div className='font-medium text-gray-800'>{dayjs(viewItem.updatedAt).format('DD/MM/YYYY HH:mm')}</div>
              </div>
            </div>

            <div>
              <div className='text-sm text-gray-500 mb-2'>Assigned Consultants</div>
              {viewItem.consultantSpecialties && viewItem.consultantSpecialties.length > 0 ? (
                <div className='space-y-2'>
                  {viewItem.consultantSpecialties.map((consultant) => (
                    <Badge key={consultant.consultantProfileId} variant='secondary' className='mr-2'>
                      {consultant.consultantProfile.name} ({consultant.consultantProfile.username})
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className='text-gray-500 italic'>No consultants assigned</div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className='flex justify-between'>
          <div className='flex gap-2'>
            <Button type='button' variant='outline' onClick={handleEdit} className='flex items-center gap-2'>
              <Edit size={16} />
              Edit
            </Button>
            <DeleteDialog onConfirm={handleDelete} itemId={viewItem.id} isLoading={isDeleting} />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
