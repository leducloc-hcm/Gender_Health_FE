import { Button } from '@/app/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import type { AddUpdateTestTypeItem } from '@/app/pages/HomePage/TestPackages/models/TestPackages'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

type DataProps = {
  isModalOpen: boolean
  isPending: boolean
  openModal: () => void
  closeModal: () => void
  handleCreate: (formData: AddUpdateTestTypeItem) => void
}

export default function AddTypeOfTestModal({ isModalOpen, openModal, closeModal, isPending, handleCreate }: DataProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AddUpdateTestTypeItem>({
    mode: 'onBlur'
  })

  const onSubmit = (data: AddUpdateTestTypeItem) => {
    if (!data) return
    handleCreate(data)
  }

  useEffect(() => {
    if (isModalOpen) {
      reset()
    }
  }, [isModalOpen])

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => (open ? openModal() : closeModal())}>
      <DialogContent className='min-w-[500px] max-h-[95vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='font-bold text-2xl'>Add new type of test</DialogTitle>
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
                  Creating...
                </div>
              ) : (
                'Create'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
