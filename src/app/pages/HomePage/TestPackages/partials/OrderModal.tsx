import { orderApi } from '@/app/apis/order.api'
import { paymentApi } from '@/app/apis/payment.api'
import { testApi } from '@/app/apis/test.api'
import { Button } from '@/app/components/ui/button'
import { Calendar } from '@/app/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Form, FormControl, FormField, FormItem } from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import { Skeleton } from '@/app/components/ui/skeleton'
import { Textarea } from '@/app/components/ui/textarea'
import { sUserProfile } from '@/app/hooks/sUserProfile'
import { cn } from '@/app/lib/utils'
import { telValidation } from '@/app/modules/AuthValidation/AuthValidation'
import dayjs from 'dayjs'
import { CalendarIcon, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import type { OrderFormData, OrderFormRequest, OrderFormResponse } from '../models/OrderTest'
import type { PaymentRequest, PaymentResponse } from '../models/PaymentTest'
import type { TestPackageItem } from '../models/TestPackages'

type OrderModalProps = {
  id: number
  handleCloseModal: () => void
  isOpen: boolean
}

export default function OrderModal({ id, handleCloseModal, isOpen }: OrderModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingOrder, setIsLoadingOrder] = useState<boolean>(false)
  const [packageDetail, setPackgeDetail] = useState<TestPackageItem | null>(null)

  const form = useForm<OrderFormData>({
    mode: 'onBlur',
    defaultValues: {
      address: '',
      phone: '',
      note: '',
      test_date: undefined
    }
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = form

  // Function onSubmit
  const onSubmit = async (data: OrderFormData) => {
    setIsLoadingOrder(true)
    try {
      const orderPayload: OrderFormRequest = {
        ...data,
        test_date: data.test_date ? dayjs(data.test_date).format('YYYY-MM-DD') : undefined,
        test_package_id: id,
        customer_profile_id: sUserProfile.value ? sUserProfile.value?.customer_profile_id : 0
      }
      console.log('Submitting payload:', orderPayload)
      const orderResponse: OrderFormResponse = await orderApi.createOrder(orderPayload)
      const orderId = orderResponse?.data?.orderItems?.[0]?.id

      if (!orderId) {
        throw new Error('Unable to create order. Please try again.')
      }

      toast.success('Order has been placed successfully! Redirecting to the payment page...', {
        position: 'top-right',
        autoClose: 1500
      })

      const paymentPayload: PaymentRequest = {
        order_id: orderId,
        amount: packageDetail?.price || 0
      }
      const paymentResponse: PaymentResponse = await paymentApi.createPayment(paymentPayload)
      const paymentUrl = paymentResponse?.data?.payment_url

      if (paymentUrl) {
        const a = document.createElement('a')
        a.href = paymentUrl
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
        a.click()

        handleCloseModal()
      }
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to place the order. Please try again later.')
    } finally {
      setIsLoadingOrder(false)
    }
  }

  // Function fetch getUserProfile & getDetailTestPackage
  async function fetchAllData(): Promise<void> {
    try {
      setIsLoading(true)

      const packageRes = await testApi.getDetailTestPackage(id);
      setPackgeDetail(packageRes.data)

      reset({
        phone: sUserProfile.value?.phone_number || '',
        address: sUserProfile.value?.location || '',
        test_date: undefined,
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
      <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto'>
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
                            defaultValue={sUserProfile.value?.name}
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
                      rules={telValidation}
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
                    {/* test_date */}
                    <FormField
                      control={control}
                      name='test_date'
                      rules={{ required: 'Test Date is required' }}
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <Label>
                            <span className='text-red-500'>*</span>Test Date
                          </Label>
                          {isLoading ? (
                            <Skeleton className='h-10 w-full rounded-md' />
                          ) : (
                            <>
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
                                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() + 2))}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <p
                                className={`text-xs min-h-[3px] mt-1 ${errors.test_date ? 'text-red-500' : 'invisible'}`}
                              >
                                {errors.test_date ? errors.test_date.message : 'placeholder'}
                              </p>
                            </>
                          )}
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
                        {isLoading ? (
                          <Skeleton className='h-[100px] w-full rounded-md' />
                        ) : (
                          <>
                            <FormControl>
                              <Textarea
                                placeholder='Any additional information or special requests...'
                                {...field}
                                className='w-full px-3 py-3 border border-gray-300 rounded-lg min-h-[100px] resize-none'
                              />
                            </FormControl>
                            <p className='text-xs min-h-[3px] mt-1 invisible'>placeholder</p>
                          </>
                        )}
                      </FormItem>
                    )}
                  />
                  <Button
                    type='submit'
                    className='w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-lg font-medium transition-colors'
                  >
                    {isLoadingOrder ? 'Booking order ...' : 'Book'}
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
