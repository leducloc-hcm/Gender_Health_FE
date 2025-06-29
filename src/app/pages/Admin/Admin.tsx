import { SidebarInset, SidebarProvider } from '@/app/components/ui/sidebar'
import AdminHeader from '@/app/layouts/AdminLayout/AdminHeader'
import AdminSidebar from '@/app/layouts/AdminLayout/AdminSidebar'
import { Outlet } from 'react-router-dom'

export default function Admin() {
  return (
    <>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <AdminHeader />
          <div className='min-h-full bg-gray-50 p-6'>
            <div className='max-w-7xl mx-auto space-y-6'>
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
