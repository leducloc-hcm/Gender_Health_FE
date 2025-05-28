import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Badge } from '@/app/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/app/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/app/components/ui/sidebar'
import { BookOpen, Settings, User, ShoppingBag, LogOut, ChevronDown, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/staff/dashboard',
    icon: Home
  },
  {
    title: 'Blog & Articles',
    url: '/staff/blog',
    icon: BookOpen
  }
]

export default function StaffSidebar() {
  const location = useLocation()

  return (
    <Sidebar collapsible='icon' className=''>
      <SidebarHeader className=''>
        <div className='flex items-center gap-2 px-3 py-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-3'>
          <img
            className='w-6 h-6'
            src='https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA1L2pvYjk2My1iLTExMy1wLnBuZw.png'
            alt=''
          />

          <span className='truncate font-bold text-gray-900 text-lg group-data-[collapsible=icon]:hidden'>
            GenderCare
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className=' custom-scrollbar overflow-y-auto'>
        <SidebarGroup>
          <SidebarGroupContent className=''>
            <SidebarMenu className='space-y-1'>
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className='group relative h-12 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 hover:shadow-sm data-[active=true]:bg-gradient-to-r data-[active=true]:from-pink-500 data-[active=true]:to-rose-500 data-[active=true]:text-white data-[active=true]:shadow-lg group-data-[collapsible=icon]:justify-center   '
                      tooltip={item.title}
                    >
                      <Link
                        to={item.url}
                        className='flex items-center gap-3 px-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center'
                      >
                        <div className='relative flex items-center justify-center'>
                          <item.icon className='h-5 w-5 transition-transform ' />
                        </div>
                        <span className='font-medium group-data-[collapsible=icon]:hidden'>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='border-t border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 p-2'>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='group h-14 rounded-xl bg-white shadow-sm border border-pink-100 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:shadow-md transition-all duration-200 data-[state=open]:bg-gradient-to-r data-[state=open]:from-pink-100 data-[state=open]:to-rose-100 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center'
                >
                  <Avatar className='h-9 w-9 rounded-xl border-2 border-pink-200 transition-all duration-300'>
                    <AvatarImage src='/placeholder.svg?height=36&width=36' alt='User' />
                    <AvatarFallback className='rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white font-semibold text-sm'>
                      HH
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden'>
                    <span className='truncate font-semibold text-gray-900'>User Vinh</span>
                    <span className='truncate text-xs text-pink-600'>vinh@example.com</span>
                  </div>
                  <ChevronDown className='ml-auto size-4 text-pink-500 group-data-[collapsible=icon]:hidden' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border-pink-100 shadow-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <div className='flex items-center justify-start gap-2 p-3 bg-gradient-to-r from-pink-50 to-rose-50'>
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage src='/placeholder.svg?height=32&width=32' alt='User' />
                    <AvatarFallback className='rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 text-white text-sm'>
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col space-y-1 leading-none'>
                    <p className='font-semibold text-gray-900'>User Vinh</p>
                    <p className='text-xs text-pink-600'>vinh@example.com</p>
                  </div>
                </div>
                <DropdownMenuSeparator className='bg-pink-100' />
                <DropdownMenuItem className='rounded-lg mx-1 my-1 hover:bg-pink-50'>
                  <User className='mr-3 h-4 w-4 text-pink-500' />
                  <span>Profile</span>
                </DropdownMenuItem>
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
