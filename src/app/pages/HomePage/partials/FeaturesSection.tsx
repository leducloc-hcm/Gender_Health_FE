import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiCalendar, FiMessageSquare, FiActivity, FiClipboard, FiShield, FiClock } from 'react-icons/fi'

export default function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const features = [
    {
      icon: <FiCalendar className='h-10 w-10 text-rose-500' />,
      title: 'Menstrual Cycle Tracking',
      description: 'Track your menstrual cycle, ovulation periods, and receive reminders for birth control.'
    },
    {
      icon: <FiMessageSquare className='h-10 w-10 text-rose-500' />,
      title: 'Online Consultation',
      description: 'Schedule online consultations with healthcare professionals at your convenience.'
    },
    {
      icon: <FiActivity className='h-10 w-10 text-rose-500' />,
      title: 'STI Testing Services',
      description: 'Comprehensive testing services for sexually transmitted infections with confidential results.'
    },
    {
      icon: <FiClipboard className='h-10 w-10 text-rose-500' />,
      title: 'Q&A with Experts',
      description: 'Ask questions and receive expert answers about sexual and reproductive health.'
    },
    {
      icon: <FiShield className='h-10 w-10 text-rose-500' />,
      title: 'Confidential Care',
      description: 'Your privacy is our priority with secure and confidential health services.'
    },
    {
      icon: <FiClock className='h-10 w-10 text-rose-500' />,
      title: 'Test Result Tracking',
      description: 'Track your test results and medical history in one secure location.'
    }
  ]

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

  return (
    <section id='features' className='py-20 bg-white dark:bg-gray-950'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-gray-900 dark:text-white'>
            Our Features
          </h2>
          <p className='mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
            Comprehensive tools and services for your sexual and reproductive health
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className='bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow'
            >
              <div className='mb-4'>{feature.icon}</div>
              <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>{feature.title}</h3>
              <p className='text-gray-600 dark:text-gray-400'>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
