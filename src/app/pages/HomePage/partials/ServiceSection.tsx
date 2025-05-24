// import { useRef } from 'react'
// import { motion, useInView } from 'framer-motion'
// import { FiActivity, FiFileText, FiShield, FiClock, FiUser, FiCheckCircle } from 'react-icons/fi'
// import { Button } from '@/app/components/ui/button'

// export default function ServicesSection() {
//   const ref = useRef(null)
//   const isInView = useInView(ref, { once: true, amount: 0.2 })

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   }

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { duration: 0.5 }
//     }
//   }

//   const services = [
//     {
//       icon: <FiActivity className='h-10 w-10 text-white' />,
//       title: 'STI Testing',
//       description: 'Comprehensive testing for sexually transmitted infections with quick and confidential results.',
//       color: 'bg-rose-500'
//     },
//     {
//       icon: <FiFileText className='h-10 w-10 text-white' />,
//       title: 'Sexual Education',
//       description: 'Educational resources and counseling on sexual health and reproductive wellness.',
//       color: 'bg-indigo-500'
//     },
//     {
//       icon: <FiShield className='h-10 w-10 text-white' />,
//       title: 'Confidential Consultations',
//       description: 'Private consultations with healthcare professionals in a safe environment.',
//       color: 'bg-purple-500'
//     },
//     {
//       icon: <FiClock className='h-10 w-10 text-white' />,
//       title: 'Reproductive Health',
//       description: 'Services for reproductive health including contraception and family planning.',
//       color: 'bg-blue-500'
//     },
//     {
//       icon: <FiUser className='h-10 w-10 text-white' />,
//       title: 'Gender-Specific Care',
//       description: 'Specialized care tailored to individual gender health needs and concerns.',
//       color: 'bg-teal-500'
//     },
//     {
//       icon: <FiCheckCircle className='h-10 w-10 text-white' />,
//       title: 'Health Certifications',
//       description: 'Medical certifications and documentation for various health requirements.',
//       color: 'bg-emerald-500'
//     }
//   ]

//   return (
//     <section id='services' className='py-20 bg-white '>
//       <div className='container mx-auto px-4 md:px-6'>
//         <div className='text-center mb-16'>
//           <h2 className='text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-gray-900 '>Our Services</h2>
//           <p className='mt-4 text-xl text-gray-600  max-w-2xl mx-auto'>
//             Comprehensive sexual and reproductive health services
//           </p>
//         </div>

//         <motion.div
//           ref={ref}
//           variants={containerVariants}
//           initial='hidden'
//           animate={isInView ? 'visible' : 'hidden'}
//           className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
//         >
//           {services.map((service, index) => (
//             <motion.div
//               key={index}
//               variants={itemVariants}
//               className='bg-white  rounded-xl shadow-md overflow-hidden border border-gray-100 '
//             >
//               <div className={`${service.color} p-6`}>
//                 <div className='flex justify-center'>{service.icon}</div>
//               </div>
//               <div className='p-6'>
//                 <h3 className='text-xl font-semibold mb-3 text-gray-900 '>{service.title}</h3>
//                 <p className='text-gray-600  mb-4'>{service.description}</p>
//                 <Button variant='outline' className='w-full'>
//                   Learn More
//                 </Button>
//               </div>
//             </motion.div>
//           ))}
//         </motion.div>

//         <div className='mt-16 text-center'>
//           <Button size='lg' className='bg-rose-500 hover:bg-rose-600 text-white'>
//             View All Services
//           </Button>
//         </div>
//       </div>
//     </section>
//   )
// }
