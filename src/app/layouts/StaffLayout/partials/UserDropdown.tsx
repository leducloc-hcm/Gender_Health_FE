import { authApi } from '@/app/apis/auth.api'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/app/components/ui/dropdown-menu'
import { setConsultantProfileToSignify } from '@/app/hooks/sConsultantProfile'
import { clearUserProfileSignify } from '@/app/hooks/sUserProfile'
import type { getProfileResult } from '@/app/pages/Customer/Profile/models/Profile'
import { LogOut, Settings, ShoppingBag, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const UserDropdown = () => {
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
  const nav = useNavigate()

  const accessToken = localStorage.getItem('access_token')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authApi.getProfileStaff()
        setUserProfile(response.result as any)
        setConsultantProfileToSignify(response.result)
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
      }
    }
    fetchProfile()
  }, [accessToken])
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-9 w-9 rounded-xl hover:bg-pink-50'>
          <Avatar className='h-8 w-8 rounded-lg'>
            <AvatarImage src='/placeholder.svg?height=32&width=32' alt='User' />
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
        <Link to={`profile`}>
          <DropdownMenuItem className='rounded-lg mx-1 my-1 hover:bg-pink-50'>
            <User className='mr-3 h-4 w-4 text-pink-500' />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className='rounded-lg mx-1 my-1 hover:bg-pink-50'>
          <ShoppingBag className='mr-3 h-4 w-4 text-pink-500' />
          <span>Orders</span>
        </DropdownMenuItem>
        <DropdownMenuItem className='rounded-lg mx-1 my-1 hover:bg-pink-50'>
          <Settings className='mr-3 h-4 w-4 text-pink-500' />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className='bg-pink-100' />
        <DropdownMenuItem
          className='rounded-lg mx-1 my-1 text-red-600 hover:bg-red-50 hover:text-red-700'
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
  )
}

export default UserDropdown
