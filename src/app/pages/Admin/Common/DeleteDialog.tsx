import { Button } from '@/app/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/components/ui/dialog'
import { Trash2 } from 'lucide-react'

type DataProps = {
  onConfirm: (id: number) => void
  itemId: number
  isLoading: boolean
}

export default function DeleteDialog({ onConfirm, itemId, isLoading }: DataProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='bg-red-500 hover:bg-red-600 text-white' size='sm'>
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <div className='flex flex-col items-center text-center'>
          <div className='bg-red-100 text-red-600 rounded-full p-3 mb-2'>
            <Trash2 className='w-10 h-10' />
          </div>
          <DialogHeader className='space-y-1'>
            <DialogTitle className='text-2xl font-bold text-center'>Confirm Deletion</DialogTitle>
            <DialogDescription className='text-base text-gray-500 text-center'>
              This action cannot be undone. <br />
              All data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter className='flex justify-center gap-2 pt-4'>
          <Button className='bg-red-500 hover:bg-red-600 text-white' onClick={() => onConfirm(itemId)}>
            {isLoading ? (
              <div className='flex items-center justify-center'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                Deleting...
              </div>
            ) : (
              'Delete'
            )}
          </Button>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
