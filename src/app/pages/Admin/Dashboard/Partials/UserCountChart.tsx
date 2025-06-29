import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/app/components/ui/chart'
import type { CountUser } from '@/app/models/AdminResponse'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'

type DataProps = {
  countUser?: CountUser
  primaryColor: string
}

export default function UserCountChart({ countUser, primaryColor }: DataProps) {
  if (!countUser) return null
  //   const countUser: CountUser = {
  //     CUSTOMER: 120,
  //     STAFF: 15,
  //     GUEST: 42,
  //     ADMIN: 4,
  //     CONSULTANT: 9
  //   }

  const chartData = Object.entries(countUser).map(([role, count]) => ({
    role,
    count
  }))

  const chartConfig = {
    count: {
      label: 'Users',
      color: primaryColor
    }
  }

  return (
    <Card className='w-full h-full overflow-hidden bg-white transition-transform duration-200 hover:scale-102 hover:shadow-md'>
      <CardHeader>
        <CardTitle className='text-xl font-medium'>User Roles Overview</CardTitle>
        <CardDescription className='text-lg text-gray-500 font-normal italic mb-4'>
          Total number of users by role
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-[300px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
              <XAxis dataKey='role' axisLine={false} tickLine={false} className='text-muted-foreground' />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} className='text-muted-foreground' />
              <ChartTooltip content={<ChartTooltipContent />} formatter={(value) => [`${value}`, ' Users']} />
              <Bar dataKey='count' fill={primaryColor} radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
