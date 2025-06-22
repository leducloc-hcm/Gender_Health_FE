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
import EditTag from '../pages/Staff/TagStaff/EditTag'
import PaymentSuccess from '../pages/HomePage/Payment/PaymentSuccess'
import PaymentFailed from '../pages/HomePage/Payment/PaymentFailed'
import CalendarBooking from '../pages/Consultant/CalendarBooking/CalendarBooking'
import Schedule from '../pages/Staff/Schedule/Schedule'
import BookingConsultant from '../pages/HomePage/HomePage/BookingConsultant/BookingConsultant'
import ProfileConsultantManagement from '../pages/Staff/ProfileConsultantManagement/ProfileConsultantManagement'
import AccountManagement from '../pages/Admin/AccountManagement/AccountManagement'
import PaymentManagement from '../pages/Admin/PaymentManagement/PaymentManagement'
import TestPackageManagement from '../pages/Admin/TestPackageManagement/TestPackageManagement'
import TypeOfTestManagement from '../pages/Admin/TypeOfTestManagement/TypeOfTestManagement'
import OrderManagement from '../pages/Admin/OrderManagement/OrderManagement'
import TestManagement from '../pages/Admin/TestManagement/TestManagement'
import StiTrackingStaff from '@/app/pages/Staff/StiTracking/StiTracking'
import StiTracking from '@/app/pages/HomePage/StiTracking/StiTracking'
import ResultOfTest from '@/app/pages/Staff/ResultOfTest/ResultOfTest'
import CreateResultOfTest from '@/app/pages/Staff/ResultOfTest/CreateResultOfTest'

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
          <Route path='/booking-consultant' element={<BookingConsultant />} />
          <Route path='/menstrual-cycle' element={<MenstrualCycle />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/blog/:id' element={<BlogDetail />} />
          <Route path='/forum' element={<Forum />} />
          <Route path='/payment/success' element={<PaymentSuccess />} />
          <Route path='/payment/failed' element={<PaymentFailed />} />
          <Route path='/sti-tracking' element={<StiTracking />} />
        </Route>

        <Route path='/login/oauth' element={<OauthLogin />} />

        <Route path='/auth' element={<Auth />}>
          <Route index element={<Navigate to={authPath.login} replace />} />
          <Route path={authPath.login} element={<Login />} />
          <Route path={authPath.register} element={<Register />} />
          <Route path={authPath.forgotPassword} element={<ForgetPassword />} />
          <Route path={authPath.resetPassword} element={<ResetPassword />} />
          <Route path={authPath.verifyEmail} element={<VerifyEmail />} />
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
          <Route path={adminPath.account} element={<AccountManagement />} />
          <Route path={adminPath.payment} element={<PaymentManagement />} />
          <Route path={adminPath.order} element={<OrderManagement />} />
          <Route path={adminPath.testPackge} element={<TestPackageManagement />} />
          <Route path={adminPath.typeOfTest} element={<TypeOfTestManagement />} />
          <Route path={adminPath.test} element={<TestManagement />} />
        </Route>

        <Route path='/consultant' element={<Consultant />}>
          <Route index element={<Navigate to='/consultant/calendar' replace />} />
          <Route path='/consultant/calendar' element={<CalendarBooking />} />
        </Route>

        <Route path='/staff' element={<Staff />}>
          <Route index element={<Navigate to={staffPath.dashboard} replace />} />
          <Route path={staffPath.dashboard} element={<DashboardStaff />} />
          <Route path={staffPath.blog} element={<BlogStaff />} />
          <Route path={staffPath.blogDetail} element={<BlogDetailStaff />} />
          <Route path={staffPath.blogCreate} element={<CreateBlog />} />
          <Route path={staffPath.blogEdit} element={<EditBlog />} />
          <Route path={staffPath.tag} element={<TagStaff />} />
          <Route path={staffPath.tagCreate} element={<CreateTag />} />
          <Route path={staffPath.tagEdit} element={<EditTag />} />
          <Route path={staffPath.schedule} element={<Schedule />} />
          <Route path={staffPath.ConsultantProfileManagement} element={<ProfileConsultantManagement />} />
          <Route path={staffPath.stisTracking} element={<StiTrackingStaff />} />
          <Route path={staffPath.resultOfTest} element={<ResultOfTest />} />
          <Route path={staffPath.createResultOfTest} element={<CreateResultOfTest />} />
        </Route>
      </Routes>
    </>
  )
}
