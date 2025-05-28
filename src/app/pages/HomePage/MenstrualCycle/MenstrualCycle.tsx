import Header from '@/app/pages/HomePage/HomePage/partials/Header'
import CycleInput from '@/app/pages/HomePage/MenstrualCycle/partials/CycleInput/CycleInput'
import Fertility from '@/app/pages/HomePage/MenstrualCycle/partials/Fertility/Fertility'
import Medication from '@/app/pages/HomePage/MenstrualCycle/partials/Medication/Medication'
import Mood from '@/app/pages/HomePage/MenstrualCycle/partials/Mood/Mood'
import Summary from '@/app/pages/HomePage/MenstrualCycle/partials/Summary/Summary'
import Symptoms from '@/app/pages/HomePage/MenstrualCycle/partials/Symtomps/Symtomps'
import Welcome from '@/app/pages/HomePage/MenstrualCycle/partials/Welcome/Welcome'
import { useState } from 'react'

export default function MenstrualCycle() {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [menstrualCycleId, setMenstrualCycleId] = useState<number | null>(null)

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
        return <Summary />
      default:
        return <Welcome onNext={nextStep} />
    }
  }

  return (
    <>
      <Header />
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
