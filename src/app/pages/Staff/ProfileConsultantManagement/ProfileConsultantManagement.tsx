import { profileApi } from '@/app/apis/profile.api'
import { staffApi } from '@/app/apis/staff.api'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Button } from '@/app/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { format } from 'date-fns'
import { memo, useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getScheduleColumns } from './partials/columns'
import DataTable from './partials/DataTable'
import EditConsultantModal from './partials/EditConsultantModal'

import type { ProfileConsultantResult as OriginalProfileConsultantResult } from '@/app/pages/Staff/ProfileConsultantManagement/models/ProfleConsultantManagement'
import {
  Activity,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Award,
  Globe,
  Clock,
  Building2,
  GraduationCap,
  FileText,
  Tag,
  Languages,
  Camera
} from 'lucide-react'
import { Badge } from '@/app/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Separator } from '@/app/components/ui/separator'

export interface ProfileConsultantResult extends Omit<OriginalProfileConsultantResult, 'avatar' | 'coverPhoto'> {
  avatar: string | File | null
  coverPhoto: string | File | null
}

export interface ViewConsultantModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedConsultant: ProfileConsultantResult | null
}

const ViewConsultantModal = memo(({ isOpen, onOpenChange, selectedConsultant }: ViewConsultantModalProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className='sm:max-w-[900px] max-h-[90vh] overflow-y-auto'>
      <DialogHeader className='pb-6'>
        <DialogTitle className='text-2xl font-bold text-center text-gray-800 flex items-center justify-center gap-2'>
          <User className='h-6 w-6' />
          Consultant Profile Details
        </DialogTitle>
      </DialogHeader>

      {selectedConsultant && (
        <div className='space-y-6'>
          {/* Profile Header with Avatar and Status */}
          <Card>
            <CardContent className='pt-6'>
              <div className='flex flex-col md:flex-row items-center gap-6'>
                <div className='flex-shrink-0'>
                  {typeof selectedConsultant.avatar === 'string' && selectedConsultant.avatar ? (
                    <Avatar className='w-32 h-32 rounded-xl border-4 border-white shadow-lg'>
                      <AvatarImage src={selectedConsultant.avatar} className='object-cover' />
                      <AvatarFallback className='text-3xl bg-gradient-to-br from-blue-400 to-purple-500 text-white'>
                        {selectedConsultant.name?.[0] ?? 'N/A'}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className='w-32 h-32 rounded-xl border-4 border-gray-200 flex items-center justify-center bg-gray-50'>
                      <User className='h-16 w-16 text-gray-400' />
                    </div>
                  )}
                </div>

                <div className='flex-1 text-center md:text-left space-y-2'>
                  <h2 className='text-3xl font-bold text-gray-900'>{selectedConsultant.name ?? 'No name'}</h2>
                  <p className='text-lg text-gray-600'>@{selectedConsultant.username ?? 'No username'}</p>
                  <div className='flex items-center justify-center md:justify-start gap-4 mt-4'>
                    <Badge
                      className={`px-3 py-1 text-sm font-medium ${
                        selectedConsultant.status === 'VERIFIED'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : selectedConsultant.status === 'REJECT'
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : selectedConsultant.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              : 'bg-gray-100 text-gray-800 border-gray-200'
                      }`}
                    >
                      {selectedConsultant.status ?? 'Unknown'}
                    </Badge>

                    {selectedConsultant.rating != null && (
                      <div className='flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200'>
                        <Star className='h-4 w-4 text-yellow-500 fill-current' />
                        <span className='text-sm font-medium text-yellow-800'>
                          {selectedConsultant.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedConsultant.bio && <p className='text-gray-600 mt-3 italic'>"{selectedConsultant.bio}"</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Mail className='h-5 w-5' />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='flex items-center gap-3'>
                  <Mail className='h-5 w-5 text-blue-500' />
                  <div>
                    <p className='text-sm text-gray-600'>Email</p>
                    <p className='font-medium'>{selectedConsultant.email ?? 'No email'}</p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Phone className='h-5 w-5 text-green-500' />
                  <div>
                    <p className='text-sm text-gray-600'>Phone</p>
                    <p className='font-medium'>{selectedConsultant.phone_number ?? 'No phone'}</p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <MapPin className='h-5 w-5 text-red-500' />
                  <div>
                    <p className='text-sm text-gray-600'>Location</p>
                    <p className='font-medium'>{selectedConsultant.location ?? 'No location'}</p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Globe className='h-5 w-5 text-purple-500' />
                  <div>
                    <p className='text-sm text-gray-600'>Website</p>
                    {selectedConsultant.website ? (
                      <a
                        href={selectedConsultant.website}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='font-medium text-blue-600 hover:text-blue-800 hover:underline'
                      >
                        {selectedConsultant.website}
                      </a>
                    ) : (
                      <p className='font-medium text-gray-400'>No website</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Award className='h-5 w-5' />
                Professional Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <div className='flex items-center gap-3'>
                  <Award className='h-5 w-5 text-blue-500' />
                  <div>
                    <p className='text-sm text-gray-600'>Role</p>
                    <p className='font-medium'>{selectedConsultant.role ?? 'N/A'}</p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <GraduationCap className='h-5 w-5 text-green-500' />
                  <div>
                    <p className='text-sm text-gray-600'>Degree</p>
                    <p className='font-medium'>{selectedConsultant.degree ?? 'No degree'}</p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Building2 className='h-5 w-5 text-purple-500' />
                  <div>
                    <p className='text-sm text-gray-600'>Hospital/Clinic</p>
                    <p className='font-medium'>{selectedConsultant.hospital ?? 'No hospital'}</p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Clock className='h-5 w-5 text-orange-500' />
                  <div>
                    <p className='text-sm text-gray-600'>Experience</p>
                    <p className='font-medium'>
                      {selectedConsultant.experience ? `${selectedConsultant.experience} years` : 'No experience'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Clock className='h-5 w-5 text-teal-500' />
                  <div>
                    <p className='text-sm text-gray-600'>Response Time</p>
                    <p className='font-medium'>
                      {selectedConsultant.response_time
                        ? `${selectedConsultant.response_time} mins`
                        : 'No response time'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <FileText className='h-5 w-5 text-indigo-500' />
                  <div>
                    <p className='text-sm text-gray-600'>Total Reviews</p>
                    <p className='font-medium'>{selectedConsultant.total_reviews ?? 'No reviews'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Languages */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Tag className='h-5 w-5' />
                Skills & Languages
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <div className='flex items-center gap-2 mb-3'>
                  <Tag className='h-4 w-4 text-blue-500' />
                  <span className='text-sm font-medium text-gray-600'>Specialties</span>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {selectedConsultant.specialties?.length ? (
                    selectedConsultant.specialties.map((specialty, index) => (
                      <Badge key={index} variant='secondary' className='bg-blue-50 text-blue-700 border-blue-200'>
                        {specialty}
                      </Badge>
                    ))
                  ) : (
                    <span className='text-gray-400 italic'>No specialties</span>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <div className='flex items-center gap-2 mb-3'>
                  <Languages className='h-4 w-4 text-green-500' />
                  <span className='text-sm font-medium text-gray-600'>Languages</span>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {selectedConsultant.languages?.length ? (
                    selectedConsultant.languages.map((language, index) => (
                      <Badge key={index} variant='secondary' className='bg-green-50 text-green-700 border-green-200'>
                        {language}
                      </Badge>
                    ))
                  ) : (
                    <span className='text-gray-400 italic'>No languages</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {selectedConsultant.description && (
            <Card>
              <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <FileText className='h-5 w-5' />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-700 leading-relaxed'>{selectedConsultant.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Cover Photo */}
          {typeof selectedConsultant.coverPhoto === 'string' && selectedConsultant.coverPhoto && (
            <Card>
              <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <Camera className='h-5 w-5' />
                  Cover Photo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='w-full h-48 rounded-lg overflow-hidden border border-gray-200'>
                  <img src={selectedConsultant.coverPhoto} alt='Cover' className='w-full h-full object-cover' />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Calendar className='h-5 w-5' />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='flex items-center gap-3'>
                  <Calendar className='h-5 w-5 text-blue-500' />
                  <div>
                    <p className='text-sm text-gray-600'>Date of Birth</p>
                    <p className='font-medium'>
                      {selectedConsultant.date_of_birth
                        ? format(new Date(selectedConsultant.date_of_birth), 'dd MMM yyyy')
                        : 'No date of birth'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Clock className='h-5 w-5 text-gray-500' />
                  <div>
                    <p className='text-sm text-gray-600'>Member Since</p>
                    <p className='font-medium'>
                      {selectedConsultant.created_at
                        ? format(new Date(selectedConsultant.created_at), 'dd MMM yyyy')
                        : 'Invalid Date'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Separator className='my-6' />

      <DialogFooter>
        <Button variant='outline' onClick={() => onOpenChange(false)} className='px-6'>
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
