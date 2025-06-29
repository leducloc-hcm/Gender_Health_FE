import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMenu, FiHeart, FiX } from 'react-icons/fi'
import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/app/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { LogOut, Settings, ShoppingBag, User } from 'lucide-react'
import { profileApi } from '@/app/apis/profile.api'
import type { getProfileResult } from '@/app/pages/HomePage/Profile/models/Profile'
import { clearUserProfileSignify, setUserProfileToSignify, sUserProfile } from '@/app/hooks/sUserProfile'
import { ROLE_ROUTES } from '@/app/pages/Auth/Login/Login'
import NotificationDropdown from '@/app/layouts/ConsultantLayout/partials/NotificationDropdown'

export default function Header() {
  const nav = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // const sUser = sUserProfile.use()

  const [userProfile, setUserProfile] = useState<getProfileResult>({
    id: 0,
    email: '',
    role: '',
    status: '',
    created_at: '',
    updated_at: '',
    name: '',
    bio: '',
    location: '',
    username: '',
    avatar: '',
    coverPhoto: '',
    date_of_birth: ''
  })

  const accessToken = localStorage.getItem('access_token')

  const handleNavigateProfile = () => {
    const userRole = localStorage.getItem('user_role')?.toUpperCase()

    if (userRole === 'ADMIN') {
      nav(ROLE_ROUTES[userRole])
    } else {
      nav('/profile')
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken) {
        clearUserProfileSignify()
        return
      }
      try {
        const response = await profileApi.getProfile()
        console.log('response: ', response)
        setUserProfile(response.result)
        setUserProfileToSignify(response.result)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      }
    }
    fetchProfile()
  }, [accessToken])

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
            <Link to='/#features' className='text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors'>
              Features
            </Link>
            <Link to='/forum' className='text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors'>
              Forum
            </Link>
            <Link
              to='/menstrual-cycle'
              className='text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors'
            >
              Cycle Tracking
            </Link>
            <Link to='/blog' className='text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors'>
              Blog
            </Link>
            <Link
              to='/test-packages'
              className='text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors'
            >
              Test Packages
            </Link>
            <Link
              to='/booking-consultant'
              className='text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors'
            >
              Booking Consultant
            </Link>
            <Link to='/calendar' className='text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors'>
              Calendar
            </Link>
          </nav>
          {accessToken ? (
            <div className='flex justify-center items-center gap-2'>
              <div className='pt-1'>
                <NotificationDropdown />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='p-0'>
                    <Avatar className='h-8 w-8 rounded-lg'>
                      <AvatarImage src={userProfile?.avatar} alt='User' />
                      <AvatarFallback className='bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-lg'>
                        {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56 rounded-xl border-pink-100 shadow-lg' align='end' forceMount>
                  <div className='flex items-center justify-start gap-2 p-3 bg-gradient-to-r from-pink-50 to-rose-50'>
                    <Avatar className='h-8 w-8 rounded-lg'>
                      <AvatarImage src={userProfile?.avatar} alt='User' />
                      <AvatarFallback className='bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-lg'>
                        {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col space-y-1 leading-none'>
                      <p className='font-semibold text-gray-900'>{userProfile.name}</p>
                      <p className='text-xs text-pink-600'>{userProfile.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className='bg-pink-100' />
                  <DropdownMenuItem
                    onClick={() => {
                      handleNavigateProfile()
                    }}
                    className='rounded-lg mx-1 my-1 hover:bg-pink-50 cursor-pointer'
                  >
                    <User className='mr-3 h-4 w-4 text-pink-500' />
                    <span>Profile</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className='rounded-lg mx-1 my-1 hover:bg-pink-50 cursor-pointer'
                    onClick={() => nav('/sti-tracking')}
                  >
                    <ShoppingBag className='mr-3 h-4 w-4 text-pink-500' />
                    <span>STI Tracking</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className='bg-pink-100' />
                  <DropdownMenuItem
                    className='rounded-lg mx-1 my-1 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer'
                    onClick={() => {
                      localStorage.removeItem('access_token')
                      localStorage.removeItem('refresh_token')
                      localStorage.removeItem('user_role')
                      clearUserProfileSignify()
                      nav('/')
                    }}
                  >
                    <LogOut className='mr-3 h-4 w-4' />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className='flex items-center gap-4'>
              <div className='hidden md:flex gap-2'>
                <Button
                  variant='ghost'
                  className='text-sm font-medium text-pink-600 hover:text-pink-700 hover:bg-pink-50'
                  onClick={() => nav('/auth/login')}
                >
                  Login
                </Button>
                <Button
                  onClick={() => nav('/auth/register')}
                  className='bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg'
                >
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
          )}
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='md:hidden bg-white border-t border-pink-100 px-4 py-6 space-y-4 shadow-lg'>
          <Link
            to='/#features'
            className='block text-lg font-medium text-gray-700 hover:text-pink-600 transition-colors'
          >
            Features
          </Link>
          <Link to='/#about' className='block text-lg font-medium text-gray-700 hover:text-pink-600 transition-colors'>
            About
          </Link>
          <Link
            to='/#services'
            className='block text-lg font-medium text-gray-700 hover:text-pink-600 transition-colors'
          >
            Services
          </Link>
          <Link
            to='/menstrual-cycle'
            className='block text-lg font-medium text-gray-700 hover:text-pink-600 transition-colors'
          >
            Cycle Tracking
          </Link>
          <Link to='/blog' className='block text-lg font-medium text-gray-700 hover:text-pink-600 transition-colors'>
            Blog
          </Link>
          <Link
            to='/test-packages'
            className='block text-lg font-medium text-gray-700 hover:text-pink-600 transition-colors'
          >
            Test Packages
          </Link>
          <Link
            to='/#contact'
            className='block text-lg font-medium text-gray-700 hover:text-pink-600 transition-colors'
          >
            Contact
          </Link>
          <div className='flex flex-col gap-2 mt-4'>
            <Button
              variant='outline'
              onClick={() => nav('/auth/login')}
              className='w-full border-pink-200 text-pink-600 hover:bg-pink-50'
            >
              Login
            </Button>
            <Button
              onClick={() => nav('/auth/register')}
              className='w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white'
            >
              Register
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
