import { Navigate, Route, Routes } from 'react-router-dom'

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
import HomePage from '../pages/HomePage/HomePage/Homepage'
import { ToastContainer } from 'react-toastify'
import Auth from '@/app/pages/Auth/Auth'
import ResetPassword from '../pages/Auth/ResetPassword/ResetPassword'
import OauthLogin from '@/app/pages/Auth/OauthLogin/OauthLogin'
import VerifyEmail from '../pages/Auth/VerfiEmail/VerifyEmail'
import Profile from '@/app/pages/Customer/Profile/Profile'
import Blog from '@/app/pages/HomePage/Blog/Blog'
import Order from '@/app/pages/Customer/Order/Order'
import MenstrualCycle from '@/app/pages/HomePage/MenstrualCycle/MenstrualCycle'
import BlogDetail from '../pages/HomePage/Blog/BlogDetail'
import staffPath from '@/app/routes/paths/staffPath'
import DashboardStaff from '@/app/pages/Staff/DashboardStaff/DashboardStaff'
import BlogStaff from '@/app/pages/Staff/BlogStaff/BlogStaff'
import TestPackages from '@/app/pages/HomePage/TestPackages/TestPackages'
import VerifyPasscode from '../pages/Auth/VerifyPasscode/VerifyPasscode'
import HomePageLayout from '../pages/HomePage/HomePageLayout'
import BlogDetailStaff from '../pages/Staff/BlogStaff/BlogDetailStaff'
import CreateBlog from '../pages/Staff/BlogStaff/CreateBlog'
import EditBlog from '../pages/Staff/BlogStaff/EditBlog'
import TagStaff from '../pages/Staff/TagStaff/TagStaff'
import Forum from '@/app/pages/HomePage/Forum/Forum'
import CreateTag from '../pages/Staff/TagStaff/CreateTag'
import PaymentSuccess from '../pages/HomePage/Payment/PaymentSuccess'
import PaymentFailed from '../pages/HomePage/Payment/PaymentFailed'

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
        <Route path='/' element={<HomePageLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/test-packages' element={<TestPackages />} />
          <Route path='/menstrual-cycle' element={<MenstrualCycle />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/blog/:id' element={<BlogDetail />} />
          <Route path='/forum' element={<Forum />} />
          <Route path='/payment/success' element={<PaymentSuccess />} />
          <Route path='/payment/failed' element={<PaymentFailed />} />
        </Route>

        <Route path='/login/oauth' element={<OauthLogin />} />

        <Route path='/auth' element={<Auth />}>
          <Route index element={<Navigate to={authPath.login} replace />} />
          <Route path={authPath.login} element={<Login />} />
          <Route path={authPath.register} element={<Register />} />
          <Route path={authPath.forgotPassword} element={<ForgetPassword />} />
          <Route path={authPath.resetPassword} element={<ResetPassword />} />
          {/* Route for verify/reset user click from email */}
          <Route path={authPath.verifyEmail} element={<VerifyEmail />} />
          {/* Route for verify otp */}
          <Route path={authPath.verifyPasscode} element={<VerifyPasscode />} />
        </Route>

        <Route path='/customer' element={<Customer />}>
          <Route index element={<Navigate to={customerPath.dashboard} replace />} />
          <Route path={customerPath.dashboard} element={<Dashboard />} />
          <Route path={customerPath.menstrualCycle} element={<MenstrualCycle />} />
          <Route path={customerPath.orders} element={<Order />} />
        </Route>

        <Route path='/admin' element={<Admin />}>
          <Route index element={<Navigate to={adminPath.dashboard} replace />} />
          <Route path={adminPath.dashboard} element={<DashboardAdmin />} />
        </Route>

        <Route path='/consultant' element={<Consultant />}></Route>

        <Route path='/staff' element={<Staff />}>
          <Route index element={<Navigate to={staffPath.dashboard} replace />} />
          <Route path={staffPath.dashboard} element={<DashboardStaff />} />
          <Route path={staffPath.blog} element={<BlogStaff />} />
          <Route path={staffPath.blogDetail} element={<BlogDetailStaff />} />
          <Route path={staffPath.blogCreate} element={<CreateBlog />} />
          <Route path={staffPath.blogEdit} element={<EditBlog />} />
          <Route path={staffPath.tag} element={<TagStaff />} />
          <Route path={staffPath.tagCreate} element={<CreateTag />} />
        </Route>
      </Routes>
    </>
  )
}
