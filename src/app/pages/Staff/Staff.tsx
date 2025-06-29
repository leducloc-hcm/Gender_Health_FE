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
          <div className='min-h-screen bg-gray-50 p-6'>
            <div className='max-w-7xl mx-auto space-y-6'>
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
