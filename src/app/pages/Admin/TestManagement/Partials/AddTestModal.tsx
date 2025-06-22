import { Button } from '@/app/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import type {
  AddUpdateTestCategory,
  TestPackageItem,
  TestTypeItem
} from '@/app/pages/HomePage/TestPackages/models/TestPackages'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

type DataProps = {
  isModalOpen: boolean
  isPending: boolean
  openModal: () => void
  closeModal: () => void
  testTypes: TestTypeItem[]
  testPackages: TestPackageItem[]
  handleCreate: (formData: AddUpdateTestCategory) => void
}

export default function AddTestModal({
  isModalOpen,
  openModal,
  closeModal,
  isPending,
  handleCreate,
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
  } = useForm<AddUpdateTestCategory>({
    mode: 'onBlur',
    defaultValues: {
      testPackages: []
    }
  })

  const onSubmit = (data: AddUpdateTestCategory) => {
    if (!data) return
    // console.log('data.type_of_test_id.', typeof data.type_of_test_id)
    // console.log('data.type_of_test_id.', data.type_of_test_id)
    handleCreate(data)
  }

  useEffect(() => {
    if (isModalOpen) {
      reset()
    }
  }, [isModalOpen])

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => (open ? openModal() : closeModal())}>
      <DialogContent className='min-w-[800px] max-h-[95vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='font-bold text-2xl'>Create new test</DialogTitle>
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

                      setValue('testPackages', updated)
                    }}
                    className='form-checkbox h-4 w-4 text-rose-600 rounded'
                  />
                  <span className='text-sm'>{pkg.name}</span>
                </Label>
              )
            })}
          </div>

          <div className='space-y-2'>
            <Label className='text-base'>
              Type of tests {errors.type_of_test_id && <span className='text-red-500 font-semibold'>*Required</span>}
            </Label>

            {/* input ẩn để validate */}
            <input
              type='hidden'
              {...register('type_of_test_id', {
                validate: (value) => (value ? true : false)
              })}
            />

            {testTypes.map((type) => (
              <Label key={type.id} className='flex items-center gap-2'>
                <input
                  type='radio'
                  value={type.id}
                  checked={watch('type_of_test_id') === type.id}
                  onChange={() => setValue('type_of_test_id', type.id, { shouldValidate: true })}
                  className='form-radio h-4 w-4 text-rose-600'
                />
                <span className='text-sm'>{type.name}</span>
              </Label>
            ))}
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
