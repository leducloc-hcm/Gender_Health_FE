import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMenu, FiHeart, FiX } from 'react-icons/fi'
import { Button } from '@/app/components/ui/button'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className='sticky top-0 z-50 w-full border-b border-pink-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm'>
      <div className='container mx-auto px-4 md:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Link to='/' className='flex items-center gap-2'>
              <FiHeart className='h-6 w-6 text-pink-500' />
              <span className='text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent'>
                GenderCare
              </span>
            </Link>
          </div>

          <nav className='hidden md:flex gap-6'>
            <a href='#features' className='text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors'>
              Features
            </a>
            <a href='#about' className='text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors'>
              About
            </a>
            <a href='#services' className='text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors'>
              Services
            </a>
            <a
              href='#cycle-tracking'
              className='text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors'
            >
              Cycle Tracking
            </a>
            <a href='#blog' className='text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors'>
              Blog
            </a>
            <a href='#contact' className='text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors'>
              Contact
            </a>
          </nav>

          <div className='flex items-center gap-4'>
            <div className='hidden md:flex gap-2'>
              <Button
                variant='ghost'
                className='text-sm font-medium text-pink-600 hover:text-pink-700 hover:bg-pink-50'
              >
                Login
              </Button>
              <Button className='bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg'>
                Register
              </Button>
            </div>

            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='md:hidden p-2 rounded hover:bg-pink-50 text-pink-600'
              variant='ghost'
              aria-label='Toggle menu'
            >
              {isMenuOpen ? <FiX className='h-6 w-6' /> : <FiMenu className='h-6 w-6' />}
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='md:hidden bg-white border-t border-pink-100 px-4 py-6 space-y-4 shadow-lg'>
          <a href='#features' className='block text-lg font-medium text-gray-700 hover:text-pink-600 transition-colors'>
            Features
          </a>
          <a href='#about' className='block text-lg font-medium text-gray-700 hover:text-pink-600 transition-colors'>
            About
          </a>
          <a href='#services' className='block text-lg font-medium text-gray-700 hover:text-pink-600 transition-colors'>
            Services
          </a>
          <a
            href='#cycle-tracking'
            className='block text-lg font-medium text-gray-700 hover:text-pink-600 transition-colors'
          >
            Cycle Tracking
          </a>
          <a href='#blog' className='block text-lg font-medium text-gray-700 hover:text-pink-600 transition-colors'>
            Blog
          </a>
          <a href='#contact' className='block text-lg font-medium text-gray-700 hover:text-pink-600 transition-colors'>
            Contact
          </a>
          <div className='flex flex-col gap-2 mt-4'>
            <Button variant='outline' className='w-full border-pink-200 text-pink-600 hover:bg-pink-50'>
              Login
            </Button>
            <Button className='w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white'>
              Register
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
