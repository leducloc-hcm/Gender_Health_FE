import { SidebarInset, SidebarProvider } from "@/app/components/ui/sidebar";
import AdminHeader from "@/app/layouts/AdminLayout/AdminHeader";
import AdminSidebar from "@/app/layouts/AdminLayout/AdminSidebar";
import { Outlet } from "react-router-dom";

export default function Admin() {
  return  (
    <>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <AdminHeader />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
