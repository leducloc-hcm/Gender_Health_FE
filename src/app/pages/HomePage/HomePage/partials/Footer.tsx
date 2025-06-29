import React from 'react'
import { FiHeart, FiMapPin, FiPhone, FiMail, FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
  return (
    <footer className='relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden'>
      {/* Background decorative elements */}
      <div className='absolute inset-0'>
        <div className='absolute top-20 left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl'></div>
        <div className='absolute bottom-32 right-16 w-24 h-24 bg-rose-500/10 rounded-full blur-xl'></div>
        <div className='absolute top-1/2 right-20 w-16 h-16 bg-pink-400/10 rounded-full blur-lg'></div>
      </div>

      <div className='relative container mx-auto px-4 pt-16 pb-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
          {/* Company Info */}
          <div className='lg:col-span-2'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center'>
                <FiHeart className='h-5 w-5 text-white' />
              </div>
              <h3 className='text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent'>
                GenderCare
              </h3>
            </div>
            <p className='text-gray-300 mb-6 leading-relaxed max-w-md'>
              Providing comprehensive healthcare services with a focus on gender-affirming care, mental health support,
              and wellness for all individuals in a safe and inclusive environment.
            </p>

            {/* Newsletter Signup */}
            <div className='mb-6'>
              <h4 className='text-lg font-semibold mb-3 text-pink-400'>Stay Connected</h4>
              <div className='flex max-w-sm'>
                <input
                  type='email'
                  placeholder='Enter your email'
                  className='flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-pink-500 text-white placeholder-gray-400'
                />
                <button className='px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-r-lg transition-all duration-300 flex items-center'>
                  <FiArrowRight className='h-4 w-4' />
                </button>
              </div>
            </div>

            {/* Social Media */}
            <div className='flex space-x-4'>
              <a
                href='#'
                className='w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 rounded-full flex items-center justify-center transition-all duration-300 group'
              >
                <svg
                  className='w-5 h-5 text-gray-400 group-hover:text-white transition-colors'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                </svg>
              </a>
              <a
                href='#'
                className='w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 rounded-full flex items-center justify-center transition-all duration-300 group'
              >
                <svg
                  className='w-5 h-5 text-gray-400 group-hover:text-white transition-colors'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
                </svg>
              </a>
              <a
                href='#'
                className='w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 rounded-full flex items-center justify-center transition-all duration-300 group'
              >
                <svg
                  className='w-5 h-5 text-gray-400 group-hover:text-white transition-colors'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                </svg>
              </a>
              <a
                href='#'
                className='w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 rounded-full flex items-center justify-center transition-all duration-300 group'
              >
                <svg
                  className='w-5 h-5 text-gray-400 group-hover:text-white transition-colors'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.346-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.840-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z' />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-xl font-bold mb-6 text-pink-400'>Quick Links</h4>
            <ul className='space-y-3'>
              <li>
                <Link
                  to='/forum'
                  className='text-gray-300 hover:text-pink-400 transition-colors duration-300 flex items-center group'
                >
                  <span className='group-hover:translate-x-1 transition-transform duration-300'>Forum</span>
                </Link>
              </li>
              <li>
                <Link
                  to='/blog'
                  className='text-gray-300 hover:text-pink-400 transition-colors duration-300 flex items-center group'
                >
                  <span className='group-hover:translate-x-1 transition-transform duration-300'>Blog</span>
                </Link>
              </li>
              <li>
                <Link
                  to='/test-packages'
                  className='text-gray-300 hover:text-pink-400 transition-colors duration-300 flex items-center group'
                >
                  <span className='group-hover:translate-x-1 transition-transform duration-300'>Test Packages</span>
                </Link>
              </li>
              <li>
                <Link
                  to='/booking-consultant'
                  className='text-gray-300 hover:text-pink-400 transition-colors duration-300 flex items-center group'
                >
                  <span className='group-hover:translate-x-1 transition-transform duration-300'>Book Consultant</span>
                </Link>
              </li>
              <li>
                <Link
                  to='/menstrual-cycle'
                  className='text-gray-300 hover:text-pink-400 transition-colors duration-300 flex items-center group'
                >
                  <span className='group-hover:translate-x-1 transition-transform duration-300'>Cycle Tracking</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className='text-xl font-bold mb-6 text-pink-400'>Contact Info</h4>
            <div className='space-y-4'>
              <div className='flex items-start gap-3'>
                <div className='w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5'>
                  <FiMapPin className='h-4 w-4 text-pink-400' />
                </div>
                <div>
                  <p className='text-gray-300 text-sm leading-relaxed'>
                    123 Healthcare Avenue
                    <br />
                    Medical District, City
                    <br />
                    State 12345
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <FiPhone className='h-4 w-4 text-pink-400' />
                </div>
                <a href='tel:+15551234567' className='text-gray-300 hover:text-pink-400 transition-colors text-sm'>
                  (555) 123-4567
                </a>
              </div>

              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <FiMail className='h-4 w-4 text-pink-400' />
                </div>
                <a
                  href='mailto:info@gendercare.com'
                  className='text-gray-300 hover:text-pink-400 transition-colors text-sm'
                >
                  info@gendercare.com
                </a>
              </div>
            </div>

            {/* Operating Hours */}
            <div className='mt-6'>
              <h5 className='text-lg font-semibold mb-3 text-pink-400'>Operating Hours</h5>
              <div className='space-y-1 text-sm text-gray-300'>
                <p>Mon - Fri: 8:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 4:00 PM</p>
                <p>Sunday: Emergency Only</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t border-gray-700 mt-12 pt-8'>
          <div className='flex flex-col lg:flex-row justify-between items-center gap-4'>
            <p className='text-gray-400 text-sm'>
              © {new Date().getFullYear()} GenderCare. All rights reserved. Made with ❤️ for inclusive healthcare.
            </p>
            <div className='flex flex-wrap gap-6'>
              <Link to='/privacy' className='text-gray-400 hover:text-pink-400 text-sm transition-colors duration-300'>
                Privacy Policy
              </Link>
              <Link to='/terms' className='text-gray-400 hover:text-pink-400 text-sm transition-colors duration-300'>
                Terms of Service
              </Link>
              <Link
                to='/accessibility'
                className='text-gray-400 hover:text-pink-400 text-sm transition-colors duration-300'
              >
                Accessibility
              </Link>
              <Link to='/support' className='text-gray-400 hover:text-pink-400 text-sm transition-colors duration-300'>
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
