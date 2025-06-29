import { motion } from 'framer-motion'

export default function PartnerSection() {
  const partners = [
    {
      id: 1,
      name: 'Karmen Pet Hospital',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUT4NhltYojT7X27fXXc4G_B4uljKUogHGZg&s',
      alt: 'Karmen Pet Hospital Logo'
    },
    {
      id: 2,
      name: 'Ciputra Healthcare',
      logo: 'https://png.pngtree.com/png-clipart/20230823/original/pngtree-hospital-logo-icon-abstract-alliance-picture-image_8313149.png',
      alt: 'Ciputra Healthcare Logo'
    },
    {
      id: 3,
      name: "St. Jude Children's Research Hospital",
      logo: 'https://marketplace.canva.com/EAGKU6t2llU/2/0/1600w/canva-blue-green-white-simple-modern-medical-logo-enoKffV7vWg.jpg',
      alt: "St. Jude Children's Research Hospital Logo"
    },
    {
      id: 4,
      name: 'Mayapada Hospital',
      logo: 'https://thumbs.dreamstime.com/b/plus-195775914.jpg',
      alt: 'Mayapada Hospital Logo'
    },
    {
      id: 5,
      name: 'Siloam Hospitals',
      logo: 'https://marketplace.canva.com/EAF-SBttJYg/1/0/1600w/canva-red-simple-medical-health-logo-0yxgC8dpegQ.jpg',
      alt: 'Siloam Hospitals Logo'
    },
    {
      id: 6,
      name: 'Bangkok Hospital',
      logo: 'https://upload.wikimedia.org/wikipedia/en/d/dd/Manipal_Hospitals_%28logo%29.png',
      alt: 'Bangkok Hospital Logo'
    },
    {
      id: 7,
      name: 'Bumrungrad Hospital',
      logo: 'https://cdn.vectorstock.com/i/500p/21/16/medical-logo-symbol-set-vector-40432116.jpg',
      alt: 'Bumrungrad Hospital Logo'
    },
    {
      id: 8,
      name: 'Mount Elizabeth Hospital',
      logo: 'https://marketplace.canva.com/EAGGk5eHj5I/1/0/1600w/canva-black-and-red-modern-health-logo-wikMDQ6wqfQ.jpg',
      alt: 'Mount Elizabeth Hospital Logo'
    },
    {
      id: 9,
      name: 'Mount Elizabeth Hospital',
      logo: 'https://cdn.vectorstock.com/i/500p/73/30/medical-cross-sign-logo-vector-5147330.jpg',
      alt: 'Mount Elizabeth Hospital Logo'
    }
  ]

  const duplicatedPartners = [...partners, ...partners]

  return (
    <section className='py-8 bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 relative overflow-hidden'>
      <div className='absolute inset-0'>
        <div className='absolute top-5 left-10 w-16 h-16 bg-blue-200/20 rounded-full blur-2xl'></div>
        <div className='absolute bottom-10 right-5 w-12 h-12 bg-purple-200/30 rounded-full blur-xl'></div>
      </div>

      <div className='container mx-auto px-4 md:px-6 relative'>
        <div className='relative'>
          <div className='absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-gray-100 via-blue-50/80 to-transparent z-10 pointer-events-none'></div>
          <div className='absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-gray-100 via-blue-50/80 to-transparent z-10 pointer-events-none'></div>
          <div className='overflow-hidden'>
            <motion.div
              className='flex items-center gap-6 md:gap-8'
              animate={{
                x: [0, `-${partners.length * 150}px`]
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 20,
                  ease: 'linear'
                }
              }}
            >
              {duplicatedPartners.map((partner, index) => (
                <motion.div
                  key={`${partner.id}-${index}`}
                  className='flex-shrink-0 group w-24 h-16 md:w-32 md:h-20'
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img src={partner.logo} alt={partner.alt} className='w-full h-full object-contain ' loading='lazy' />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
