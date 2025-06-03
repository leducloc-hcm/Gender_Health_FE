import { SidebarInset, SidebarProvider } from '@/app/components/ui/sidebar'
import ConsultantHeader from '@/app/layouts/ConsultantLayout/ConsultantHeader'
import ConsultantSidebar from '@/app/layouts/ConsultantLayout/ConsultantStaffSidebar'
import { Outlet } from 'react-router-dom'

export default function Consultant() {
  return (
    <SidebarProvider>
      <ConsultantSidebar />
      <SidebarInset>
        <ConsultantHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
