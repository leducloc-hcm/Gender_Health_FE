import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import { X, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { specialtyApi } from '@/app/apis/specialty.api'
import type { SpecialtyDataResponse } from '@/app/pages/Admin/SpecialtyManagement/Models/SpecialtyManagement'

interface SpecialtySelectorProps {
  selectedSpecialtyIds: number[]
  onSelectionChange: (specialtyIds: number[]) => void
  disabled?: boolean
}

export const SpecialtySelector = ({ selectedSpecialtyIds, onSelectionChange, disabled = false }: SpecialtySelectorProps) => {
  const [availableSpecialties, setAvailableSpecialties] = useState<SpecialtyDataResponse[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        setIsLoading(true)
        const response = await specialtyApi.getAllSpecialties()
        setAvailableSpecialties(response.data)
      } catch (error) {
        console.error('Error fetching specialties:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSpecialties()
  }, [])

  const selectedSpecialties = availableSpecialties.filter((specialty) =>
    selectedSpecialtyIds.includes(specialty.id)
  )

  const unselectedSpecialties = availableSpecialties.filter((specialty) =>
    !selectedSpecialtyIds.includes(specialty.id)
  )

  const handleAddSpecialty = (specialtyId: number) => {
    onSelectionChange([...selectedSpecialtyIds, specialtyId])
  }

  const handleRemoveSpecialty = (specialtyId: number) => {
    onSelectionChange(selectedSpecialtyIds.filter((id) => id !== specialtyId))
  }

  return (
    <div className="space-y-2">
      {/* Selected Specialties */}
      <div className="flex flex-wrap gap-2">
        {selectedSpecialties.map((specialty) => (
          <Badge
            key={specialty.id}
            className='flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 font-medium'
          >
            {specialty.name}
            {!disabled && (
              <button
                type='button'
                onClick={() => handleRemoveSpecialty(specialty.id)}
                className='ml-1 hover:bg-white/20 rounded-full p-0.5'
              >
                <X className='h-3 w-3' />
              </button>
            )}
          </Badge>
        ))}
      </div>

      {/* Add Specialty Button */}
      {!disabled && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 border-dashed"
              disabled={isLoading || unselectedSpecialties.length === 0}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Specialty
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-2" align="start">
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="text-sm text-muted-foreground p-2">Loading specialties...</div>
              ) : unselectedSpecialties.length === 0 ? (
                <div className="text-sm text-muted-foreground p-2">No more specialties available</div>
              ) : (
                unselectedSpecialties.map((specialty) => (
                  <button
                    key={specialty.id}
                    type="button"
                    onClick={() => {
                      handleAddSpecialty(specialty.id)
                      setIsOpen(false)
                    }}
                    className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm transition-colors"
                  >
                    <div className="font-medium">{specialty.name}</div>
                    {specialty.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {specialty.description}
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
