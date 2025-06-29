import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { ArrowUpRight, type LucideIcon } from 'lucide-react'

type DataProps = {
  title: string
  value: string
  change: string
  changeText: string
  icon: LucideIcon
}

export default function Metrics({ title, value, change, changeText, icon }: DataProps) {
  const Icon = icon

  return (
    <>
      <Card className='bg-white transition-transform duration-200 hover:scale-105 hover:shadow-md cursor-default'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-xl font-medium'>{title}</CardTitle>
          <Icon className='h-5 w-5 text-gray-600' />
        </CardHeader>
        <CardContent>
          <div className='text-4xl font-bold text-gray-900 mb-2'>{value}</div>
          <div className='flex items-center justify-between space-x-2 text-base'>
            <span className='font-medium text-green-600 flex items-center justify-start'>
              <ArrowUpRight className='h-4 w-4' />
              {change}
            </span>
            <span className='text-gray-500'>{changeText}</span>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
