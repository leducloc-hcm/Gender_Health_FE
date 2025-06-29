import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function FeaturesSection() {
  const navigate = useNavigate()

  const features = [
    {
      title: 'Menstrual Cycle Tracking',
      description:
        'Advanced cycle tracking with personalized insights, ovulation predictions, and fertility awareness. Monitor your symptoms, mood, and health patterns.',
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
          />
        </svg>
      ),
      features: ['Personalized cycle predictions', 'Symptom tracking', 'Fertility insights', 'Health pattern analysis'],
      path: '/menstrual-cycle'
    },
    {
      title: 'Health Community Forum',
      description:
        'A safe space to connect, share experiences, and seek advice from others facing similar health challenges. Find encouragement and support.',
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z'
          />
        </svg>
      ),
      features: ['Peer support', 'Real-life experiences', 'Moderated discussions', 'Anonymous posting option'],
      path: '/forum'
    },
    {
      title: 'Health Blog & Insights',
      description:
        'Stay informed with curated articles from health professionals. Learn about reproductive health, STI prevention, and wellness tips.',
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
          />
        </svg>
      ),
      features: ['Expert-written articles', 'Reproductive health tips', 'STI education', 'Wellness & lifestyle guides'],
      path: '/blog'
    },
    {
      title: 'STI Test Booking',
      description:
        'Easily book screenings for 13 common STIs with flexible time slots and private labs. Early detection helps protect your health.',
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
          />
        </svg>
      ),
      features: ['Test 13 STIs', 'Flexible appointments', 'Discreet testing locations', 'Fast confidential results'],
      path: '/test-packages'
    },
    {
      title: 'STI Tracking',
      description:
        'Choose from curated health test packages based on your symptoms or lifestyle. Save time and cost with bundled testing options.',
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
          />
        </svg>
      ),
      features: [
        'Predefined or custom packages',
        'Symptom-based suggestions',
        'Cost-effective bundles',
        'One-click booking'
      ],
      path: '/test-packages'
    },
    {
      title: 'Health Calendar ',
      description:
        'Manage your appointments, medication, and test schedules all in one place. Set reminders so you never miss important health events.',
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M15 17h5l-5 5v-5zM4 19h6v-6H4v6zm0-8h6V5H4v6zm8 0h6V5h-6v6z'
          />
        </svg>
      ),
      features: [
        'Appointment tracking',
        'Medication reminders',
        'Cycle & test notifications',
        'Personalized scheduling'
      ],
      path: '/calendar'
    }
  ]

  const FeatureCard = ({ feature, index }: { feature: any; index: number }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })

    const cardVariants = {
      hidden: { opacity: 0, y: 50, scale: 0.9 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.6,
          ease: 'easeOut',
          delay: index * 0.1
        }
      }
    }

    const handleNavigate = () => {
      navigate(feature.path)
    }

    return (
      <motion.div
        ref={ref}
        variants={cardVariants}
        initial='hidden'
        animate={isInView ? 'visible' : 'hidden'}
        className='group relative'
      >
        <div className='absolute inset-0 bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl transform group-hover:scale-105 transition-transform duration-300 opacity-50'></div>

        <div className='relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300'>
          {/* Icon */}
          <div className='flex items-center  gap-4'>
            <div className='w-16 h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300'>
              {feature.icon}
            </div>

            {/* Content */}
            <h3 className='text-2xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent'>
              {feature.title}
            </h3>
          </div>

          <p className='text-gray-600 mb-6 leading-relaxed'>{feature.description}</p>

          {/* Features List */}
          <div className='space-y-3 mb-6'>
            {feature.features.map((item: string, idx: number) => (
              <div key={idx} className='flex items-center gap-3'>
                <div className='w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0'>
                  <svg className='w-3 h-3 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                </div>
                <span className='text-gray-700 text-sm font-medium'>{item}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={handleNavigate}
            className='w-full cursor-pointer bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 hover:shadow-lg text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1'
          >
            Explore Feature
          </button>
        </div>
      </motion.div>
    )
  }

  const handleGetStarted = () => {
    navigate('/auth/login')
  }

  return (
    <section
      id='features'
      className='py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-pink-50 relative overflow-hidden'
    >
      {/* Background Decorations */}
      <div className='absolute inset-0'>
        <div className='absolute top-20 left-10 w-40 h-40 bg-pink-200/20 rounded-full blur-3xl'></div>
        <div className='absolute bottom-32 right-16 w-32 h-32 bg-rose-200/30 rounded-full blur-2xl'></div>
        <div className='absolute top-1/2 right-20 w-24 h-24 bg-pink-300/20 rounded-full blur-xl'></div>
        <div className='absolute top-1/3 left-1/4 w-20 h-20 bg-rose-200/20 rounded-full blur-2xl'></div>
        <div className='absolute bottom-1/4 left-1/3 w-28 h-28 bg-pink-200/20 rounded-full blur-3xl'></div>
      </div>

      <div className='container mx-auto px-4 md:px-6 relative'>
        {/* Header */}
        <div className='text-center mb-20'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='relative inline-block mb-6'
          >
            <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-pink-700 bg-clip-text text-transparent'>
              Comprehensive Health Features
            </h2>
            <div className='absolute inset-0 bg-gradient-to-r from-pink-600/10 via-rose-500/10 to-pink-700/10 blur-3xl -z-10'></div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'
          >
            Discover our comprehensive suite of tools and services designed specifically for your health and wellness
            journey
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className='text-center mt-20'
        >
          <div className='bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-12 text-white relative overflow-hidden'>
            <div className='absolute inset-0 bg-gradient-to-r from-pink-600/20 to-rose-600/20'></div>
            <div className='relative'>
              <h3 className='text-3xl font-bold mb-4'>Ready to Take Control of Your Health?</h3>
              <p className='text-pink-100 mb-8 max-w-2xl mx-auto'>
                Join thousands of women who trust our platform for their health and wellness journey
              </p>
              <button
                onClick={handleGetStarted}
                className='cursor-pointer bg-white text-pink-600 px-8 py-4 rounded-xl font-semibold hover:bg-pink-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg'
              >
                Get Started Today
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
