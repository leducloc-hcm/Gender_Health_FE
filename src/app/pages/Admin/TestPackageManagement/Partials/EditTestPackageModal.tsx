import { Button } from '@/app/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import type { TestCategory, TestPackageItem, TestTypeItem } from '@/app/pages/HomePage/TestPackages/models/TestPackages'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type DataEditModalProps = {
  editItem: TestPackageItem | undefined
  testTypes: TestTypeItem[]
  isModalOpen: boolean
  isUpdating: boolean
  openModal: () => void
  handleCancel: () => void
  handleEdit: (formData: TestPackageItem) => void
}

export default function EditTestPackageModal({
  editItem,
  testTypes,
  isModalOpen,
  isUpdating,
  openModal,
  handleCancel,
  handleEdit
}: DataEditModalProps) {
  // console.log('🚀 ~ EditTestPackageModal ~ editItem:', editItem)

  const areTestArraysEqual = (a: TestCategory[], b: TestCategory[]) => {
    const aIds = a.map((t) => t.id).sort()
    const bIds = b.map((t) => t.id).sort()
    if (aIds.length !== bIds.length) return false
    return aIds.every((id, idx) => id === bIds[idx])
  }

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm<TestPackageItem>({
    mode: 'onBlur'
  })

  const onSubmit = (data: TestPackageItem) => {
    if (!editItem) return

    const hasChanged =
      data.name !== editItem.name ||
      data.code !== editItem.code ||
      data.description !== editItem.description ||
      data.price !== editItem.price ||
      !areTestArraysEqual(data.tests, editItem.tests)

    if (hasChanged) {
      handleEdit(data)
    } else {
      toast.error('No changes were made.')
    }
  }

  useEffect(() => {
    if (testTypes && editItem && isModalOpen) {
      reset(editItem)
    }
  }, [editItem, isModalOpen])

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => (open ? openModal() : handleCancel())}>
      <DialogContent className='min-w-[900px] max-h-[95vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='font-bold text-2xl'>Update test package</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-2 gap-2'>
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
          </div>

          <div className='space-y-2'>
            <Label className='text-base'>
              Price (VND) {errors.price && <span className='text-red-500 font-semibold'>*Required</span>}
            </Label>
            <Input
              className={`${errors.price && 'border-red-500'}`}
              type='number'
              step='0.01'
              {...register('price', { required: true, valueAsNumber: true })}
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-base'>Type of tests:</Label>
            {testTypes.map((type) => (
              <div key={type.id}>
                <Label className='mb-2 text-gray-700'>- {type.name}:</Label>
                <div className='flex flex-wrap gap-2'>
                  {type.tests.map((test) => {
                    const isChecked = watch('tests')?.some((t) => t.id === test.id) || false
                    return (
                      <Label key={test.id}>
                        <input
                          type='checkbox'
                          checked={isChecked}
                          onChange={(e) => {
                            const current = watch('tests') || []
                            if (e.target.checked) {
                              setValue('tests', [...current, test])
                            } else {
                              setValue(
                                'tests',
                                current.filter((t) => t.id !== test.id)
                              )
                            }
                          }}
                          className='form-checkbox h-4 w-4 text-rose-600 rounded'
                        />
                        <span className='text-sm'>{test.name}</span>
                      </Label>
                    )
                  })}
                </div>
              </div>
            ))}
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
            >
              {isUpdating ? (
                <div className='flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                  Saving...
                </div>
              ) : (
                ' Save changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
