import { Button } from '@/app/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import type { ProfileConsultantRequest } from '../models/consultant.type'
import { useForm } from 'react-hook-form'

type CreateConsultantModalProps = {
  isModalOpen: boolean
  isCreating: boolean
  openModal: () => void
  handleCancel: () => void
  handleCreate: (formData: ProfileConsultantRequest) => void
}

export default function CreateConsultantModal({
  isModalOpen,
  isCreating,
  openModal,
  handleCancel,
  handleCreate
}: CreateConsultantModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProfileConsultantRequest>({
    mode: 'onBlur'
  })

  const onSubmit = (data: ProfileConsultantRequest) => {
    handleCreate(data)
    reset()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => (open ? openModal() : handleCancel())}>
      <DialogContent className='min-w-[600px] max-h-[95vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='font-bold text-2xl'>Create New Consultant</DialogTitle>
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
              Username {errors.username && <span className='text-red-500 font-semibold'>*Required</span>}
            </Label>
            <Input
              type='text'
              className={`${errors.username && 'border-red-500'}`}
              {...register('username', { required: true })}
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-base'>
              Email {errors.email && <span className='text-red-500 font-semibold'>*Required</span>}
            </Label>
            <Input
              type='email'
              className={`${errors.email && 'border-red-500'}`}
              {...register('email', { required: true })}
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-base'>
              Password {errors.password && <span className='text-red-500 font-semibold'>*Required</span>}
            </Label>
            <Input
              type='password'
              className={`${errors.password && 'border-red-500'}`}
              {...register('password', { required: true, minLength: 6 })}
            />
            {errors.password?.type === 'minLength' && (
              <span className='text-red-500 text-sm'>Password must be at least 6 characters</span>
            )}
          </div>

          <div className='space-y-2'>
            <Label className='text-base'>
              Phone Number {errors.phone_number && <span className='text-red-500 font-semibold'>*Required</span>}
            </Label>
            <Input
              type='text'
              className={`${errors.phone_number && 'border-red-500'}`}
              {...register('phone_number', { required: true })}
            />
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
              disabled={isCreating}
            >
              {isCreating ? (
                <div className='flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                  Creating...
                </div>
              ) : (
                'Create Consultant'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
