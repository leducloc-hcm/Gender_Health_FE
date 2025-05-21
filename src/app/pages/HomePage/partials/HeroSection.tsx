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
      className='relative w-full min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-r from-rose-50 to-indigo-50'
    >
      <div className="absolute inset-0 bg-[url('https://www.lakemeadhospital.com/wp-content/uploads/2022/03/Health-Care1.jpg')] bg-cover bg-center opacity-10"></div>
      <div className='container mx-auto px-4 md:px-6 relative'>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial='hidden'
          animate={controls}
          className='max-w-3xl mx-auto text-center'
        >
          <motion.h1
            variants={itemVariants}
            className='text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-indigo-600'
          >
            Personalized Gender Health Care Services
          </motion.h1>
          <motion.p variants={itemVariants} className='mt-6 text-xl text-slate-700  max-w-2xl mx-auto'>
            Comprehensive, confidential, and compassionate healthcare services tailored to your unique needs.
          </motion.p>
          <motion.div variants={itemVariants} className='mt-10 flex flex-col sm:flex-row gap-4 justify-center'>
            <Button size='lg' className='bg-rose-500 hover:bg-rose-600 text-white'>
              Get Started
            </Button>
            <Button size='lg' variant='outline' className='text-indigo-500 border-indigo-500 hover:bg-indigo-50'>
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
