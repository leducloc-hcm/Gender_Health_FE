import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { ArrowUpDown, CheckCircle, Clock, User, TestTube, FileText } from 'lucide-react'
import type { Data } from '@/app/pages/Staff/StiTracking/models/sti.type'

interface StiColumnsProps {
  onPscVisited: (id: number) => void
  onSampleCollected: (id: number) => void
  onReportDate: (id: number) => void
  actionLoading: { [key: string]: boolean }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    WAITING_FOR_PSC_VISIT: {
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      icon: Clock,
      text: 'WAITING FOR PSC VISIT'
    },
    PSC_VISITED: {
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: User,
      text: 'PSC VISITED'
    },
    COLLECTED: {
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: TestTube,
      text: 'SAMPLE COLLECTED'
    },
    REPORT_READY: {
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: FileText,
      text: 'REPORT READY'
    },
    RESULT_AVAILABLE: {
      color: 'bg-green-50 text-green-700 border-green-200',
      icon: CheckCircle,
      text: 'RESULT AVAILABLE'
    }
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.WAITING_FOR_PSC_VISIT
  const IconComponent = config.icon

  return (
    <Badge className={`${config.color} border px-2 py-1 flex items-center gap-1 w-fit`}>
      <IconComponent className='w-3 h-3' />
      {config.text}
    </Badge>
  )
}

const ProgressStep = ({
  isCompleted,
  isActive,
  icon: Icon,
  label,
  date
}: {
  isCompleted: boolean
  isActive: boolean
  icon: any
  label: string
  date: string | null
}) => {
  return (
    <div className='flex flex-col items-center space-y-1 w-20'>
      <div
        className={`
        w-10 h-10 rounded-full flex items-center justify-center border-2 
        ${
          isCompleted
            ? 'bg-green-100 border-green-500 text-green-700'
            : isActive
              ? 'bg-blue-100 border-blue-500 text-blue-700'
              : 'bg-gray-100 border-gray-300 text-gray-500'
        }
      `}
      >
        <Icon className='w-4 h-4' />
      </div>
      <div className='text-center min-h-[40px] flex flex-col justify-start'>
        <div
          className={`text-xs font-medium ${isCompleted ? 'text-green-700' : isActive ? 'text-blue-700' : 'text-gray-500'}`}
        >
          {label}
        </div>
        <div className='text-xs text-gray-400 mt-1 h-4 flex items-center justify-center'>
          {date ? formatDate(date) : ''}
        </div>
      </div>
    </div>
  )
}

const ProgressTracker = ({ item }: { item: Data }) => {
  const steps = [
    {
      key: 'psc',
      label: 'PSC Visit',
      icon: User,
      isCompleted:
        !!item.pscVisited || ['PSC_VISITED', 'COLLECTED', 'REPORT_READY', 'RESULT_AVAILABLE'].includes(item.status),
      date: item.pscVisited
    },
    {
      key: 'collected',
      label: 'Collected',
      icon: TestTube,
      isCompleted: !!item.collectedDate || ['COLLECTED', 'REPORT_READY', 'RESULT_AVAILABLE'].includes(item.status),
      date: item.collectedDate
    },
    {
      key: 'report_ready',
      label: 'Report Ready',
      icon: FileText,
      isCompleted: !!item.reportDate || ['REPORT_READY', 'RESULT_AVAILABLE'].includes(item.status),
      date: item.reportDate
    }
  ]

  return (
    <div className='flex items-center space-x-4'>
      {steps.map((step, index) => {
        const isActive = !step.isCompleted && (index === 0 || steps[index - 1].isCompleted)

        return (
          <div key={step.key} className='flex items-center'>
            <ProgressStep
              isCompleted={step.isCompleted}
              isActive={isActive}
              icon={step.icon}
              label={step.label}
              date={step.date}
            />
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-2 ${steps[index + 1].isCompleted ? 'bg-green-300' : 'bg-gray-300'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export const getStiColumns = ({
  onPscVisited,
  onSampleCollected,
  onReportDate,
  actionLoading
}: StiColumnsProps): ColumnDef<Data>[] => [
  {
    id: 'no',
    header: ({ column }) => (
      <div className='flex items-center justify-center'>
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='font-semibold'
        >
          No
          <ArrowUpDown className='h-4 w-4' />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center justify-center space-x-3 min-w-[100px]'>
        <div className='text-sm font-semibold text-gray-900'>{row.original.id}</div>
      </div>
    )
  },
  {
    accessorKey: 'customer',
    header: () => (
      <div className='flex items-center justify-center'>
        <div>Customer Name</div>
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center justify-center space-x-3 min-w-[100px]'>
        <div className='text-sm font-semibold text-gray-900'>{row.original.orderItem.order.customerProfile.name}</div>
      </div>
    )
  },
  {
    id: 'testId',
    header: () => <div className='flex justify-center'>Test Packages</div>,
    cell: ({ row }) => <div className='flex justify-center'>{row.original.id}</div>
  },
  {
    id: 'progress',
    header: () => (
      <div className='flex items-center justify-center'>
        <div>Process Tracking</div>
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        <ProgressTracker item={row.original} />
      </div>
    )
  },
  {
    id: 'actions',
    header: () => <div className='flex items-center justify-center'>Action</div>,
    cell: ({ row }) => {
      const item = row.original

      const getNextAction = () => {
        if (item.status === 'WAITING_FOR_PSC_VISIT' || !item.pscVisited) {
          return {
            action: () => onPscVisited(item.id),
            label: 'Mark PSC Visited',
            loadingKey: `psc-${item.id}`,
            bgColor: 'bg-blue-500 hover:bg-blue-600',
            icon: User
          }
        }

        if (item.status === 'PSC_VISITED' || (item.pscVisited && !item.collectedDate)) {
          return {
            action: () => onSampleCollected(item.id),
            label: 'Mark Sample Collected',
            loadingKey: `sample-${item.id}`,
            bgColor: 'bg-green-500 hover:bg-green-600',
            icon: TestTube
          }
        }

        if (item.status === 'COLLECTED' || (item.collectedDate && !item.reportDate)) {
          return {
            action: () => onReportDate(item.id),
            label: 'Set Report Date',
            loadingKey: `report-${item.id}`,
            bgColor: 'bg-purple-500 hover:bg-purple-600',
            icon: FileText
          }
        }

        return null
      }

      const nextAction = getNextAction()

      if (!nextAction) {
        return (
          <div className='flex items-center justify-center p-4'>
            <div className='flex items-center space-x-2 text-green-600'>
              <CheckCircle className='w-5 h-5' />
              <span className='text-sm font-medium'>Completed</span>
            </div>
          </div>
        )
      }

      const isLoading = actionLoading[nextAction.loadingKey]

      return (
        <div className='flex justify-center'>
          <Button
            onClick={nextAction.action}
            disabled={isLoading}
            className={`${nextAction.bgColor} text-white transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 min-w-[140px]`}
            size='sm'
          >
            {isLoading ? (
              <div className='flex items-center '>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className='flex items-center '>
                <span>{nextAction.label}</span>
              </div>
            )}
          </Button>
        </div>
      )
    }
  }
]
