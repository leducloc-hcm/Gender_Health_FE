import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/app/components/ui/chart'
import type { RevenuePerPackage } from '@/app/models/AdminResponse'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

type DataProps = {
  revenueDataFromServer: RevenuePerPackage[]
  primaryColor: string
}

export default function RevenueChart({ revenueDataFromServer, primaryColor }: DataProps) {
  const chartData = revenueDataFromServer?.map((item) => ({
    name: item.testPackageName,
    revenue: Number(item.totalAmount)
  }))

  const chartConfig = {
    revenue: {
      label: 'Revenue',
      color: primaryColor
    }
  }

  return (
    <Card className='w-full h-full overflow-hidden bg-white transition-transform duration-200 hover:scale-102 hover:shadow-md'>
      <CardHeader>
        <CardTitle className='text-xl font-medium'>Revenue by Test Package</CardTitle>
        <CardDescription className='text-lg text-gray-500 font-normal italic mb-4'>
          Total revenue generated over 4 test packages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-[300px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
              <XAxis dataKey='name' axisLine={false} tickLine={false} className='text-muted-foreground' />
              <YAxis
                axisLine={false}
                tickLine={false}
                className='text-muted-foreground'
                tickFormatter={(value) =>
                  value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)} tr` : `${value / 1000} k`
                }
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value) => [`${Number(value).toLocaleString()} ₫`]}
              />
              <Line
                type='monotone'
                dataKey='revenue'
                stroke={primaryColor}
                strokeWidth={3}
                dot={{
                  fill: primaryColor,
                  strokeWidth: 2,
                  r: 4
                }}
                activeDot={{
                  r: 6,
                  stroke: primaryColor,
                  strokeWidth: 2
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
