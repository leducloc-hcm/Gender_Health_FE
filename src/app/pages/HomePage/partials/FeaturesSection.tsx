import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiCalendar, FiMessageSquare, FiActivity, FiClipboard, FiShield, FiClock } from 'react-icons/fi'

export default function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const features = [
    {
      icon: <FiCalendar className='h-10 w-10 text-pink-600' />,
      title: 'Menstrual Cycle Tracking',
      description: 'Advanced cycle tracking with personalized insights, ovulation predictions, and fertility awareness.'
    },
    {
      icon: <FiMessageSquare className='h-10 w-10 text-pink-600' />,
      title: 'Online Consultation',
      description: 'Private video consultations with female healthcare specialists from the comfort of your home.'
    },
    {
      icon: <FiActivity className='h-10 w-10 text-pink-600' />,
      title: 'Comprehensive Testing',
      description: "Full range of women's health screenings and STI testing with fast, confidential results."
    },
    {
      icon: <FiClipboard className='h-10 w-10 text-pink-600' />,
      title: 'Expert Q&A',
      description: "Get answers from certified gynecologists and women's health specialists anytime."
    },
    {
      icon: <FiShield className='h-10 w-10 text-pink-600' />,
      title: 'Complete Privacy',
      description: 'Your health information is protected with military-grade security and confidentiality.'
    },
    {
      icon: <FiClock className='h-10 w-10 text-pink-600' />,
      title: 'Health History Tracking',
      description: 'Comprehensive health records and test result management in one secure platform.'
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
    <section id='features' className='py-20 bg-white'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent'>
            Our Women's Health Features
          </h2>
          <p className='mt-4 text-xl text-gray-600 max-w-2xl mx-auto'>
            Comprehensive tools and services designed specifically for women's health and wellness
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
              className='bg-gradient-to-br from-pink-25 to-rose-25 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-pink-100 hover:border-pink-200 group'
            >
              <div className='mb-4 group-hover:scale-110 transition-transform duration-300'>{feature.icon}</div>
              <h3 className='text-xl font-semibold mb-3 text-gray-900'>{feature.title}</h3>
              <p className='text-gray-600 leading-relaxed'>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
