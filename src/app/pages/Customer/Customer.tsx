import { SidebarInset, SidebarProvider } from '@/app/components/ui/sidebar'
import CustomerHeader from '@/app/layouts/CustomerLayout/CustomerHeader'
import CustomerSidebar from '@/app/layouts/CustomerLayout/CustomerSidebar'
import { Outlet } from 'react-router-dom'

export default function Customer() {
  return (
    <>
      <SidebarProvider>
        <CustomerSidebar />
        <SidebarInset>
          <CustomerHeader />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
