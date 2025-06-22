import { Button } from '@/app/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import type { TestCategory, TestPackageItem, TestTypeItem } from '@/app/pages/HomePage/TestPackages/models/TestPackages'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

type DataProps = {
  editItem: TestCategory | undefined
  isModalOpen: boolean
  isPending: boolean
  openModal: () => void
  closeModal: () => void
  testTypes: TestTypeItem[]
  testPackages: TestPackageItem[]
  handleEdit: (formData: TestCategory) => void
}

export default function EditTestModal({
  editItem,
  isModalOpen,
  openModal,
  closeModal,
  handleEdit,
  isPending,
  testTypes,
  testPackages
}: DataProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<TestCategory>({
    mode: 'onBlur',
    defaultValues: editItem
  })

  const onSubmit = (data: TestCategory) => {
    if (!data) return
    handleEdit(data)
  }

  useEffect(() => {
    if (editItem && isModalOpen) {
      reset(editItem)
    }
  }, [editItem, isModalOpen])

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => (open ? openModal() : closeModal())}>
      <DialogContent className='min-w-[800px] max-h-[95vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='font-bold text-2xl'>Update test</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* Name */}
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

          {/* Code */}
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

          {/* Description */}
          <div className='space-y-2'>
            <Label className='text-base'>Description</Label>
            <Textarea {...register('description')} rows={5} />
          </div>

          {/* Test packages */}
          <div className='space-y-2'>
            <Label className='text-base'>
              Test packages{' '}
              {errors.testPackages && <span className='text-red-500 font-semibold'>*Select at least 1</span>}
            </Label>

            {/* input ẩn để validate */}
            <input
              type='hidden'
              {...register('testPackages', {
                validate: (value) => (value && value.length > 0 ? true : false)
              })}
            />

            {testPackages.map((pkg) => {
              const selectedPackages = watch('testPackages') || []
              const isChecked = selectedPackages.includes(pkg.id)

              return (
                <Label key={pkg.id} className='mb-2 flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={isChecked}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...selectedPackages, pkg.id] // plus id
                        : selectedPackages.filter((id: number) => id !== pkg.id) // minus id
                      setValue('testPackages', updated, { shouldValidate: true })
                    }}
                    className='form-checkbox h-4 w-4 text-rose-600 rounded'
                  />
                  <span className='text-sm'>{pkg.name}</span>
                </Label>
              )
            })}
          </div>

          {/* Type of tests */}
          <div className='space-y-2'>
            <Label className='text-base'>
              Type of tests {errors.type_of_test_id && <span className='text-red-500 font-semibold'>*Required</span>}
            </Label>
            {testTypes.map((type) => {
              return (
                <Label key={type.id} className='flex items-center gap-2'>
                  <input
                    type='radio'
                    value={type.id}
                    checked={watch('type_of_test_id') === type.id}
                    onChange={() => {
                      setValue('type_of_test_id', type.id, { shouldValidate: true })
                    }}
                    className='form-radio h-4 w-4 text-rose-600'
                  />
                  <span className='text-sm'>{type.name}</span>
                </Label>
              )
            })}
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
