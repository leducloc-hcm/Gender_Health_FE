import { Button } from '@/app/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import type { ProfileConsultantData } from '../models/consultant.type'
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'

type EditConsultantModalProps = {
  editItem: ProfileConsultantData | undefined
  isModalOpen: boolean
  isUpdating: boolean
  openModal: () => void
  handleCancel: () => void
  handleEdit: (formData: ProfileConsultantData) => void
}

export default function EditConsultantModal({
  editItem,
  isModalOpen,
  isUpdating,
  openModal,
  handleCancel,
  handleEdit
}: EditConsultantModalProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors }
  } = useForm<ProfileConsultantData>({
    mode: 'onBlur'
  })

  const onSubmit = (data: ProfileConsultantData) => {
    if (!editItem) return

    const hasChanged = Object.keys(data).some((key) => {
      const dataKey = key as keyof ProfileConsultantData
      return data[dataKey] !== editItem[dataKey]
    })

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
  }, [editItem, isModalOpen, reset])

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => (open ? openModal() : handleCancel())}>
      <DialogContent className='min-w-[900px] max-h-[95vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='font-bold text-2xl'>Update Consultant</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
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
          </div>

          <div className='grid grid-cols-2 gap-4'>
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
                Phone Number {errors.phone_number && <span className='text-red-500 font-semibold'>*Required</span>}
              </Label>
              <Input
                type='text'
                className={`${errors.phone_number && 'border-red-500'}`}
                {...register('phone_number', { required: true })}
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label className='text-base'>Location</Label>
              <Input type='text' {...register('location')} />
            </div>

            <div className='space-y-2'>
              <Label className='text-base'>
                Status {errors.status && <span className='text-red-500 font-semibold'>*Required</span>}
              </Label>
              <Controller
                name='status'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={`${errors.status && 'border-red-500'}`}>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='inactive'>Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label className='text-base'>Degree</Label>
              <Input type='text' {...register('degree')} />
            </div>

            <div className='space-y-2'>
              <Label className='text-base'>Hospital</Label>
              <Input type='text' {...register('hospital')} />
            </div>
          </div>

          <div className='space-y-2'>
            <Label className='text-base'>Bio</Label>
            <Textarea {...register('bio')} rows={3} />
          </div>

          <div className='space-y-2'>
            <Label className='text-base'>Description</Label>
            <Textarea {...register('description')} rows={4} />
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
              disabled={isUpdating}
            >
              {isUpdating ? (
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
