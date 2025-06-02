import { profileApi } from '@/app/apis/profile.api'
import type { getProfileResult } from '@/app/pages/Customer/Profile/models/Profile'

import { useForm } from 'react-hook-form'
import type { OrderFormRequest, TestPackageItem } from '../models/TestPackages'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Calendar } from '@/app/components/ui/calendar'
import { Form, FormControl, FormField, FormItem } from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { toast } from 'react-toastify'
import { CalendarIcon, X } from 'lucide-react'
import { Label } from '@/app/components/ui/label'
import { testApi } from '@/app/apis/test.api'
import { Textarea } from '@/app/components/ui/textarea'
import { cn } from '@/app/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import { Skeleton } from '@/app/components/ui/skeleton'

type OrderModalProps = {
  id: number
  handleCloseModal: () => void
  isOpen: boolean
}

export default function OrderModal({ id, handleCloseModal, isOpen }: OrderModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingOrder, setIsLoadingOrder] = useState<boolean>(false)
  const [userProfile, setUserProfile] = useState<getProfileResult | null>(null)
  const [packageDetail, setPackgeDetail] = useState<TestPackageItem | null>(null)

  const form = useForm<OrderFormRequest>({
    mode: 'onBlur',
    defaultValues: {
      address: '',
      phone: '',
      note: '',
      preferred_date: undefined
    }
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = form

  // Function onSubmit
  const onSubmit = async (data: OrderFormRequest) => {
    try {
      setIsLoadingOrder(true)
      const payload = {
        ...data,
        preferred_date: data.preferred_date ? new Date(data.preferred_date).toISOString() : undefined,
        test_package_ids: [id],
        customer_profile_id: userProfile?.id || 0
      }

      console.log('Submitting payload:', payload)
      toast.success('Order placed successfully!')
      handleCloseModal()
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to place order')
    } finally {
      setIsLoadingOrder(false)
    }
  }

  // Function fetch getUserProfile & getDetailTestPackage
  async function fetchAllData(): Promise<void> {
    try {
      setIsLoading(true)

      const [packageRes, profileRes] = await Promise.all([testApi.getDetailTestPackage(id), profileApi.getProfile()])
      setUserProfile(profileRes.result)
      setPackgeDetail(packageRes.data)

      reset({
        phone: profileRes.result.phone_number || '',
        address: profileRes.result.location || '',
        preferred_date: undefined,
        note: ''
      })
    } catch (error: any) {
      console.error('Failed to fetch test data:', error)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchAllData()
    }
  }, [id, isOpen])

  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
        <Card className='w-full max-w-xl bg-white shadow-2xl border-0 rounded-2xl overflow-hidden'>
          <div className='relative'>
            <button
              onClick={handleCloseModal}
              className='absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors'
            >
              <X className='w-4 h-4 text-gray-600' />
            </button>
            <CardHeader className='text-center px-10 pt-8 pb-6'>
              <div className='w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <CalendarIcon className='h-10 w-10 text-pink-500' />
              </div>

              <CardTitle className='text-3xl font-bold text-gray-900 mb-2'>Book Your Test</CardTitle>

              <p className='text-gray-600 text-base leading-relaxed font-semibold italic'>
                Please fill in your details to book your test package. <br /> We'll contact you.
              </p>
            </CardHeader>
            <CardContent className='px-10 pb-8'>
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-1'>
                  <div className='grid grid-cols-2 gap-3'>
                    {/* user name */}
                    <FormItem>
                      <Label>Your Name</Label>
                      {isLoading ? (
                        <Skeleton className='h-10 w-full rounded-md' />
                      ) : (
                        <>
                          <Input
                            readOnly
                            defaultValue={userProfile?.name}
                            className='w-full px-3 py-3 border border-gray-300 rounded-lg'
                          />
                          <p className='text-xs min-h-[3px] mt-1 invisible'>placeholder</p>
                        </>
                      )}
                    </FormItem>
                    {/* phone number */}
                    <FormField
                      control={control}
                      name='phone'
                      rules={{ required: 'Phone Number is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <Label>
                            <span className='text-red-500'>*</span>Phone Number
                          </Label>
                          {isLoading ? (
                            <Skeleton className='h-10 w-full rounded-md' />
                          ) : (
                            <>
                              <FormControl>
                                <Input
                                  type='tel'
                                  placeholder='Enter your phone number'
                                  {...field}
                                  className='w-full px-3 py-3 border border-gray-300 rounded-lg'
                                />
                              </FormControl>
                              <p className={`text-xs min-h-[3px] mt-1 ${errors.phone ? 'text-red-500' : 'invisible'}`}>
                                {errors.phone ? errors.phone.message : 'placeholder'}
                              </p>
                            </>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* address */}
                  <FormField
                    control={control}
                    name='address'
                    rules={{ required: 'Address is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <Label>
                          <span className='text-red-500'>*</span>Address
                        </Label>
                        {isLoading ? (
                          <Skeleton className='h-10 w-full rounded-md' />
                        ) : (
                          <>
                            <FormControl>
                              <Input
                                placeholder='Enter your address'
                                {...field}
                                className='w-full px-3 py-3 border border-gray-300 rounded-lg'
                              />
                            </FormControl>
                            <p className={`text-xs min-h-[3px] mt-1 ${errors.address ? 'text-red-500' : 'invisible'}`}>
                              {errors.address ? errors.address.message : 'placeholder'}
                            </p>
                          </>
                        )}
                      </FormItem>
                    )}
                  />

                  <div className='grid grid-cols-2 gap-3'>
                    {/* Test Package Name */}
                    <FormItem>
                      <Label>Test Package Name</Label>
                      {isLoading ? (
                        <Skeleton className='h-10 w-full rounded-md' />
                      ) : (
                        <>
                          <Input
                            readOnly
                            defaultValue={packageDetail?.name}
                            className='w-full px-3 py-3 border border-gray-300 rounded-lg'
                          />
                          <p className='text-xs min-h-[3px] mt-1 invisible'>placeholder</p>
                        </>
                      )}
                    </FormItem>
                    {/* preferred_date */}
                    <FormField
                      control={control}
                      name='preferred_date'
                      rules={{ required: 'Preferred Date is required' }}
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <Label>
                            <span className='text-red-500'>*</span>Preferred Date
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  className={cn(
                                    'w-full px-3 py-3 text-left font-normal border border-gray-300 rounded-lg',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? new Date(field.value).toLocaleDateString('en-GB') : 'Pick a date'}
                                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0' align='start'>
                              <Calendar
                                mode='single'
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <p
                            className={`text-xs min-h-[3px] mt-1 ${errors.preferred_date ? 'text-red-500' : 'invisible'}`}
                          >
                            {errors.preferred_date ? errors.preferred_date.message : 'placeholder'}
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* note */}
                  <FormField
                    control={control}
                    name='note'
                    render={({ field }) => (
                      <FormItem>
                        <Label>Additional Notes</Label>
                        <FormControl>
                          <Textarea
                            placeholder='Any additional information or special requests...'
                            {...field}
                            className='w-full px-3 py-3 border border-gray-300 rounded-lg min-h-[100px] resize-none'
                          />
                        </FormControl>
                        <p className='text-xs min-h-[3px] mt-1 invisible'>placeholder</p>
                      </FormItem>
                    )}
                  />
                  <Button
                    type='submit'
                    className='w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-lg font-medium transition-colors'
                  >
                    {isLoadingOrder ? 'Placing order ...' : 'Order'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </div>
        </Card>
      </div>
    </>
  )
}
