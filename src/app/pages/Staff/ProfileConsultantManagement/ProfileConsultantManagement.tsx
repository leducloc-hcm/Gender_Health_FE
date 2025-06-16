import { profileApi } from '@/app/apis/profile.api'
import { staffApi } from '@/app/apis/staff.api'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Button } from '@/app/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { sStaffProfile } from '@/app/hooks/sStaffProfile'
import { format } from 'date-fns'
import { memo, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import type { ProfileConsultantManagementResponse, ProfileConsultantResult } from './models/ProfleConsultantManagement'
import { getScheduleColumns } from './partials/columns'
import DataTable from './partials/DataTable'

// Move EditConsultantModal outside to prevent re-creation
const EditConsultantModal = memo(
  ({
    isOpen,
    onOpenChange,
    selectedConsultant,
    setSelectedConsultant,
    onSave,
    onCancel
  }: {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    selectedConsultant: ProfileConsultantResult | null
    setSelectedConsultant: React.Dispatch<React.SetStateAction<ProfileConsultantResult | null>>
    onSave: () => void
    onCancel: () => void
  }) => {
    if (!selectedConsultant) return null

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'coverPhoto') => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          setSelectedConsultant({
            ...selectedConsultant,
            [field]: reader.result as string
          })
        }
        reader.readAsDataURL(file)
      }
    }

    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          className='sm:max-w-[600px] max-h-[80vh] overflow-y-auto'
          description="Edit the consultant's profile details below"
        >
          <DialogHeader>
            <DialogTitle>Edit Consultant Profile</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Name
              </Label>
              <Input
                id='name'
                value={selectedConsultant.name || ''}
                onChange={(e) =>
                  setSelectedConsultant((prev) => ({
                    ...prev!,
                    name: e.target.value
                  }))
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='username' className='text-right'>
                Username
              </Label>
              <Input
                id='username'
                value={selectedConsultant.username || ''}
                onChange={(e) =>
                  setSelectedConsultant((prev) => ({
                    ...prev!,
                    username: e.target.value
                  }))
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='email' className='text-right'>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                value={selectedConsultant.email || ''}
                onChange={(e) =>
                  setSelectedConsultant((prev) => ({
                    ...prev!,
                    email: e.target.value
                  }))
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='role' className='text-right'>
                Role
              </Label>
              <Input
                id='role'
                value={selectedConsultant.role || ''}
                onChange={(e) =>
                  setSelectedConsultant((prev) => ({
                    ...prev!,
                    role: e.target.value
                  }))
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='status' className='text-right'>
                Status
              </Label>
              <Input
                id='status'
                value={selectedConsultant.status || ''}
                onChange={(e) =>
                  setSelectedConsultant((prev) => ({
                    ...prev!,
                    status: e.target.value
                  }))
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right'>Avatar</Label>
              <div className='col-span-3 flex items-center gap-4'>
                {selectedConsultant.avatar ? (
                  <Avatar className='w-16 h-16'>
                    <AvatarImage src={selectedConsultant.avatar} />
                    <AvatarFallback>{selectedConsultant.name || 'N/A'}</AvatarFallback>
                  </Avatar>
                ) : (
                  <span>No avatar</span>
                )}
                <Input
                  id='avatar'
                  type='file'
                  accept='image/*'
                  onChange={(e) => handleImageChange(e, 'avatar')}
                  className='w-auto'
                />
              </div>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right'>Cover Photo</Label>
              <div className='col-span-3 flex items-center gap-4'>
                {selectedConsultant.coverPhoto ? (
                  <Avatar className='w-16 h-16'>
                    <AvatarImage src={selectedConsultant.coverPhoto} />
                    <AvatarFallback>{selectedConsultant.name || 'N/A'}</AvatarFallback>
                  </Avatar>
                ) : (
                  <span>No cover photo</span>
                )}
                <Input
                  id='coverPhoto'
                  type='file'
                  accept='image/*'
                  onChange={(e) => handleImageChange(e, 'coverPhoto')}
                  className='w-auto'
                />
              </div>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='phone_number' className='text-right'>
                Phone Number
              </Label>
              <Input
                id='phone_number'
                value={selectedConsultant.phone_number || ''}
                onChange={(e) =>
                  setSelectedConsultant((prev) => ({
                    ...prev!,
                    phone_number: e.target.value
                  }))
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='bio' className='text-right'>
                Bio
              </Label>
              <Input
                id='bio'
                value={selectedConsultant.bio || ''}
                onChange={(e) =>
                  setSelectedConsultant((prev) => ({
                    ...prev!,
                    bio: e.target.value
                  }))
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='description' className='text-right'>
                Description
              </Label>
              <Input
                id='description'
                value={selectedConsultant.description || ''}
                onChange={(e) =>
                  setSelectedConsultant((prev) => ({
                    ...prev!,
                    description: e.target.value
                  }))
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='location' className='text-right'>
                Location
              </Label>
              <Input
                id='location'
                value={selectedConsultant.location || ''}
                onChange={(e) =>
                  setSelectedConsultant((prev) => ({
                    ...prev!,
                    location: e.target.value
                  }))
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='date_of_birth' className='text-right'>
                Date of Birth
              </Label>
              <Input
                id='date_of_birth'
                type='date'
                value={
                  selectedConsultant.date_of_birth
                    ? format(new Date(selectedConsultant.date_of_birth), 'yyyy-MM-dd')
                    : ''
                }
                onChange={(e) =>
                  setSelectedConsultant((prev) => ({
                    ...prev!,
                    date_of_birth: e.target.value ? new Date(e.target.value).toISOString() : ''
                  }))
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='website' className='text-right'>
                Website
              </Label>
              <Input
                id='website'
                type='url'
                value={selectedConsultant.website || ''}
                onChange={(e) =>
                  setSelectedConsultant((prev) => ({
                    ...prev!,
                    website: e.target.value
                  }))
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='specialties' className='text-right'>
                Specialties
              </Label>
              <Input
                id='specialties'
                value={selectedConsultant.specialties?.join(', ') || ''}
                onChange={(e) =>
                  setSelectedConsultant((prev) => ({
                    ...prev!,
                    specialties: e.target.value.split(',').map((s) => s.trim())
                  }))
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='languages' className='text-right'>
                Languages
              </Label>
              <Input
                id='languages'
                value={selectedConsultant.languages?.join(', ') || ''}
                onChange={(e) =>
                  setSelectedConsultant((prev) => ({
                    ...prev!,
                    languages: e.target.value.split(',').map((s) => s.trim())
                  }))
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='rating' className='text-right'>
                Rating
              </Label>
              <Input
                id='rating'
                type='number'
                step='0.1'
                min='0'
                max='5'
                value={selectedConsultant.rating || ''}
                onChange={(e) =>
                  setSelectedConsultant((prev) => ({
                    ...prev!,
                    rating: parseFloat(e.target.value) || 0
                  }))
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='total_reviews' className='text-right'>
                Total Reviews
              </Label>
              <Input
                id='total_reviews'
                type='number'
                min='0'
                value={selectedConsultant.total_reviews || ''}
                onChange={(e) =>
                  setSelectedConsultant((prev) => ({
                    ...prev!,
                    total_reviews: parseInt(e.target.value) || 0
                  }))
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='experience' className='text-right'>
                Experience (Years)
              </Label>
              <Input
                id='experience'
                type='string'
                min='0'
                value={selectedConsultant.experience || ''}
                onChange={(e) =>
                  setSelectedConsultant((prev) => ({
                    ...prev!,
                    experience: e.target.value || ''
                  }))
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='response_time' className='text-right'>
                Response Time (Mins)
              </Label>
              <Input
                id='response_time'
                type='string'
                min='0'
                value={selectedConsultant.response_time || ''}
                onChange={(e) =>
                  setSelectedConsultant((prev) => ({
                    ...prev!,
                    response_time: e.target.value || ''
                  }))
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='degree' className='text-right'>
                Degree
              </Label>
              <Input
                id='degree'
                value={selectedConsultant.degree || ''}
                onChange={(e) =>
                  setSelectedConsultant((prev) => ({
                    ...prev!,
                    degree: e.target.value
                  }))
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='hospital' className='text-right'>
                Hospital
              </Label>
              <Input
                id='hospital'
                value={selectedConsultant.hospital || ''}
                onChange={(e) =>
                  setSelectedConsultant((prev) => ({
                    ...prev!,
                    hospital: e.target.value
                  }))
                }
                className='col-span-3'
              />
            </div>
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

// Move ViewConsultantModal outside to prevent re-creation
const ViewConsultantModal = memo(
  ({
    isOpen,
    onOpenChange,
    selectedConsultant
  }: {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    selectedConsultant: ProfileConsultantResult | null
  }) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className='sm:max-w-[600px] max-h-[80vh] overflow-y-auto'
        description="View the consultant's profile details below"
      >
        <DialogHeader>
          <DialogTitle>Consultant Profile Details</DialogTitle>
        </DialogHeader>
        {selectedConsultant && (
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>Name</Label>
              <span className='col-span-3'>{selectedConsultant.name || 'No name'}</span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>Username</Label>
              <span className='col-span-3'>{selectedConsultant.username || 'No username'}</span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>Email</Label>
              <span className='col-span-3'>{selectedConsultant.email || 'No email'}</span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>Role</Label>
              <span className='col-span-3'>{selectedConsultant.role || 'N/A'}</span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>Status</Label>
              <span className='col-span-3'>{selectedConsultant.status || 'Unknown'}</span>
            </div>
            <div className='flex justify-center'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label className='text-right font-bold'>Avatar</Label>
                <div className='col-span-3'>
                  {selectedConsultant.avatar ? (
                    <Avatar className='w-16 h-16'>
                      <AvatarImage src={selectedConsultant.avatar} />
                      <AvatarFallback>{selectedConsultant.name || 'N/A'}</AvatarFallback>
                    </Avatar>
                  ) : (
                    'No avatar'
                  )}
                </div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label className='text-right font-bold'>Cover Photo</Label>
                <div className='col-span-3'>
                  {selectedConsultant.coverPhoto ? (
                    <Avatar className='w-16 h-16'>
                      <AvatarImage src={selectedConsultant.coverPhoto} />
                      <AvatarFallback>{selectedConsultant.name || 'N/A'}</AvatarFallback>
                    </Avatar>
                  ) : (
                    'No cover photo'
                  )}
                </div>
              </div>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>Phone Number</Label>
              <span className='col-span-3'>{selectedConsultant.phone_number || 'No phone'}</span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>Bio</Label>
              <span className='col-span-3'>{selectedConsultant.bio || 'No bio'}</span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>Description</Label>
              <span className='col-span-3'>{selectedConsultant.description || 'No description'}</span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>Location</Label>
              <span className='col-span-3'>{selectedConsultant.location || 'No location'}</span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>Date of Birth</Label>
              <span className='col-span-3'>
                {selectedConsultant.date_of_birth
                  ? format(new Date(selectedConsultant.date_of_birth), 'dd MMM yyyy')
                  : 'No date of birth'}
              </span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>Website</Label>
              <span className='col-span-3'>
                {selectedConsultant.website ? (
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
                )}
              </span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>Specialties</Label>
              <span className='col-span-3'>
                {selectedConsultant.specialties?.length > 0
                  ? selectedConsultant.specialties.join(', ')
                  : 'No specialties'}
              </span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>Languages</Label>
              <span className='col-span-3'>
                {selectedConsultant.languages?.length > 0 ? selectedConsultant.languages.join(', ') : 'No languages'}
              </span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>Rating</Label>
              <span className='col-span-3'>
                {selectedConsultant.rating ? selectedConsultant.rating.toFixed(1) : 'No rating'}
              </span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>Total Reviews</Label>
              <span className='col-span-3'>{selectedConsultant.total_reviews || 'No reviews'}</span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>Experience</Label>
              <span className='col-span-3'>
                {selectedConsultant.experience ? `${selectedConsultant.experience} years` : 'No experience'}
              </span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>Response Time</Label>
              <span className='col-span-3'>
                {selectedConsultant.response_time ? `${selectedConsultant.response_time} mins` : 'No response time'}
              </span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>Degree</Label>
              <span className='col-span-3'>{selectedConsultant.degree || 'No degree'}</span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>Hospital</Label>
              <span className='col-span-3'>{selectedConsultant.hospital || 'No hospital'}</span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>Created At</Label>
              <span className='col-span-3'>
                {selectedConsultant.created_at
                  ? format(new Date(selectedConsultant.created_at), 'dd MMM yyyy HH:mm')
                  : 'Invalid Date'}
              </span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right font-bold'>Updated At</Label>
              <span className='col-span-3'>
                {selectedConsultant.updated_at
                  ? format(new Date(selectedConsultant.updated_at), 'dd MMM yyyy HH:mm')
                  : 'Invalid Date'}
              </span>
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
  )
)

const ProfileConsultantManagement = () => {
  const [consultants, setConsultants] = useState<ProfileConsultantResult[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedConsultant, setSelectedConsultant] = useState<ProfileConsultantResult | null>(null)
  const staffId = sStaffProfile.use()

  console.log('staffId: ', staffId?.id)

  const fetchData = async () => {
    try {
      const response = await staffApi.getAllProfileConsultants()
      const typedResponse = response as ProfileConsultantManagementResponse
      setConsultants(typedResponse.result)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleEdit = (consultant: ProfileConsultantResult) => {
    setSelectedConsultant(consultant)
    setIsEditModalOpen(true)
    toast.info(`Edit schedule with ID: ${consultant.id}`, {
      position: 'top-right',
      autoClose: 1000
    })
  }

  const handleView = (consultant: ProfileConsultantResult) => {
    setSelectedConsultant(consultant)
    setIsViewModalOpen(true)
    toast.info(`Viewing details for consultant ID: ${consultant.id}`, {
      position: 'top-right',
      autoClose: 1000
    })
  }

  const createFormData = async (consultant: ProfileConsultantResult): Promise<FormData> => {
    const formData = new FormData()
    const fields: [string, string][] = [
      ['id', consultant.id.toString()],
      ['name', consultant.name || ''],
      ['username', consultant.username || ''],
      ['email', consultant.email || ''],
      ['role', consultant.role || ''],
      ['status', consultant.status || ''],
      ['phone_number', consultant.phone_number || ''],
      ['bio', consultant.bio || ''],
      ['description', consultant.description || ''],
      ['location', consultant.location || ''],
      ['date_of_birth', consultant.date_of_birth || ''],
      ['website', consultant.website || ''],
      ['specialties', consultant.specialties?.join(',') || ''],
      ['languages', consultant.languages?.join(',') || ''],
      ['rating', consultant.rating?.toString() || '0'],
      ['total_reviews', consultant.total_reviews?.toString() || '0'],
      ['experience', consultant.experience || ''],
      ['response_time', consultant.response_time || ''],
      ['degree', consultant.degree || ''],
      ['hospital', consultant.hospital || '']
    ]

    fields.forEach(([key, value]) => formData.append(key, value))

    // Handle avatar image
    if (consultant.avatar && consultant.avatar.startsWith('data:image')) {
      const response = await fetch(consultant.avatar)
      const blob = await response.blob()
      formData.append('avatar', blob, 'avatar.png')
    } else if (consultant.avatar) {
      formData.append('avatar_url', consultant.avatar)
    }

    // Handle cover photo image
    if (consultant.coverPhoto && consultant.coverPhoto.startsWith('data:image')) {
      const response = await fetch(consultant.coverPhoto)
      const blob = await response.blob()
      formData.append('coverPhoto', blob, 'coverPhoto.png')
    } else if (consultant.coverPhoto) {
      formData.append('coverPhoto_url', consultant.coverPhoto)
    }

    return formData
  }

  const handleSave = async () => {
    if (!selectedConsultant) return

    try {
      const formData = await createFormData(selectedConsultant)
      await profileApi.updateProfileConsultant(selectedConsultant.id, formData)

      toast.success(`Consultant ${selectedConsultant.name} updated successfully`, {
        position: 'top-right',
        autoClose: 1000
      })

      setConsultants((prev) => prev.map((c) => (c.id === selectedConsultant.id ? selectedConsultant : c)))
    } catch (error) {
      console.error('Error updating consultant:', error)
      toast.error('Failed to update consultant profile', {
        position: 'top-right',
        autoClose: 2000
      })
    }

    setIsEditModalOpen(false)
    setSelectedConsultant(null)
  }

  const handleCancel = () => {
    setIsEditModalOpen(false)
    setSelectedConsultant(null)
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Schedule Approve Management</h1>
      <div className='table-container'>
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
    </div>
  )
}

export default ProfileConsultantManagement
