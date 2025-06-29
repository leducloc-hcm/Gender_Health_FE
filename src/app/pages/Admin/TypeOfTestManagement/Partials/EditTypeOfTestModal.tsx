import { Button } from '@/app/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import type { TestTypeItem } from '@/app/pages/HomePage/TestPackages/models/TestPackages'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type DataProps = {
  editItem: TestTypeItem | undefined
  isModalOpen: boolean
  isPending: boolean
  openModal: () => void
  closeModal: () => void
  handleEdit: (formData: TestTypeItem) => void
}

export default function EditTypeOfTestModal({
  editItem,
  isModalOpen,
  openModal,
  closeModal,
  handleEdit,
  isPending
}: DataProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<TestTypeItem>({
    mode: 'onBlur'
  })

  const onSubmit = (data: TestTypeItem) => {
    if (!editItem) return

    const hasChanged =
      data.name !== editItem.name || data.code !== editItem.code || data.description !== editItem.description

    if (hasChanged) {
      handleEdit(data)
    } else {
      toast.error('No changes were made.')
    }
  }

  useEffect(() => {
    if (editItem && isModalOpen) {
      reset(editItem)
    }
  }, [editItem, isModalOpen])

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => (open ? openModal() : closeModal())}>
      <DialogContent className='min-w-[500px] max-h-[95vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='font-bold text-2xl'>Update type of test</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label className='text-base'>
              Name {errors.name && <span className='text-red-500 font-semibold'>*Required</span>}
            </Label>
            <Input
              type='text'
              className={`${errors.name && 'border-red-500'}`}
              {...register('name', { required: true })}
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-base'>
              Code {errors.code && <span className='text-red-500 font-semibold'>*Required</span>}
            </Label>
            <Input
              type='text'
              className={`${errors.code && 'border-red-500'}`}
              {...register('code', { required: true })}
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-base'>Description</Label>
            <Textarea {...register('description')} rows={5} />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='secondary'>
                Close
              </Button>
            </DialogClose>

            <Button
              type='submit'
              className='bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isPending ? (
                <div className='flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                  Saving...
                </div>
              ) : (
                'Save changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
