import { Outlet } from 'react-router-dom'
import Header from './HomePage/partials/Header'
import Footer from '@/app/pages/HomePage/HomePage/partials/Footer'

export default function HomePageLayout() {
  return (
    <>
      <Header />
      <div className='min-h-100vh'>
        <Outlet />
      </div>
      <Footer />
    </>
  )
}
