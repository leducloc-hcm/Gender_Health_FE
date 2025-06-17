import { fetcher } from '@/app/apis/fetcher'
import { sUserProfile } from '@/app/hooks/sUserProfile'
import CycleInput from '@/app/pages/HomePage/MenstrualCycle/partials/CycleInput/CycleInput'
import Fertility from '@/app/pages/HomePage/MenstrualCycle/partials/Fertility/Fertility'
import Medication from '@/app/pages/HomePage/MenstrualCycle/partials/Medication/Medication'
import Mood from '@/app/pages/HomePage/MenstrualCycle/partials/Mood/Mood'
import type { PredictionData } from '@/app/pages/HomePage/MenstrualCycle/partials/Summary/models/summary.type'
import Summary from '@/app/pages/HomePage/MenstrualCycle/partials/Summary/Summary'
import Symptoms from '@/app/pages/HomePage/MenstrualCycle/partials/Symtomps/Symtomps'
import Welcome from '@/app/pages/HomePage/MenstrualCycle/partials/Welcome/Welcome'
import { useEffect, useState } from 'react'

export default function MenstrualCycle() {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [menstrualCycleId, setMenstrualCycleId] = useState<number | null>(null)
  const [predictionData, setPredictionData] = useState<PredictionData>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const checkPredictionData = async () => {
      try {
        setIsLoading(true)
        const customerProfileId = sUserProfile.value.customer_profile_id
        const response = await fetcher.get(`/prediction/${customerProfileId}`)
        const predictData = response.data

        if (predictData) {
          setPredictionData(predictData)
          setCurrentStep(6)
        } else {
          setCurrentStep(0)
        }
      } catch (error) {
        console.error('Error fetching prediction data:', error)
        setCurrentStep(0)
      } finally {
        setIsLoading(false)
      }
    }
    checkPredictionData()
  }, [])

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const skipToEnd = () => {
    setCurrentStep(6)
  }

  const handleCycleCreated = (cycleId: number) => {
    setMenstrualCycleId(cycleId)
    nextStep()
  }

  const handleRestartFlow = () => {
    setCurrentStep(1)
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <Welcome onNext={nextStep} />
      case 1:
        return <CycleInput onNext={handleCycleCreated} />
      case 2:
        return <Symptoms menstrualCycleId={menstrualCycleId} onNext={nextStep} onSkipAll={skipToEnd} />
      case 3:
        return <Fertility menstrualCycleId={menstrualCycleId} onNext={nextStep} onSkipAll={skipToEnd} />
      case 4:
        return <Medication menstrualCycleId={menstrualCycleId} onNext={nextStep} onSkipAll={skipToEnd} />
      case 5:
        return <Mood menstrualCycleId={menstrualCycleId} onNext={nextStep} onSkipAll={skipToEnd} />
      case 6:
        return <Summary onStartNewCycle={handleRestartFlow} />
      default:
        return <Welcome onNext={nextStep} />
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4'>
            <div className='w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
          </div>
          <h3 className='text-xl font-bold text-pink-600 mb-2'>Loading your cycle data...</h3>
          <p className='text-gray-600'>Please wait while we check your tracking history</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-4'>
        <div className='max-w-6xl mx-auto'>
          {renderCurrentStep()}

          {currentStep < 6 && (
            <div className='flex justify-center mt-8'>
              <div className='flex space-x-2'>
                {[0, 1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full ${
                      step === currentStep ? 'bg-pink-500' : step < currentStep ? 'bg-pink-300' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
