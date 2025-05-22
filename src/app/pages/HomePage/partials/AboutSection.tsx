import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiAward, FiUsers, FiHeart } from 'react-icons/fi'

export default function AboutSection() {
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

  return (
    <section id='about' className='py-20 bg-gradient-to-br from-pink-25 to-rose-25'>
      <div className='container mx-auto px-4 md:px-8'>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
          className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'
        >
          <motion.div variants={itemVariants} className='order-2 lg:order-1'>
            <h2 className='text-3xl text-center lg:text-left font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-6'>
              About Our Healthcare Facility
            </h2>
            <p className='text-lg text-gray-600 mb-6 leading-relaxed'>
              We are a specialized healthcare facility dedicated to providing comprehensive gender and sexual health
              services. Our mission is to offer accessible, confidential, and high-quality care to all individuals.
            </p>
            <p className='text-lg text-gray-600 mb-6 leading-relaxed'>
              With a team of experienced healthcare professionals, we provide a range of services including sexual
              education, reproductive health care, STI testing, and personalized consultations.
            </p>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-10'>
              <div className='flex flex-col items-center text-center'>
                <div className='bg-gradient-to-br from-pink-100 to-rose-100 p-4 rounded-full mb-4 shadow-sm'>
                  <FiAward className='h-6 w-6 text-pink-600' />
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>Certified Experts</h3>
                <p className='text-gray-600 text-sm'>Highly qualified healthcare professionals</p>
              </div>

              <div className='flex flex-col items-center text-center'>
                <div className='bg-gradient-to-br from-pink-100 to-rose-100 p-4 rounded-full mb-4 shadow-sm'>
                  <FiUsers className='h-6 w-6 text-pink-600' />
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>5000+ Patients</h3>
                <p className='text-gray-600 text-sm'>Trusted by thousands of patients</p>
              </div>

              <div className='flex flex-col items-center text-center'>
                <div className='bg-gradient-to-br from-pink-100 to-rose-100 p-4 rounded-full mb-4 shadow-sm'>
                  <FiHeart className='h-6 w-6 text-pink-600' />
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>Compassionate Care</h3>
                <p className='text-gray-600 text-sm'>Patient-centered approach</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className='order-1 lg:order-2'>
            <div className='relative'>
              <div className='absolute -inset-4 bg-gradient-to-r from-pink-200 to-rose-200 rounded-xl opacity-20 blur-lg'></div>
              <img
                src='https://ncnewsline.com/wp-content/uploads/2023/11/GettyImages_Transgender_Healthcare.jpg'
                alt='Women healthcare professionals'
                className='relative rounded-xl w-full h-auto shadow-xl border border-pink-100'
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
