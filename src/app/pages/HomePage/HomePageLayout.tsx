import { Outlet } from 'react-router-dom'
import Header from './HomePage/partials/Header'

export default function HomePageLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
