import { Button } from '@/app/components/ui/button'
import { useInView, motion } from 'framer-motion'
import { useRef } from 'react'
import { IoMdCheckmarkCircle } from 'react-icons/io'

export default function TestPackages() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  const benefits = [
    {
      icon: <IoMdCheckmarkCircle className='text-green-600 text-5xl h-10 w-10' />,
      title: '16 xét nghiệm phát hiện 13 tác nhân gây bệnh tình dục'
    },
    {
      icon: <IoMdCheckmarkCircle className='text-green-600 text-5xl h-10 w-10' />,
      title: 'Sàng lọc bệnh HIV, Herpes, Giang Mai, Lậu...'
    },
    {
      icon: <IoMdCheckmarkCircle className='text-green-600 text-5xl h-10 w-10' />,
      title: 'Bảo mật thông tin và kết quả xét nghiệm'
    },
    {
      icon: <IoMdCheckmarkCircle className='text-green-600 text-5xl h-10 w-10' />,
      title: 'Bác sĩ chuyên khoa STD tư vấn miễn phí'
    }
  ]

  return (
    <>
      <section id='introduce-test-package' className='py-20 bg-gradient-to-br from-pink-50 to-rose-50'>
        <div className='container mx-auto px-4 md:px-8'>
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial='hidden'
            animate={isInView ? 'visible' : 'hidden'}
            className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'
          >
            <motion.div variants={itemVariants} className='order-2 lg:order-1'>
              <div className='py-2 mb-6'>
                <h1 className='text-4xl lg:text-6xl text-center lg:text-left font-extrabold'>Gói xét nghiệm</h1>
                <h1 className='text-3xl lg:text-5xl py-2 text-center lg:text-left font-extrabold tracking-tight bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 bg-clip-text text-transparent'>
                  13 Bệnh (STDs)
                </h1>
              </div>
              {benefits.map((benefit, index) => (
                <div key={index} className='flex items-center justify-start group py-4'>
                  <div className='group-hover:scale-125 transition-transform duration-300'>{benefit.icon}</div>
                  <h3 className='text-2xl font-bold text-gray-900'>{benefit.title}</h3>
                </div>
              ))}
              <Button className='mt-3 text-xl p-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg'>
                Tư vấn ngay
              </Button>
            </motion.div>
            <motion.div variants={itemVariants} className='order-1 lg:order-2'>
              <div className='relative'>
                <div className='absolute -inset-4 rounded-xl opacity-20 blur-lg'></div>
                <img
                  src='https://galantclinic.com/wp-content/uploads/2024/10/xet-nghiem-std-1.png'
                  alt='xet-nghiem-std-1.png'
                  className='relative rounded-xl w-full h-auto shadow-xl border border-pink-100'
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
