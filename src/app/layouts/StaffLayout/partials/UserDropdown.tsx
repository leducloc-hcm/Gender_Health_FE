import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/app/components/ui/dropdown-menu'
import { LogOut, Settings, ShoppingBag, User } from 'lucide-react'
import { Link } from 'react-router-dom'

const UserDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-9 w-9 rounded-xl hover:bg-pink-50'>
          <Avatar className='h-8 w-8 rounded-lg'>
            <AvatarImage src='/placeholder.svg?height=32&width=32' alt='User' />
            <AvatarFallback className='bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-lg'>
              JD
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 rounded-xl border-pink-100 shadow-lg' align='end' forceMount>
        <div className='flex items-center justify-start gap-2 p-3 bg-gradient-to-r from-pink-50 to-rose-50'>
          <Avatar className='h-8 w-8 rounded-lg'>
            <AvatarImage src='/placeholder.svg?height=32&width=32' alt='User' />
            <AvatarFallback className='bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-lg'>
              JD
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col space-y-1 leading-none'>
            <p className='font-semibold text-gray-900'>Vinh</p>
            <p className='text-xs text-pink-600'>vinh@example.com</p>
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
        <DropdownMenuItem className='rounded-lg mx-1 my-1 text-red-600 hover:bg-red-50 hover:text-red-700'>
          <LogOut className='mr-3 h-4 w-4' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown
