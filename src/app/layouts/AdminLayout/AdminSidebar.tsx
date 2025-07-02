import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/app/components/ui/sidebar'
import {
  User,
  LayoutDashboard,
  CreditCard,
  FlaskConical,
  ShoppingCart,
  Boxes,
  FileText,
  Users,
  UserCheck,
  UserCog,
  ChevronRight,
  SquareDashedBottomCode,
  Activity
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/app/components/ui/collapsible'
import { useState } from 'react'

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Accounts',
    icon: User,
    url: '/',
    isDropdown: true,
    subItems: [
      {
        title: 'Customer',
        url: '/admin/manage-customer',
        icon: Users
      },
      {
        title: 'Consultant',
        url: '/admin/manage-consultant',
        icon: UserCheck
      },
      {
        title: 'Staff',
        url: '/admin/manage-staff',
        icon: UserCog
      }
    ]
  },
  {
    title: 'Payments',
    url: '/admin/manage-payment',
    icon: CreditCard
  },
  {
    title: 'Orders',
    url: '/admin/manage-order',
    icon: ShoppingCart
  },
  {
    title: 'Test Packages',
    url: '/admin/manage-test-packages',
    icon: Boxes
  },
  {
    title: 'Specialties',
    url: '/admin/manage-specialties',
    icon: SquareDashedBottomCode
  },
  {
    title: 'Type of test',
    url: '/admin/manage-type-of-test',
    icon: FileText
  },
  {
    title: 'Tests',
    url: '/admin/manage-test',
    icon: FlaskConical
  },
  {
    title: 'Sti Tracking',
    url: '/admin/sti-tracking',
    icon: Activity
  }
]

export default function AdminSidebar() {
  const location = useLocation()
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({})

  const toggleDropdown = (title: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  const isAccountActive =
    location.pathname.includes('/admin/manage-customer') ||
    location.pathname.includes('/admin/manage-consultant') ||
    location.pathname.includes('/admin/manage-staff')

  return (
    <>
      <Sidebar collapsible='icon'>
        <SidebarHeader>
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

        <SidebarContent className='custom-scrollbar overflow-y-auto'>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className='space-y-1'>
                {navigationItems.map((item) => {
                  if (item.isDropdown && item.subItems) {
                    return (
                      <Collapsible
                        key={item.title}
                        open={openDropdowns[item.title] || isAccountActive}
                        onOpenChange={() => toggleDropdown(item.title)}
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              isActive={isAccountActive}
                              className='group relative h-12 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 hover:shadow-sm data-[active=true]:bg-gradient-to-r data-[active=true]:from-pink-500 data-[active=true]:to-rose-500 data-[active=true]:text-white data-[active=true]:shadow-lg group-data-[collapsible=icon]:justify-center'
                              tooltip={item.title}
                            >
                              <div className='flex items-center gap-3 hover:cursor-pointer group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center w-full'>
                                <div className='relative flex items-center justify-center'>
                                  <item.icon className='h-5 w-5 transition-transform' />
                                </div>
                                <span className='font-medium group-data-[collapsible=icon]:hidden flex-1 text-left'>
                                  {item.title}
                                </span>
                                <ChevronRight
                                  className={`h-4 w-4 transition-transform group-data-[collapsible=icon]:hidden ${
                                    openDropdowns[item.title] || isAccountActive ? 'rotate-90' : ''
                                  }`}
                                />
                              </div>
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub className='group-data-[collapsible=icon]:hidden'>
                              {item.subItems.map((subItem) => {
                                const isSubActive = location.pathname === subItem.url
                                return (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={isSubActive}
                                      className='h-10 rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 data-[active=true]:bg-gradient-to-r data-[active=true]:from-pink-400 data-[active=true]:to-rose-400 data-[active=true]:text-white'
                                    >
                                      <Link to={subItem.url} className='flex items-center gap-3 px-6'>
                                        <subItem.icon className='h-4 w-4' />
                                        <span className='font-medium'>{subItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                )
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    )
                  }

                  const isActive = location.pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className='group relative h-12 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 hover:shadow-sm data-[active=true]:bg-gradient-to-r data-[active=true]:from-pink-500 data-[active=true]:to-rose-500 data-[active=true]:text-white data-[active=true]:shadow-lg group-data-[collapsible=icon]:justify-center'
                        tooltip={item.title}
                      >
                        <Link
                          to={item.url}
                          className='flex items-center gap-3 px-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center'
                        >
                          <div className='relative flex items-center justify-center'>
                            <item.icon className='h-5 w-5 transition-transform' />
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
    </>
  )
}
