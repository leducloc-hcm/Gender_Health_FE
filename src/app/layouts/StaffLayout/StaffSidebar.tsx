import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/app/components/ui/sidebar'
import { Activity, BookOpen, CalendarFold, FileText, Home, Tags, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const navigationItems = [
  // {
  //   title: 'Dashboard',
  //   url: '/staff/dashboard',
  //   icon: Home
  // },
  {
    title: 'Consultant Management',
    url: '/staff/consultant-profile-management',
    icon: User
  },
  {
    title: 'Blog & Articles',
    url: '/staff/blog',
    icon: BookOpen
  },
  {
    title: 'Tags',
    url: '/staff/tag',
    icon: Tags
  },
  {
    title: 'Schedules',
    url: '/staff/schedule',
    icon: CalendarFold
  },
  {
    title: 'Stis-Tracking',
    url: '/staff/stis-tracking',
    icon: Activity
  },
  {
    title: 'Result Of Test',
    url: '/staff/result-of-test',
    icon: FileText
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
    </Sidebar>
  )
}
