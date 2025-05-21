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
    <section id='about' className='py-20 bg-gray-50 '>
      <div className='container mx-auto px-4 md:px-8'>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
          className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'
        >
          <motion.div variants={itemVariants} className='order-2 lg:order-1'>
            <h2 className='text-3xl text-center font-bold tracking-tight sm:text-4xl text-gray-900  mb-6'>
              About Our Healthcare Facility
            </h2>
            <p className='text-lg text-gray-600  mb-6'>
              We are a specialized healthcare facility dedicated to providing comprehensive gender and sexual health
              services. Our mission is to offer accessible, confidential, and high-quality care to all individuals.
            </p>
            <p className='text-lg text-gray-600  mb-6'>
              With a team of experienced healthcare professionals, we provide a range of services including sexual
              education, reproductive health care, STI testing, and personalized consultations.
            </p>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-10'>
              <div className='flex flex-col items-center text-center'>
                <div className='bg-rose-100  p-3 rounded-full mb-4'>
                  <FiAward className='h-6 w-6 text-rose-500' />
                </div>
                <h3 className='font-semibold text-gray-900 '>Certified Experts</h3>
                <p className='text-gray-600  text-sm mt-2'>Highly qualified healthcare professionals</p>
              </div>

              <div className='flex flex-col items-center text-center'>
                <div className='bg-rose-100 p-3 rounded-full mb-4'>
                  <FiUsers className='h-6 w-6 text-rose-500' />
                </div>
                <h3 className='font-semibold text-gray-900 '>5000+ Patients</h3>
                <p className='text-gray-600  text-sm mt-2'>Trusted by thousands of patients</p>
              </div>

              <div className='flex flex-col items-center text-center'>
                <div className='bg-rose-100  p-3 rounded-full mb-4'>
                  <FiHeart className='h-6 w-6 text-rose-500' />
                </div>
                <h3 className='font-semibold text-gray-900 '>Compassionate Care</h3>
                <p className='text-gray-600  text-sm mt-2'>Patient-centered approach</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className='order-1 lg:order-2'>
            <div className='relative'>
              <div className=''></div>
              <img
                src='https://www.lakemeadhospital.com/wp-content/uploads/2022/03/Health-Care1.jpg'
                alt='Healthcare professionals'
                className='relative rounded-xl w-full h-auto shadow-lg'
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
