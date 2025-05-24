import { Route, Routes } from 'react-router-dom'

import Admin from '../pages/Admin/Admin'
import ForgetPassword from '../pages/Auth/ForgetPassword/ForgetPassword'
import Login from '../pages/Auth/Login/Login'
import Register from '../pages/Auth/Register/Register'
import Consultant from '../pages/Consultant/Consultant'
import Customer from '../pages/Customer/Customer'
import Staff from '../pages/Staff/Staff'
import authPath from './paths/authPath'
import customerPath from './paths/customerPath'
import Dashboard from '../pages/Customer/Dashboard/Dashboard'
import DashboardAdmin from '../pages/Admin/Dashboard/Dashboard'
import adminPath from './paths/adminPath'
import HomePage from '../pages/HomePage/Homepage'
import { ToastContainer } from 'react-toastify'
import Auth from '@/app/pages/Auth/Auth'
import ResetPassword from '../pages/Auth/ResetPassword/ResetPassword'

export default function MainRoutes() {
  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
      <Routes>
        <Route path='/' element={<HomePage />} />

        {/* Route for verify/reset user click from email */}
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/auth' element={<Auth />}>
          <Route path={authPath.login} element={<Login />} />
          <Route path={authPath.register} element={<Register />} />
          <Route path={authPath.forgotPassword} element={<ForgetPassword />} />
        </Route>

        <Route path='/customer' element={<Customer />}>
          <Route path={customerPath.dashboard} element={<Dashboard />} />
        </Route>

        <Route path='/admin' element={<Admin />}>
          <Route path={adminPath.dashboard} element={<DashboardAdmin />} />
        </Route>

        <Route path='/consultant' element={<Consultant />}></Route>

        <Route path='/staff' element={<Staff />}></Route>
      </Routes>
    </>
  )
}
