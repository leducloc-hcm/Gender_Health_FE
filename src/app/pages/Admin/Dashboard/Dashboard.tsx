import { DollarSign, FlaskConical, ShoppingCart, Users } from 'lucide-react'
import Metrics from './Partials/Metrics'
import { useEffect, useState } from 'react'
import type { PaymentDetail } from '../../HomePage/TestPackages/models/PaymentTest'
import type { OrderData } from '../../HomePage/TestPackages/models/OrderTest'
import type { TestCategory } from '../../HomePage/TestPackages/models/TestPackages'
import type { CountUser, RevenuePerPackage } from '@/app/models/AdminResponse'
import { toast } from 'react-toastify'
import LoadingSpinner from '@/app/components/ui/loadingspinner'
import { adminApi } from '@/app/apis/admin.api'
import RevenueChart from './Partials/RevenueChart'
import UserCountChart from './Partials/UserCountChart'

export default function Dashboard() {
  const primaryColor = '#ec4899'
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [dataRevenue, setDataRevenue] = useState<RevenuePerPackage[]>([])
  const [dataUserCount, setDataUserCount] = useState<CountUser>()
  const [dataPayment, setDataPayment] = useState<PaymentDetail[]>([])
  const [dataOrder, setDataOrder] = useState<OrderData[]>([])
  const [dataTest, setDataTest] = useState<TestCategory[]>([])

  // Tổng doanh thu
  const totalRevenue = dataRevenue.reduce((sum, item) => {
    return sum + parseFloat(item.totalAmount)
  }, 0)

  // Tổng người dùng
  const totalUsers = dataUserCount ? Object.values(dataUserCount).reduce((sum, count) => sum + count, 0) : 0

  // Tổng đơn hàng và số lượng test
  const totalOrders = dataOrder.length
  const totalTests = dataTest.length

  const metrics = [
    {
      title: 'Total Revenue',
      value: `${totalRevenue.toLocaleString()}₫`,
      change: '18.5%',
      changeText: '+18% from last month',
      icon: DollarSign
    },
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      change: '12.0%',
      changeText: '+12% from last month',
      icon: Users
    },
    {
      title: 'Total Orders',
      value: totalOrders.toLocaleString(),
      change: '5.0%',
      changeText: '+5% from last quarter',
      icon: ShoppingCart
    },
    {
      title: 'Total Tests',
      value: totalTests.toLocaleString(),
      change: '2.1%',
      changeText: '+2% from last quarter',
      icon: FlaskConical
    }
  ]

  const fetchData = async (): Promise<void> => {
    setIsLoading(true)
    try {
      // Fetch All Data
      const [revenueRes, countUserRes, ordersRes, paymentsRes, testsRes] = await Promise.all([
        adminApi.getRevenuePackage(),
        adminApi.getCountUser(),
        adminApi.getAllOrders(),
        adminApi.getAllPayments(),
        adminApi.getAllTestCategory()
      ])

      setDataRevenue(revenueRes.data)
      setDataUserCount(countUserRes.count)
      setDataOrder(ordersRes.data)
      setDataPayment(paymentsRes.data)
      setDataTest(testsRes.data)
    } catch (error: any) {
      console.error('Failed to fetch data:', error)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold'>Dashboard</h1>
      <h3 className='text-lg text-gray-500 font-normal italic mb-4'>Overview of system performance and key metrics.</h3>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4'>
        {metrics.map((item, index) => (
          <Metrics
            key={index}
            title={item.title}
            change={item.change}
            changeText={item.changeText}
            icon={item.icon}
            value={item.value}
          />
        ))}
      </div>

      <div className='grid gap-4 md:grid-cols-1 lg:grid-cols-2'>
        <RevenueChart key={'RevenueChart'} revenueDataFromServer={dataRevenue} primaryColor={primaryColor} />
        <UserCountChart key={'UserCountChart'} countUser={dataUserCount} primaryColor={primaryColor} />
        <div className='table-container'></div>
      </div>
    </div>
  )
}
