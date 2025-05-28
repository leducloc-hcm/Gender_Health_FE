import { api } from '@/app/apis/fetcherToken'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import type { UserProfile } from '@/app/pages/HomePage/MenstrualCycle/models/menstrual.type'
import type { PredictionData } from '@/app/pages/HomePage/MenstrualCycle/partials/Summary/models/summary.type'
import { addDays, differenceInDays, format, isWithinInterval } from 'date-fns'
import { Activity, Baby, Calendar, Clock, Droplets, Loader2, Sparkles, Target, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const CycleChart = ({ predictionData }: { predictionData: PredictionData }) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const today = new Date()
  const cycleStart = new Date(predictionData.prediction.predictedStartDate)
  const cycleEnd = new Date(predictionData.prediction.predictedEndDate)
  const fertileStart = new Date(predictionData.pregnancyAbility.fertileWindowStart)
  const fertileEnd = new Date(predictionData.pregnancyAbility.fertileWindowEnd)

  // Calculate countdown to next menstrual period
  const daysUntilMenstrual = Math.max(0, differenceInDays(cycleStart, today))

  // Calculate cycle length and menstrual period length
  const cycleLength = predictionData.prediction.cycleLength
  const menstrualDays = differenceInDays(cycleEnd, cycleStart) + 1

  // Calculate phases based on actual cycle data
  const menstrualPhase = {
    start: 1,
    end: menstrualDays,
    color: '#ec4899',
    name: 'Menstrual',
    startDate: cycleStart,
    endDate: cycleEnd
  }

  // Follicular phase starts after menstrual ends
  const follicularStartDate = addDays(cycleEnd, 1)
  const follicularEndDate = addDays(fertileStart, -1)
  const follicularDays = Math.max(1, differenceInDays(follicularEndDate, follicularStartDate) + 1)

  const follicularPhase = {
    start: menstrualPhase.end + 1,
    end: menstrualPhase.end + follicularDays,
    color: '#f472b6',
    name: 'Follicular',
    startDate: follicularStartDate,
    endDate: follicularEndDate
  }

  // Ovulation phase is the fertile window
  const ovulationDays = differenceInDays(fertileEnd, fertileStart) + 1
  const ovulationPhase = {
    start: follicularPhase.end + 1,
    end: follicularPhase.end + ovulationDays,
    color: '#f97316',
    name: 'Ovulation',
    startDate: fertileStart,
    endDate: fertileEnd
  }

  // Luteal phase is the rest of the cycle
  const lutealStartDate = addDays(fertileEnd, 1)
  const lutealEndDate = addDays(cycleStart, cycleLength - 1)

  const lutealPhase = {
    start: ovulationPhase.end + 1,
    end: cycleLength,
    color: '#c084fc',
    name: 'Luteal',
    startDate: lutealStartDate,
    endDate: lutealEndDate
  }

  // Calculate current day based on today's position in cycle
  const daysSinceCycleStart = differenceInDays(today, cycleStart)
  let currentDay = 1

  if (daysSinceCycleStart >= 0 && daysSinceCycleStart < cycleLength) {
    currentDay = daysSinceCycleStart + 1
  } else if (daysSinceCycleStart < 0) {
    currentDay = cycleLength + daysSinceCycleStart + 1
  } else {
    currentDay = (daysSinceCycleStart % cycleLength) + 1
  }

  const getCurrentPhase = (day: number) => {
    if (day <= menstrualPhase.end) return menstrualPhase
    if (day <= follicularPhase.end) return follicularPhase
    if (day <= ovulationPhase.end) return ovulationPhase
    return lutealPhase
  }

  // Get specific date for a cycle day
  const getDateForDay = (day: number) => {
    return addDays(cycleStart, day - 1)
  }

  // Generate chart data
  const chartData = []
  for (let day = 1; day <= cycleLength; day++) {
    const phase = getCurrentPhase(day)
    const date = getDateForDay(day)

    let intensity = 0.7
    if (phase.name === 'Menstrual') intensity = 0.9
    if (phase.name === 'Ovulation') intensity = 1.0
    if (phase.name === 'Luteal') intensity = 0.8

    chartData.push({
      day,
      phase: phase.name,
      color: phase.color,
      intensity,
      isCurrent: day === currentDay,
      date: date,
      phaseInfo: phase
    })
  }

  const radius = 180
  const centerX = 220
  const centerY = 220

  const handleMouseMove = (event: React.MouseEvent, day: number) => {
    const svgRect = event.currentTarget.closest('svg')?.getBoundingClientRect()
    if (svgRect) {
      setMousePosition({
        x: event.clientX - svgRect.left,
        y: event.clientY - svgRect.top
      })
    }
    setHoveredDay(day)
  }

  const handleMouseLeave = () => {
    setHoveredDay(null)
  }

  return (
    <div className='relative flex flex-col items-center'>
      <div className='relative'>
        <svg width='440' height='440' className='mx-auto'>
          {chartData.map((item, index) => {
            const angle = (index * 360) / cycleLength - 90
            const radian = (angle * Math.PI) / 180
            const innerRadius = 120
            const outerRadius = radius // Removed current day expansion

            const x1 = centerX + Math.cos(radian) * innerRadius
            const y1 = centerY + Math.sin(radian) * innerRadius
            const x2 = centerX + Math.cos(radian) * outerRadius
            const y2 = centerY + Math.sin(radian) * outerRadius

            const nextAngle = ((index + 1) * 360) / cycleLength - 90
            const nextRadian = (nextAngle * Math.PI) / 180
            const x3 = centerX + Math.cos(nextRadian) * outerRadius
            const y3 = centerY + Math.sin(nextRadian) * outerRadius
            const x4 = centerX + Math.cos(nextRadian) * innerRadius
            const y4 = centerY + Math.sin(nextRadian) * innerRadius

            const isHovered = hoveredDay === item.day

            return (
              <g key={index}>
                <path
                  d={`M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}`}
                  fill={item.color}
                  opacity={isHovered ? 1 : item.intensity}
                  stroke={isHovered ? '#ffffff' : 'none'}
                  strokeWidth={isHovered ? 2 : 0}
                  className={`cursor-pointer transition-all duration-200 ${isHovered ? 'drop-shadow-lg' : ''}`}
                  onMouseMove={(e) => handleMouseMove(e, item.day)}
                  onMouseLeave={handleMouseLeave}
                />
                {/* Removed current day indicator */}
              </g>
            )
          })}

          {/* Enhanced Center content with countdown */}
          <circle
            cx={centerX}
            cy={centerY}
            r='115'
            fill='white'
            stroke='#f3e8ff'
            strokeWidth='3'
            className='drop-shadow-lg'
          />

          {/* Countdown to next period */}
          <text x={centerX} y={centerY - 20} textAnchor='middle' className='text-5xl font-bold fill-pink-600'>
            {daysUntilMenstrual}
          </text>

          <text x={centerX} y={centerY + 5} textAnchor='middle' className='text-lg font-semibold fill-pink-700'>
            {daysUntilMenstrual === 0
              ? 'Period Today!'
              : daysUntilMenstrual === 1
                ? 'day until period'
                : 'days until period'}
          </text>

          {/* Next period date */}
          <text x={centerX} y={centerY + 30} textAnchor='middle' className='text-sm fill-gray-600'>
            {format(cycleStart, 'MMM dd, yyyy')}
          </text>

          {/* Phase icon */}
          <text x={centerX} y={centerY + 55} textAnchor='middle' className='text-2xl'>
            🩸
          </text>
        </svg>

        {/* Enhanced Tooltip - Fixed positioning */}
        {hoveredDay && (
          <div
            className='absolute z-50 bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border border-pink-200 p-4 pointer-events-none'
            style={{
              left: Math.min(mousePosition.x, 440 - 240), // Keep within bounds
              top: Math.max(mousePosition.y - 200, 10), // Position above cursor
              minWidth: '240px',
              maxWidth: '280px'
            }}
          >
            <div className='text-center space-y-3'>
              <div className='flex items-center justify-center gap-2'>
                <div
                  className='w-4 h-4 rounded-full'
                  style={{ backgroundColor: chartData[hoveredDay - 1]?.color }}
                ></div>
                <span className='font-bold text-gray-800 text-lg'>Day {hoveredDay}</span>
              </div>

              <div className='text-base text-gray-700 font-medium'>
                {format(getDateForDay(hoveredDay), 'EEEE, MMMM dd, yyyy')}
              </div>

              <div className='text-base font-semibold text-pink-700 bg-pink-50 px-3 py-1 rounded-full'>
                {chartData[hoveredDay - 1]?.phase} Phase
              </div>

              {/* Phase date range */}
              <div className='text-sm text-gray-600 bg-gray-50 p-3 rounded-lg'>
                <div className='font-medium mb-1'>{chartData[hoveredDay - 1]?.phase} Phase Duration:</div>
                <div>
                  {format(chartData[hoveredDay - 1]?.phaseInfo.startDate, 'MMM dd')} -{' '}
                  {format(chartData[hoveredDay - 1]?.phaseInfo.endDate, 'MMM dd, yyyy')}
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  (
                  {differenceInDays(
                    chartData[hoveredDay - 1]?.phaseInfo.endDate,
                    chartData[hoveredDay - 1]?.phaseInfo.startDate
                  ) + 1}{' '}
                  days)
                </div>
              </div>

              {/* Phase description */}
              <div className='text-xs text-gray-600 pt-2 border-t border-gray-200'>
                {chartData[hoveredDay - 1]?.phase === 'Menstrual' && '🩸 Menstruation period - Rest and self-care time'}
                {chartData[hoveredDay - 1]?.phase === 'Follicular' &&
                  '🌱 Energy building phase - Great for new projects'}
                {chartData[hoveredDay - 1]?.phase === 'Ovulation' && '🥚 Peak fertility window - Highest energy levels'}
                {chartData[hoveredDay - 1]?.phase === 'Luteal' &&
                  '🌙 Progesterone phase - Time to slow down and reflect'}
              </div>

              {/* Special markers */}
              <div className='flex flex-wrap gap-1 justify-center'>
                {hoveredDay === currentDay && (
                  <div className='text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full border border-pink-200 font-medium'>
                    Today
                  </div>
                )}

                {isWithinInterval(getDateForDay(hoveredDay), { start: fertileStart, end: fertileEnd }) && (
                  <div className='text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full border border-orange-200 font-medium'>
                    Fertile Window
                  </div>
                )}

                {hoveredDay <= menstrualPhase.end && (
                  <div className='text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full border border-red-200 font-medium'>
                    Period Days
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Legend with actual date ranges */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 w-full max-w-4xl'>
        <div className='flex items-center gap-3 p-4 bg-white rounded-lg shadow-md border border-pink-100 hover:shadow-lg transition-shadow'>
          <div className='w-5 h-5 rounded-full bg-pink-500'></div>
          <div className='flex-1'>
            <div className='font-medium text-gray-800'>Menstrual</div>
            <div className='text-xs text-gray-500'>
              Days {menstrualPhase.start}-{menstrualPhase.end}
            </div>
            <div className='text-xs text-pink-600 mt-1 font-medium'>
              {format(menstrualPhase.startDate, 'MMM dd')} - {format(menstrualPhase.endDate, 'MMM dd')}
            </div>
          </div>
        </div>

        <div className='flex items-center gap-3 p-4 bg-white rounded-lg shadow-md border border-pink-100 hover:shadow-lg transition-shadow'>
          <div className='w-5 h-5 rounded-full bg-pink-400'></div>
          <div className='flex-1'>
            <div className='font-medium text-gray-800'>Follicular</div>
            <div className='text-xs text-gray-500'>
              Days {follicularPhase.start}-{follicularPhase.end}
            </div>
            <div className='text-xs text-pink-600 mt-1 font-medium'>
              {format(follicularPhase.startDate, 'MMM dd')} - {format(follicularPhase.endDate, 'MMM dd')}
            </div>
          </div>
        </div>

        <div className='flex items-center gap-3 p-4 bg-white rounded-lg shadow-md border border-pink-100 hover:shadow-lg transition-shadow'>
          <div className='w-5 h-5 rounded-full bg-orange-500'></div>
          <div className='flex-1'>
            <div className='font-medium text-gray-800'>Ovulation</div>
            <div className='text-xs text-gray-500'>
              Days {ovulationPhase.start}-{ovulationPhase.end}
            </div>
            <div className='text-xs text-orange-600 mt-1 font-medium'>
              {format(ovulationPhase.startDate, 'MMM dd')} - {format(ovulationPhase.endDate, 'MMM dd')}
            </div>
          </div>
        </div>

        <div className='flex items-center gap-3 p-4 bg-white rounded-lg shadow-md border border-pink-100 hover:shadow-lg transition-shadow'>
          <div className='w-5 h-5 rounded-full bg-purple-400'></div>
          <div className='flex-1'>
            <div className='font-medium text-gray-800'>Luteal</div>
            <div className='text-xs text-gray-500'>
              Days {lutealPhase.start}-{lutealPhase.end}
            </div>
            <div className='text-xs text-purple-600 mt-1 font-medium'>
              {format(lutealPhase.startDate, 'MMM dd')} - {format(lutealPhase.endDate, 'MMM dd')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Summary() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        const userResponse = await api.get('/users/me')
        console.log('User profile response:', userResponse.data)
        console.log(userProfile)

        setUserProfile(userResponse.data.result)
        const customerProfileId = userResponse.data.result.customer_profile_id
        const predictionResponse = await api.get(`/prediction/${customerProfileId}`)
        console.log('Prediction response:', predictionResponse.data)
        setPredictionData(predictionResponse.data.data)
      } catch (error: any) {
        console.error('Failed to fetch data:', error)
        setError(error.response?.data?.message || 'Failed to load data')
        toast.error(error.response?.data?.message || 'Failed to load prediction data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const getDaysUntilNextPeriod = () => {
    if (!predictionData) return 0
    const today = new Date()
    const nextPeriod = new Date(predictionData.prediction.predictedStartDate)
    return Math.max(0, differenceInDays(nextPeriod, today))
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center'>
        <Card className='w-full max-w-md mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm'>
          <CardContent className='p-8'>
            <div className='flex flex-col items-center justify-center space-y-6'>
              <div className='relative'>
                <div className='w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center'>
                  <Loader2 className='w-8 h-8 animate-spin text-white' />
                </div>
                <Sparkles className='w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-bounce' />
              </div>
              <div className='text-center'>
                <h3 className='text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent'>
                  Creating Your Cycle Summary
                </h3>
                <p className='text-gray-600 mt-2'>Analyzing your personal data...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center'>
        <Card className='w-full max-w-md mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm'>
          <CardContent className='p-8'>
            <div className='text-center space-y-4 '>
              <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto'>
                <TrendingUp className='w-8 h-8 text-red-500' />
              </div>
              <div>
                <h3 className='text-lg font-semibold text-red-600'>Something went wrong</h3>
                <p className='text-gray-600 mt-1'>{error}</p>
              </div>
              <Button onClick={() => window.location.reload()} className='bg-red-500 hover:bg-red-600 text-white'>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const daysUntilPeriod = getDaysUntilNextPeriod()

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100'>
      <div className='w-full max-w-7xl mx-auto p-6 space-y-10'>
        {/* Large Cycle Visualization - Full Width */}
        <Card className='shadow-2xl border-0 bg-white/90 backdrop-blur-sm mt-4 pt-4'>
          <CardHeader className=' rounded-t-lg'>
            <CardTitle className='flex items-center justify-center gap-3 text-3xl'>
              <div className='w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500  rounded-full flex items-center justify-center'>
                <Activity className='w-6 h-6 text-white ' />
              </div>
              Your Cycle Visualization
            </CardTitle>
            <CardDescription className='text-center text-gray-600 text-lg'>
              Interactive view of your current cycle phase and timeline
            </CardDescription>
          </CardHeader>
          <CardContent className='p-10'>{predictionData && <CycleChart predictionData={predictionData} />}</CardContent>
        </Card>

        {/* Quick Stats Row */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <Card className='shadow-xl border-0 bg-gradient-to-br from-pink-500 to-rose-500 text-white transform hover:scale-105 transition-transform'>
            <CardContent className='p-8'>
              <div className='flex items-center justify-between'>
                <div>
                  <div className='flex items-center gap-2 mb-3'>
                    <Clock className='w-6 h-6' />
                    <span className='text-pink-100 text-lg'>Next Period</span>
                  </div>
                  <div className='text-4xl font-bold'>{daysUntilPeriod}</div>
                  <div className='text-pink-100 text-lg'>days away</div>
                </div>
                <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center'>
                  <Droplets className='w-10 h-10' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='shadow-xl border-0 bg-gradient-to-br from-rose-500 to-pink-600 text-white transform hover:scale-105 transition-transform'>
            <CardContent className='p-8'>
              <div className='flex items-center justify-between'>
                <div>
                  <div className='flex items-center gap-2 mb-3'>
                    <Target className='w-6 h-6' />
                    <span className='text-rose-100 text-lg'>Fertility</span>
                  </div>
                  <div className='text-4xl font-bold'>{predictionData?.pregnancyAbility.pregnancyPercent}%</div>
                  <div className='text-rose-100 text-lg'>chance</div>
                </div>
                <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center'>
                  <Baby className='w-10 h-10' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='shadow-xl border-0 bg-gradient-to-br from-pink-600 to-rose-600 text-white transform hover:scale-105 transition-transform'>
            <CardContent className='p-8'>
              <div className='flex items-center justify-between'>
                <div>
                  <div className='flex items-center gap-2 mb-3'>
                    <Calendar className='w-6 h-6' />
                    <span className='text-pink-100 text-lg'>Cycle Length</span>
                  </div>
                  <div className='text-4xl font-bold'>{predictionData?.prediction.cycleLength}</div>
                  <div className='text-pink-100 text-lg'>days</div>
                </div>
                <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center'>
                  <TrendingUp className='w-10 h-10' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Predictions */}
        {predictionData && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <Card className='shadow-xl border-0 bg-white/90 backdrop-blur-sm'>
              <CardHeader className=' rounded-t-lg mt-4 pt-4'>
                <CardTitle className='flex items-center gap-2 text-pink-800 text-xl'>
                  <Droplets className='w-6 h-6' />
                  Next Period Details
                </CardTitle>
              </CardHeader>
              <CardContent className='p-6 space-y-4'>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center p-4 bg-pink-50 rounded-lg border border-pink-100'>
                    <span className='text-gray-700 font-medium text-lg'>Start Date</span>
                    <Badge variant='secondary' className='bg-pink-100 text-pink-800 px-4 py-2 text-base'>
                      {format(new Date(predictionData.prediction.predictedStartDate), 'MMM dd, yyyy')}
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center p-4 bg-pink-50 rounded-lg border border-pink-100'>
                    <span className='text-gray-700 font-medium text-lg'>End Date</span>
                    <Badge variant='secondary' className='bg-pink-100 text-pink-800 px-4 py-2 text-base'>
                      {format(new Date(predictionData.prediction.predictedEndDate), 'MMM dd, yyyy')}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='shadow-xl border-0 bg-white/90 backdrop-blur-sm'>
              <CardHeader className=' rounded-t-lg mt-4 pt-4'>
                <CardTitle className='flex items-center gap-2 text-pink-800 text-xl'>
                  <Target className='w-6 h-6' />
                  Fertile Window
                </CardTitle>
              </CardHeader>
              <CardContent className='p-6 space-y-4'>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center p-4 bg-pink-50 rounded-lg border border-pink-100'>
                    <span className='text-gray-700 font-medium text-lg'>Window Start</span>
                    <Badge variant='outline' className='border-pink-200 text-pink-800 px-4 py-2 text-base'>
                      {format(new Date(predictionData.pregnancyAbility.fertileWindowStart), 'MMM dd')}
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center p-4 bg-pink-50 rounded-lg border border-pink-100'>
                    <span className='text-gray-700 font-medium text-lg'>Window End</span>
                    <Badge variant='outline' className='border-pink-200 text-pink-800 px-4 py-2 text-base'>
                      {format(new Date(predictionData.pregnancyAbility.fertileWindowEnd), 'MMM dd')}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
