import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Button } from '@/app/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { format } from 'date-fns'
import { memo, useEffect, useState } from 'react'
import type { ConsultantData } from '../ConsultantManagement'

export interface EditConsultantModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedConsultant: ConsultantData | null
  setSelectedConsultant: React.Dispatch<React.SetStateAction<ConsultantData | null>>
  onSave: () => Promise<void>
  onCancel: () => void
}

const EditConsultantModal = memo(
  ({ isOpen, onOpenChange, selectedConsultant, setSelectedConsultant, onSave, onCancel }: EditConsultantModalProps) => {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null)

    const handleInputChange = <K extends keyof ConsultantData>(field: K, value: ConsultantData[K]) => {
      setSelectedConsultant((prev) => (prev ? { ...prev, [field]: value } : prev))
    }

    useEffect(() => {
      if (!selectedConsultant) {
        setAvatarPreview(null)
        return
      }
      if (selectedConsultant.avatar instanceof File) {
        const url = URL.createObjectURL(selectedConsultant.avatar)
        setAvatarPreview(url)
        return () => URL.revokeObjectURL(url)
      }
      setAvatarPreview(typeof selectedConsultant.avatar === 'string' ? selectedConsultant.avatar : null)
    }, [selectedConsultant])

    useEffect(() => {
      if (!selectedConsultant) {
        setCoverPhotoPreview(null)
        return
      }
      if (selectedConsultant.coverPhoto instanceof File) {
        const url = URL.createObjectURL(selectedConsultant.coverPhoto)
        setCoverPhotoPreview(url)
        return () => URL.revokeObjectURL(url)
      }
      setCoverPhotoPreview(typeof selectedConsultant.coverPhoto === 'string' ? selectedConsultant.coverPhoto : null)
    }, [selectedConsultant])

    if (!selectedConsultant) return null

    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[700px] max-h-[95vh]'>
          <DialogHeader className='pb-4'>
            <DialogTitle>Edit Consultant Profile</DialogTitle>
          </DialogHeader>

          <div className='overflow-y-auto max-h-[calc(90vh-120px)] p-2'>
            <div className='space-y-4'>
              {[
                { id: 'name', label: 'Name', type: 'text' },
                { id: 'username', label: 'Username', type: 'text' },
                { id: 'email', label: 'Email', type: 'email' },
                { id: 'phone_number', label: 'Phone Number', type: 'text' },
                { id: 'bio', label: 'Bio', type: 'text' },
                { id: 'description', label: 'Description', type: 'text' },
                { id: 'location', label: 'Location', type: 'text' },
                { id: 'website', label: 'Website', type: 'url' },
                { id: 'degree', label: 'Degree', type: 'text' },
                { id: 'hospital', label: 'Hospital', type: 'text' },
                {
                  id: 'date_of_birth',
                  label: 'Date of Birth',
                  type: 'date'
                },
                {
                  id: 'specialties',
                  label: 'Specialties (comma separated)',
                  type: 'text'
                },
                {
                  id: 'languages',
                  label: 'Languages (comma separated)',
                  type: 'text'
                },
                { id: 'experience', label: 'Experience (Years)', type: 'text' },
                { id: 'response_time', label: 'Response Time (Minutes)', type: 'text' }
              ].map(({ id, label, type }) => (
                <div key={id} className='space-y-2'>
                  <Label htmlFor={id} className='text-sm font-medium'>
                    {label}
                  </Label>
                  <Input
                    id={id}
                    type={type}
                    value={(() => {
                      const fieldValue = selectedConsultant[id as keyof ConsultantData]

                      if (id === 'date_of_birth' && fieldValue && typeof fieldValue === 'string') {
                        return format(new Date(fieldValue), 'yyyy-MM-dd')
                      }
                      if (id === 'specialties' && Array.isArray(fieldValue)) {
                        return fieldValue.join(', ')
                      }
                      if (id === 'languages' && Array.isArray(fieldValue)) {
                        return fieldValue.join(', ')
                      }

                      if (typeof fieldValue === 'string' || typeof fieldValue === 'number') {
                        return String(fieldValue)
                      }
                      return ''
                    })()}
                    onChange={(e) => {
                      const value = e.target.value
                      let processedValue: any = value

                      if (id === 'specialties' || id === 'languages') {
                        processedValue = value.split(',').map((s) => s.trim())
                      } else if (type === 'date' && value) {
                        processedValue = new Date(value).toISOString()
                      }

                      handleInputChange(id as keyof ConsultantData, processedValue)
                    }}
                    className='w-full'
                  />
                </div>
              ))}

              {/* Image Upload Section */}
              <div className='space-y-4 pt-4 border-t'>
                <h3 className='text-lg font-medium'>Images</h3>

                {[
                  { field: 'avatar', label: 'Avatar', preview: avatarPreview },
                  { field: 'coverPhoto', label: 'Cover Photo', preview: coverPhotoPreview }
                ].map(({ field, label, preview }) => (
                  <div key={field} className='space-y-2'>
                    <Label className='text-sm font-medium'>{label}</Label>
                    <div className='flex items-center gap-4'>
                      {preview ? (
                        <Avatar className='w-16 h-16'>
                          <AvatarImage src={preview} />
                          <AvatarFallback>{selectedConsultant.name ?? 'N/A'}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-sm text-gray-500'>
                          No {label.toLowerCase()}
                        </div>
                      )}
                      <Input
                        type='file'
                        accept='image/*'
                        onChange={(e) => handleInputChange(field as keyof ConsultantData, e.target.files?.[0] ?? null)}
                        className='flex-1'
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className='py-3 border-t'>
            <Button variant='outline' onClick={onCancel}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={onSave}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
)

EditConsultantModal.displayName = 'EditConsultantModal'

export default EditConsultantModal
