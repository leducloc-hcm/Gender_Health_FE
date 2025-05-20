import { Route, Routes } from 'react-router-dom'

import Admin from '../pages/Admin/Admin'
import ForgetPassword from '../pages/Auth/ForgetPassword/ForgetPassword'
import Login from '../pages/Auth/Login/Login'
import Register from '../pages/Auth/Register/Register'
import Consultant from '../pages/Consultant/Consultant'
import Customer from '../pages/Customer/Customer'
import Homepage from '../pages/Homepage'
import Staff from '../pages/Staff/Staff'
import authPath from './paths/authPath'
import customerPath from './paths/customerPath'
import Dashboard from '../pages/Customer/Dashboard/Dashboard'
import DashboardAdmin from '../pages/Admin/Dashboard/Dashboard'
import adminPath from './paths/adminPath'

export default function MainRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path={authPath.login} element={<Login />} />
      <Route path={authPath.register} element={<Register />} />
      <Route path={authPath.forgotPassword} element={<ForgetPassword />} />

      <Route path='/customer' element={<Customer />}>
        <Route path={customerPath.dashboard} element={<Dashboard />} />
      </Route>

      <Route path='/admin' element={<Admin />}>
        <Route path={adminPath.dashboard} element={<DashboardAdmin />} />
      </Route>

      <Route path='/consultant' element={<Consultant />}></Route>

      <Route path='/staff' element={<Staff />}></Route>
    </Routes>
  )
}
