import { profileApi } from '@/app/apis/profile.api'
import { staffApi } from '@/app/apis/staff.api'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Button } from '@/app/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { format } from 'date-fns'
import { memo, useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { getScheduleColumns } from './partials/columns'
import DataTable from './partials/DataTable'

import type { ProfileConsultantResult as OriginalProfileConsultantResult } from '@/app/pages/Staff/ProfileConsultantManagement/models/ProfleConsultantManagement'
import { Activity } from 'lucide-react'

export interface ProfileConsultantResult extends Omit<OriginalProfileConsultantResult, 'avatar' | 'coverPhoto'> {
  avatar: string | File | null
  coverPhoto: string | File | null
}

interface EditConsultantModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedConsultant: ProfileConsultantResult | null
  setSelectedConsultant: React.Dispatch<React.SetStateAction<ProfileConsultantResult | null>>
  onSave: () => Promise<void>
  onCancel: () => void
}

interface ViewConsultantModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedConsultant: ProfileConsultantResult | null
}

// EditConsultantModal Component
const EditConsultantModal = memo(
  ({ isOpen, onOpenChange, selectedConsultant, setSelectedConsultant, onSave, onCancel }: EditConsultantModalProps) => {
    // State for image previews
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null)

    // Handle input changes with generic type
    const handleInputChange = <K extends keyof ProfileConsultantResult>(
      field: K,
      value: ProfileConsultantResult[K]
    ) => {
      setSelectedConsultant((prev) => (prev ? { ...prev, [field]: value } : prev))
    }

    // Generate temporary URLs for image previews
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
        <DialogContent className='sm:max-w-[600px] max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Edit Consultant Profile</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            {[
              { id: 'name', label: 'Name', type: 'text' },
              { id: 'username', label: 'Username', type: 'text' },
              { id: 'email', label: 'Email', type: 'email' },
              { id: 'role', label: 'Role', type: 'text' },
              { id: 'status', label: 'Status', type: 'text' },
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
                type: 'date',
                formatter: (value?: string) => (value ? format(new Date(value), 'yyyy-MM-dd') : '')
              },
              {
                id: 'specialties',
                label: 'Specialties',
                type: 'text',
                formatter: (value?: string[]) => value?.join(', ') || '',
                parser: (value: string) => value.split(',').map((s) => s.trim())
              },
              {
                id: 'languages',
                label: 'Languages',
                type: 'text',
                formatter: (value?: string[]) => value?.join(', ') || '',
                parser: (value: string) => value.split(',').map((s) => s.trim())
              },
              {
                id: 'rating',
                label: 'Rating',
                type: 'number',
                props: { step: '0.1', min: '0', max: '5' },
                parser: (value: string) => parseFloat(value) || 0
              },
              {
                id: 'total_reviews',
                label: 'Total Reviews',
                type: 'number',
                props: { min: '0' },
                parser: (value: string) => parseInt(value, 10) || 0
              },
              { id: 'experience', label: 'Experience (Years)', type: 'text' },
              { id: 'response_time', label: 'Response Time (Mins)', type: 'text' }
            ].map(({ id, label, type, props, parser }) => (
              <div key={id} className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor={id} className='text-right'>
                  {label}
                </Label>
                <Input
                  id={id}
                  type={type}
                  value={(() => {
                    const fieldValue = selectedConsultant[id as keyof ProfileConsultantResult]

                    // Handle specific formatters
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
                  onChange={(e) =>
                    handleInputChange(
                      id as keyof ProfileConsultantResult,
                      parser
                        ? parser(e.target.value)
                        : type === 'date' && e.target.value
                          ? new Date(e.target.value).toISOString()
                          : e.target.value
                    )
                  }
                  className='col-span-3'
                  {...props}
                />
              </div>
            ))}
            {[
              { field: 'avatar', label: 'Avatar', preview: avatarPreview },
              { field: 'coverPhoto', label: 'Cover Photo', preview: coverPhotoPreview }
            ].map(({ field, label, preview }) => (
              <div key={field} className='grid grid-cols-4 items-center gap-4'>
                <Label className='text-right'>{label}</Label>
                <div className='col-span-3 flex items-center gap-4'>
                  {preview ? (
                    <Avatar className='w-16 h-16'>
                      <AvatarImage src={preview} />
                      <AvatarFallback>{selectedConsultant.name ?? 'N/A'}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <span>No {label.toLowerCase()}</span>
                  )}
                  <Input
                    id={field}
                    type='file'
                    accept='image/*'
                    onChange={(e) =>
                      handleInputChange(field as keyof ProfileConsultantResult, e.target.files?.[0] ?? null)
                    }
                    className='w-auto'
                  />
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
)

// ViewConsultantModal Component
const ViewConsultantModal = memo(({ isOpen, onOpenChange, selectedConsultant }: ViewConsultantModalProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className='sm:max-w-[600px] max-h-[80vh] overflow-y-auto'>
      <DialogHeader>
        <DialogTitle>Consultant Profile Details</DialogTitle>
      </DialogHeader>
      {selectedConsultant && (
        <div className='grid gap-4 py-4'>
          {[
            { label: 'Name', value: selectedConsultant.name ?? 'No name' },
            { label: 'Username', value: selectedConsultant.username ?? 'No username' },
            { label: 'Email', value: selectedConsultant.email ?? 'No email' },
            { label: 'Role', value: selectedConsultant.role ?? 'N/A' },
            { label: 'Status', value: selectedConsultant.status ?? 'Unknown' },
            { label: 'Phone Number', value: selectedConsultant.phone_number ?? 'No phone' },
            { label: 'Bio', value: selectedConsultant.bio ?? 'No bio' },
            { label: 'Description', value: selectedConsultant.description ?? 'No description' },
            { label: 'Location', value: selectedConsultant.location ?? 'No location' },
            {
              label: 'Date of Birth',
              value: selectedConsultant.date_of_birth
                ? format(new Date(selectedConsultant.date_of_birth), 'dd MMM yyyy')
                : 'No date of birth'
            },
            {
              label: 'Website',
              value: selectedConsultant.website ? (
                <a
                  href={selectedConsultant.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 hover:underline'
                >
                  {selectedConsultant.website}
                </a>
              ) : (
                'No website'
              )
            },
            {
              label: 'Specialties',
              value: selectedConsultant.specialties?.length
                ? selectedConsultant.specialties.join(', ')
                : 'No specialties'
            },
            {
              label: 'Languages',
              value: selectedConsultant.languages?.length ? selectedConsultant.languages.join(', ') : 'No languages'
            },
            {
              label: 'Rating',
              value: selectedConsultant.rating != null ? selectedConsultant.rating.toFixed(1) : 'No rating'
            },
            { label: 'Total Reviews', value: selectedConsultant.total_reviews ?? 'No reviews' },
            {
              label: 'Experience',
              value: selectedConsultant.experience ? `${selectedConsultant.experience} years` : 'No experience'
            },
            {
              label: 'Response Time',
              value: selectedConsultant.response_time ? `${selectedConsultant.response_time} mins` : 'No response time'
            },
            { label: 'Degree', value: selectedConsultant.degree ?? 'No degree' },
            { label: 'Hospital', value: selectedConsultant.hospital ?? 'No hospital' },
            {
              label: 'Created At',
              value: selectedConsultant.created_at
                ? format(new Date(selectedConsultant.created_at), 'dd MMM yyyy HH:mm')
                : 'Invalid Date'
            },
            {
              label: 'Updated At',
              value: selectedConsultant.updated_at
                ? format(new Date(selectedConsultant.updated_at), 'dd MMM yyyy HH:mm')
                : 'Invalid Date'
            }
          ].map(({ label, value }) => (
            <div key={label} className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>{label}</Label>
              <span className='col-span-3'>{value}</span>
            </div>
          ))}
          <div className='flex justify-center gap-8'>
            {(['avatar', 'coverPhoto'] as const).map((field) => (
              <div key={field} className='grid grid-cols-4 items-center gap-4'>
                <Label className='text-right font-bold'>{field === 'avatar' ? 'Avatar' : 'Cover Photo'}</Label>
                <div className='col-span-3'>
                  {typeof selectedConsultant[field] === 'string' && selectedConsultant[field] ? (
                    <Avatar className='w-16 h-16'>
                      <AvatarImage src={selectedConsultant[field] as string} />
                      <AvatarFallback>{selectedConsultant.name ?? 'N/A'}</AvatarFallback>
                    </Avatar>
                  ) : (
                    `No ${field === 'avatar' ? 'avatar' : 'cover photo'}`
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <DialogFooter>
        <Button variant='outline' onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
))

// Main Component
const ProfileConsultantManagement = () => {
  const [consultants, setConsultants] = useState<ProfileConsultantResult[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedConsultant, setSelectedConsultant] = useState<ProfileConsultantResult | null>(null)
  const [originalConsultant, setOriginalConsultant] = useState<ProfileConsultantResult | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const response = await staffApi.getAllProfileConsultants()
      setConsultants(response.result)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch consultants', { position: 'top-right', autoClose: 2000 })
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])
  const handleEdit = useCallback((consultant: ProfileConsultantResult) => {
    setOriginalConsultant({ ...consultant })
    setSelectedConsultant({ ...consultant })
    setIsEditModalOpen(true)
  }, [])

  const handleView = useCallback((consultant: ProfileConsultantResult) => {
    setSelectedConsultant(consultant)
    setIsViewModalOpen(true)
    toast.info(`Viewing consultant ID: ${consultant.id}`, { position: 'top-right', autoClose: 1000 })
  }, [])

  const handleSliceToArrayString = useCallback((value: string | string[] | undefined): string[] => {
    if (Array.isArray(value)) return value
    // Handle string input - split by comma and filter out empty strings
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0) // Remove empty strings from deletions
    }
    return []
  }, [])
  const getChangedFields = useCallback(
    (original: ProfileConsultantResult, updated: ProfileConsultantResult) => {
      const changes: Record<string, string | number | string[] | File | null | undefined> = {}

      // Check basic fields
      const fieldsToCheck: (keyof ProfileConsultantResult)[] = [
        'name',
        'username',
        'email',
        'role',
        'status',
        'phone_number',
        'bio',
        'description',
        'location',
        'date_of_birth',
        'website',
        'rating',
        'total_reviews',
        'experience',
        'response_time',
        'degree',
        'hospital'
      ]

      fieldsToCheck.forEach((field) => {
        if (original[field] !== updated[field]) {
          changes[field] = updated[field]
        }
      })

      // Check array fields (specialties, languages)
      const originalSpecialties = handleSliceToArrayString(original.specialties)
      const updatedSpecialties = handleSliceToArrayString(updated.specialties)
      if (JSON.stringify(originalSpecialties) !== JSON.stringify(updatedSpecialties)) {
        changes.specialties = updatedSpecialties
      }

      const originalLanguages = handleSliceToArrayString(original.languages)
      const updatedLanguages = handleSliceToArrayString(updated.languages)
      if (JSON.stringify(originalLanguages) !== JSON.stringify(updatedLanguages)) {
        changes.languages = updatedLanguages
      }

      // Check file fields
      if (original.avatar !== updated.avatar) {
        changes.avatar = updated.avatar
      }

      if (original.coverPhoto !== updated.coverPhoto) {
        changes.coverPhoto = updated.coverPhoto
      }

      return changes
    },
    [handleSliceToArrayString]
  )
  const createFormDataFromChanges = useCallback(
    (changes: Partial<ProfileConsultantResult>): FormData => {
      const formData = new FormData()

      // Handle basic fields
      Object.entries(changes).forEach(([key, value]) => {
        if (key === 'specialties' || key === 'languages') {
          // Handle array fields separately
          return
        }
        if (key === 'avatar' || key === 'coverPhoto') {
          // Handle file fields separately
          return
        }
        if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })

      // Handle specialties array
      if (changes.specialties) {
        const specialtiesArray = handleSliceToArrayString(changes.specialties)
        specialtiesArray.forEach((specialty, index) => {
          formData.append(`specialties[${index}]`, specialty)
        })
      }

      // Handle languages array
      if (changes.languages) {
        const languagesArray = handleSliceToArrayString(changes.languages)
        languagesArray.forEach((language, index) => {
          formData.append(`languages[${index}]`, language)
        })
      }

      // Handle file fields
      if (changes.avatar) {
        if (changes.avatar instanceof File) {
          formData.append('avatar', changes.avatar)
        } else if (typeof changes.avatar === 'string') {
          formData.append('avatar_url', changes.avatar)
        }
      }

      if (changes.coverPhoto) {
        if (changes.coverPhoto instanceof File) {
          formData.append('coverPhoto', changes.coverPhoto)
        } else if (typeof changes.coverPhoto === 'string') {
          formData.append('coverPhoto_url', changes.coverPhoto)
        }
      }

      console.log('FormData changes:', Array.from(formData.entries()))
      return formData
    },
    [handleSliceToArrayString]
  )
  const handleSave = useCallback(async () => {
    if (!selectedConsultant || !originalConsultant) return

    try {
      // Get only the changed fields
      const changes = getChangedFields(originalConsultant, selectedConsultant)
      // Check if there are any changes
      if (Object.keys(changes).length === 0) {
        toast.info('No changes detected', { position: 'top-right', autoClose: 1000 })
        setIsEditModalOpen(false)
        return
      }

      const formData = createFormDataFromChanges(changes)
      console.log('selectedConsultant: ', selectedConsultant)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await profileApi.updateProfileConsultant(selectedConsultant.id, formData as any)

      // setConsultants((prev) => prev.map((c) => (c.id === selectedConsultant.id ? { ...selectedConsultant } : c)))
      fetchData()

      toast.success(`Consultant ${selectedConsultant.name ?? 'Unknown'} updated`, {
        position: 'top-right',
        autoClose: 1000
      })

      setIsEditModalOpen(false)
      setSelectedConsultant(null)
      setOriginalConsultant(null)
    } catch (error) {
      console.error('Error updating consultant:', error)
      toast.error('Failed to update consultant', {
        position: 'top-right',
        autoClose: 2000
      })
    }
  }, [selectedConsultant, originalConsultant, getChangedFields, createFormDataFromChanges, fetchData])
  const handleCancel = useCallback(() => {
    setIsEditModalOpen(false)
    setSelectedConsultant(null)
    setOriginalConsultant(null)
  }, [])

  return (
    <div className='space-y-6'>
      <div className='bg-white p-6 rounded-lg  border'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <Activity className='h-6 w-6 text-blue-600' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Profile Consultant Management </h1>
              <p className='text-gray-600 mt-1'>Monitor and manage Consultant test progress for all customers</p>
            </div>
          </div>
        </div>
      </div>
      <DataTable columns={getScheduleColumns({ onEdit: handleEdit, onView: handleView })} data={consultants} />
      <EditConsultantModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        selectedConsultant={selectedConsultant}
        setSelectedConsultant={setSelectedConsultant}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      <ViewConsultantModal
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        selectedConsultant={selectedConsultant}
      />
    </div>
  )
}

export default ProfileConsultantManagement
