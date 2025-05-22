import { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { Button } from '@/app/components/ui/button'

export default function HeroSection() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [controls, isInView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
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

  return (
    <section
      id='hero'
      className='relative w-full min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100'
    >
      <div className="absolute inset-0 bg-[url('https://www.lakemeadhospital.com/wp-content/uploads/2022/03/Health-Care1.jpg')] bg-cover bg-center opacity-5"></div>

      {/* Decorative elements */}
      <div className='absolute top-20 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-30 animate-pulse'></div>
      <div className='absolute bottom-32 right-16 w-16 h-16 bg-rose-200 rounded-full opacity-40 animate-bounce'></div>
      <div className='absolute top-1/2 right-20 w-12 h-12 bg-pink-300 rounded-full opacity-25'></div>

      <div className='container mx-auto px-4 md:px-6 relative'>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial='hidden'
          animate={controls}
          className='max-w-4xl mx-auto text-center'
        >
          <motion.h1
            variants={itemVariants}
            className='text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 bg-clip-text text-transparent leading-tight'
          >
            Personalized Gender Health Care Services
          </motion.h1>
          <motion.p variants={itemVariants} className='mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed'>
            Comprehensive, confidential, and compassionate healthcare services tailored to your unique needs.
          </motion.p>
          <motion.div variants={itemVariants} className='mt-10 flex flex-col sm:flex-row gap-4 justify-center'>
            <Button
              size='lg'
              className='bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transition-all duration-300'
            >
              Get Started Today
            </Button>
            <Button
              size='lg'
              variant='outline'
              className='text-pink-600 border-pink-300 hover:bg-pink-50 hover:border-pink-400 transition-all duration-300'
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
