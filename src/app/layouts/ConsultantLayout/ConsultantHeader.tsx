import { SidebarTrigger } from '@/app/components/ui/sidebar'
import NotificationDropdown from './partials/NotificationDropdown'
import UserDropdown from './partials/UserDropdown'
import { useEffect, useState } from 'react'
import { authApi } from '@/app/apis/auth.api'
import { sConsultantProfile } from '@/app/hooks/sConsultantProfile'
import type { consultantProfile } from '@/app/pages/Consultant/models/Consultant'
export default function ConsultantHeader() {
  const [consultantProfile, setConsultantProfile] = useState<consultantProfile | null>(null)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await authApi.getProfileConsultant()
        setConsultantProfile(response.result)
        sConsultantProfile.set(response.result)
      } catch (error) {
        console.log('error: ', error)
      }
    }
    fetchUserProfile()
  }, [])
  return (
    <header className='flex h-20 shrink-0 items-center gap-2 bg-white border-b border-pink-100'>
      <div className='flex items-center gap-4 px-6'>
        <SidebarTrigger className='h-8 w-8 rounded-lg hover:bg-pink-50 transition-colors' />
        <div className='h-6 w-px bg-pink-200' />
        <div>
          <p className='text-xl font-bold text-pink-600'>Welcome back, {consultantProfile?.name}...!</p>
        </div>
      </div>
      <div className='ml-auto flex items-center gap-3 px-6'>
        <NotificationDropdown />
        <UserDropdown />
      </div>
    </header>
  )
}
