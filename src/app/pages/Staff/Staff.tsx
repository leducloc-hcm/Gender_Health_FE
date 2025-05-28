import { SidebarInset, SidebarProvider } from '@/app/components/ui/sidebar'
import StaffHeader from '@/app/layouts/StaffLayout/StaffHeader'
import StaffSidebar from '@/app/layouts/StaffLayout/StaffSidebar'
import { Outlet } from 'react-router-dom'

export default function Staff() {
  return (
    <>
      <SidebarProvider>
        <StaffSidebar />
        <SidebarInset>
          <StaffHeader />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
