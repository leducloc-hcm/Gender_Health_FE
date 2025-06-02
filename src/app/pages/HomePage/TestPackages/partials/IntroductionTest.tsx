import { Button } from '@/app/components/ui/button'
import { useInView, motion } from 'framer-motion'
import { useRef } from 'react'
import { IoMdCheckmarkCircle } from 'react-icons/io'

export default function IntroductionTest() {
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
      title: '16 tests to detect 13 sexually transmitted disease agents'
    },
    {
      icon: <IoMdCheckmarkCircle className='text-green-600 text-5xl h-10 w-10' />,
      title: 'Screening for HIV, Herpes, Syphilis, Gonorrhea...'
    },
    {
      icon: <IoMdCheckmarkCircle className='text-green-600 text-5xl h-10 w-10' />,
      title: 'Confidentiality of personal information and test results'
    },
    {
      icon: <IoMdCheckmarkCircle className='text-green-600 text-5xl h-10 w-10' />,
      title: 'Free consultation with STD specialists'
    }
  ]

  return (
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
              <h1 className='text-4xl lg:text-6xl text-center text-black lg:text-left font-extrabold'>13 Diseases (STIs)</h1>
              <h1 className='text-3xl lg:text-5xl py-2 text-center lg:text-left font-extrabold tracking-tight bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 bg-clip-text text-transparent'>
                Test Package
              </h1>
            </div>
            {benefits.map((benefit, index) => (
              <div key={index} className='flex items-center justify-start group py-4'>
                <div className='group-hover:scale-125 transition-transform duration-300'>{benefit.icon}</div>
                <h3 className='text-base md:text-2xl font-bold text-gray-900'>{benefit.title}</h3>
              </div>
            ))}
            <Button className='w-2/5 mt-3 text-base md:text-xl py-5 md:py-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg'>
              Get a consultation now
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
  )
}
