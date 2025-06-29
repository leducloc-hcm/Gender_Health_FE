import { Navigate, Route, Routes } from 'react-router-dom'

import ConsultantManagement from '@/app/pages/Admin/ConsultantManagement/ConsultantManagement'
import CustomerManagement from '@/app/pages/Admin/CustomerManagement/CustomerManagement'
import StaffManagement from '@/app/pages/Admin/StaffManagement/StaffManagement'
import Auth from '@/app/pages/Auth/Auth'
import OauthLogin from '@/app/pages/Auth/OauthLogin/OauthLogin'
import Blog from '@/app/pages/HomePage/Blog/Blog'
import Forum from '@/app/pages/HomePage/Forum/Forum'
import MenstrualCycle from '@/app/pages/HomePage/MenstrualCycle/MenstrualCycle'
import Profile from '@/app/pages/HomePage/Profile/Profile'
import StiTracking from '@/app/pages/HomePage/StiTracking/StiTracking'
import TestPackages from '@/app/pages/HomePage/TestPackages/TestPackages'
import BlogStaff from '@/app/pages/Staff/BlogStaff/BlogStaff'
import DashboardStaff from '@/app/pages/Staff/DashboardStaff/DashboardStaff'
import CreateResultOfTest from '@/app/pages/Staff/ResultOfTest/CreateResultOfTest'
import ResultOfTest from '@/app/pages/Staff/ResultOfTest/ResultOfTest'
import ViewResultOfTest from '@/app/pages/Staff/ResultOfTest/ViewResultOfTest'
import StiTrackingStaff from '@/app/pages/Staff/StiTracking/StiTracking'
import staffPath from '@/app/routes/paths/staffPath'
import { ToastContainer } from 'react-toastify'
import AccountManagement from '../pages/Admin/AccountManagement/AccountManagement'
import Admin from '../pages/Admin/Admin'
import DashboardAdmin from '../pages/Admin/Dashboard/Dashboard'
import OrderManagement from '../pages/Admin/OrderManagement/OrderManagement'
import PaymentManagement from '../pages/Admin/PaymentManagement/PaymentManagement'
import TestManagement from '../pages/Admin/TestManagement/TestManagement'
import TestPackageManagement from '../pages/Admin/TestPackageManagement/TestPackageManagement'
import TypeOfTestManagement from '../pages/Admin/TypeOfTestManagement/TypeOfTestManagement'
import ForgetPassword from '../pages/Auth/ForgetPassword/ForgetPassword'
import Login from '../pages/Auth/Login/Login'
import Register from '../pages/Auth/Register/Register'
import ResetPassword from '../pages/Auth/ResetPassword/ResetPassword'
import VerifyEmail from '../pages/Auth/VerfiEmail/VerifyEmail'
import VerifyPasscode from '../pages/Auth/VerifyPasscode/VerifyPasscode'
import CalendarBooking from '../pages/Consultant/CalendarBooking/CalendarBooking'
import Consultant from '../pages/Consultant/Consultant'
import ConsultingManagement from '../pages/Consultant/ConsultingManagement/ConsultingManagement'
import BlogDetail from '../pages/HomePage/Blog/BlogDetail'
import BookingConsultant from '../pages/HomePage/BookingConsultant/BookingConsultant'
import CustomerCalendar from '../pages/HomePage/CustomerCalendar/CustomerCalendar'
import HomePage from '../pages/HomePage/HomePage/Homepage'
import HomePageLayout from '../pages/HomePage/HomePageLayout'
import PaymentFailed from '../pages/HomePage/Payment/PaymentFailed'
import PaymentSuccess from '../pages/HomePage/Payment/PaymentSuccess'
import BlogDetailStaff from '../pages/Staff/BlogStaff/BlogDetailStaff'
import CreateBlog from '../pages/Staff/BlogStaff/CreateBlog'
import EditBlog from '../pages/Staff/BlogStaff/EditBlog'
import ProfileConsultantManagement from '../pages/Staff/ProfileConsultantManagement/ProfileConsultantManagement'
import Schedule from '../pages/Staff/Schedule/Schedule'
import Staff from '../pages/Staff/Staff'
import CreateTag from '../pages/Staff/TagStaff/CreateTag'
import EditTag from '../pages/Staff/TagStaff/EditTag'
import TagStaff from '../pages/Staff/TagStaff/TagStaff'
import adminPath from './paths/adminPath'
import authPath from './paths/authPath'
import ScrollToTop from '@/app/components/ui/autoScroll'

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
      <ScrollToTop />
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
          <Route path='/calendar' element={<CustomerCalendar />} />
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

        <Route path='/admin' element={<Admin />}>
          <Route index element={<Navigate to={adminPath.dashboard} replace />} />
          <Route path={adminPath.dashboard} element={<DashboardAdmin />} />
          <Route path={adminPath.account} element={<AccountManagement />} />
          <Route path={adminPath.payment} element={<PaymentManagement />} />
          <Route path={adminPath.order} element={<OrderManagement />} />
          <Route path={adminPath.testPackge} element={<TestPackageManagement />} />
          <Route path={adminPath.typeOfTest} element={<TypeOfTestManagement />} />
          <Route path={adminPath.test} element={<TestManagement />} />
          <Route path={adminPath.customer} element={<CustomerManagement />} />
          <Route path={adminPath.consultant} element={<ConsultantManagement />} />
          <Route path={adminPath.staff} element={<StaffManagement />} />
        </Route>

        <Route path='/consultant' element={<Consultant />}>
          <Route index element={<Navigate to='/consultant/calendar' replace />} />
          <Route path='/consultant/calendar' element={<CalendarBooking />} />
          <Route path='/consultant/ConsultingManagement' element={<ConsultingManagement />} />
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
          <Route path={staffPath.viewResultOfTest} element={<ViewResultOfTest />} />
        </Route>
      </Routes>
    </>
  )
}
