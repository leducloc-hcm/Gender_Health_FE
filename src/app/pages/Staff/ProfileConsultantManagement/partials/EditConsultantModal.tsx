import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Button } from '@/app/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { format } from 'date-fns'
import { memo, useEffect, useState } from 'react'
import {
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
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Separator } from '@/app/components/ui/separator'
import type { ProfileConsultantResult } from '../ProfileConsultantManagement'

export interface EditConsultantModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedConsultant: ProfileConsultantResult | null
  setSelectedConsultant: React.Dispatch<React.SetStateAction<ProfileConsultantResult | null>>
  onSave: () => Promise<void>
  onCancel: () => void
}

const EditConsultantModal = memo(
  ({ isOpen, onOpenChange, selectedConsultant, setSelectedConsultant, onSave, onCancel }: EditConsultantModalProps) => {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null)

    const handleInputChange = <K extends keyof ProfileConsultantResult>(
      field: K,
      value: ProfileConsultantResult[K]
    ) => {
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
        <DialogContent className='sm:max-w-[900px] max-h-[90vh] overflow-y-auto'>
          <DialogHeader className='pb-6'>
            <DialogTitle className='text-2xl font-bold text-center text-gray-800 flex items-center justify-center gap-2'>
              <User className='h-6 w-6' />
              Edit Consultant Profile
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-6'>
            {/* Personal Information Section */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <User className='h-5 w-5' />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {[
                    { id: 'name', label: 'Full Name', type: 'text', icon: User },
                    { id: 'username', label: 'Username', type: 'text', icon: User },
                    { id: 'email', label: 'Email Address', type: 'email', icon: Mail },
                    { id: 'phone_number', label: 'Phone Number', type: 'text', icon: Phone }
                  ].map(({ id, label, type, icon: Icon }) => (
                    <div key={id} className='space-y-2'>
                      <Label htmlFor={id} className='text-sm font-medium flex items-center gap-2'>
                        <Icon className='h-4 w-4' />
                        {label}
                      </Label>
                      <Input
                        id={id}
                        type={type}
                        value={(() => {
                          const fieldValue = selectedConsultant[id as keyof ProfileConsultantResult]
                          return typeof fieldValue === 'string' || typeof fieldValue === 'number'
                            ? String(fieldValue)
                            : ''
                        })()}
                        onChange={(e) => handleInputChange(id as keyof ProfileConsultantResult, e.target.value)}
                        className='w-full'
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label className='text-sm font-medium flex items-center gap-2'>
                      <Calendar className='h-4 w-4' />
                      Date of Birth
                    </Label>
                    <Input
                      type='date'
                      value={(() => {
                        const fieldValue = selectedConsultant.date_of_birth
                        return fieldValue ? format(new Date(fieldValue), 'yyyy-MM-dd') : ''
                      })()}
                      onChange={(e) =>
                        handleInputChange('date_of_birth', e.target.value ? new Date(e.target.value).toISOString() : '')
                      }
                      className='w-full'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label className='text-sm font-medium flex items-center gap-2'>
                      <MapPin className='h-4 w-4' />
                      Location
                    </Label>
                    <Input
                      value={selectedConsultant.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className='w-full'
                      placeholder='Enter location'
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information Section */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <Award className='h-5 w-5' />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {[
                    { id: 'role', label: 'Role', type: 'text', icon: Award },
                    { id: 'status', label: 'Status', type: 'text', icon: Award },
                    { id: 'degree', label: 'Degree', type: 'text', icon: GraduationCap },
                    { id: 'hospital', label: 'Hospital/Clinic', type: 'text', icon: Building2 }
                  ].map(({ id, label, type, icon: Icon }) => (
                    <div key={id} className='space-y-2'>
                      <Label className='text-sm font-medium flex items-center gap-2'>
                        <Icon className='h-4 w-4' />
                        {label}
                      </Label>
                      <Input
                        type={type}
                        value={(() => {
                          const fieldValue = selectedConsultant[id as keyof ProfileConsultantResult]
                          return typeof fieldValue === 'string' || typeof fieldValue === 'number'
                            ? String(fieldValue)
                            : ''
                        })()}
                        onChange={(e) => handleInputChange(id as keyof ProfileConsultantResult, e.target.value)}
                        className='w-full'
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='space-y-2'>
                    <Label className='text-sm font-medium flex items-center gap-2'>
                      <Star className='h-4 w-4' />
                      Rating (0-5)
                    </Label>
                    <Input
                      type='number'
                      step='0.1'
                      min='0'
                      max='5'
                      value={selectedConsultant.rating || ''}
                      onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 0)}
                      className='w-full'
                      placeholder='0.0'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label className='text-sm font-medium flex items-center gap-2'>
                      <FileText className='h-4 w-4' />
                      Total Reviews
                    </Label>
                    <Input
                      type='number'
                      min='0'
                      value={selectedConsultant.total_reviews || ''}
                      onChange={(e) => handleInputChange('total_reviews', parseInt(e.target.value, 10) || 0)}
                      className='w-full'
                      placeholder='0'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label className='text-sm font-medium flex items-center gap-2'>
                      <Clock className='h-4 w-4' />
                      Experience (Years)
                    </Label>
                    <Input
                      value={selectedConsultant.experience || ''}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      className='w-full'
                      placeholder='Years of experience'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label className='text-sm font-medium flex items-center gap-2'>
                      <Clock className='h-4 w-4' />
                      Response Time (Minutes)
                    </Label>
                    <Input
                      value={selectedConsultant.response_time || ''}
                      onChange={(e) => handleInputChange('response_time', e.target.value)}
                      className='w-full'
                      placeholder='Average response time'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label className='text-sm font-medium flex items-center gap-2'>
                      <Globe className='h-4 w-4' />
                      Website
                    </Label>
                    <Input
                      type='url'
                      value={selectedConsultant.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className='w-full'
                      placeholder='https://example.com'
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description & Bio Section */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <FileText className='h-5 w-5' />
                  Description & Bio
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label className='text-sm font-medium'>Bio</Label>
                  <Input
                    value={selectedConsultant.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className='w-full'
                    placeholder='Short bio'
                  />
                </div>

                <div className='space-y-2'>
                  <Label className='text-sm font-medium'>Description</Label>
                  <Input
                    value={selectedConsultant.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className='w-full'
                    placeholder='Detailed description'
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills & Languages Section */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <Tag className='h-5 w-5' />
                  Skills & Languages
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label className='text-sm font-medium flex items-center gap-2'>
                      <Tag className='h-4 w-4' />
                      Specialties
                    </Label>
                    <Input
                      value={(() => {
                        const specialties = selectedConsultant.specialties
                        return Array.isArray(specialties) ? specialties.join(', ') : ''
                      })()}
                      onChange={(e) =>
                        handleInputChange(
                          'specialties',
                          e.target.value.split(',').map((s) => s.trim())
                        )
                      }
                      className='w-full'
                      placeholder='Enter specialties separated by commas'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label className='text-sm font-medium flex items-center gap-2'>
                      <Languages className='h-4 w-4' />
                      Languages
                    </Label>
                    <Input
                      value={(() => {
                        const languages = selectedConsultant.languages
                        return Array.isArray(languages) ? languages.join(', ') : ''
                      })()}
                      onChange={(e) =>
                        handleInputChange(
                          'languages',
                          e.target.value.split(',').map((s) => s.trim())
                        )
                      }
                      className='w-full'
                      placeholder='Enter languages separated by commas'
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images Section */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <Camera className='h-5 w-5' />
                  Profile Images
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                {[
                  { field: 'avatar', label: 'Profile Avatar', preview: avatarPreview },
                  { field: 'coverPhoto', label: 'Cover Photo', preview: coverPhotoPreview }
                ].map(({ field, label, preview }) => (
                  <div key={field} className='space-y-3'>
                    <Label className='text-sm font-medium flex items-center gap-2'>
                      <Camera className='h-4 w-4' />
                      {label}
                    </Label>
                    <div className='flex items-center gap-4'>
                      <div className='flex-shrink-0'>
                        {preview ? (
                          <Avatar className='w-20 h-20 rounded-lg'>
                            <AvatarImage src={preview} className='object-cover' />
                            <AvatarFallback className='text-lg'>{selectedConsultant.name?.[0] ?? 'N/A'}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className='w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center'>
                            <Camera className='h-8 w-8 text-gray-400' />
                          </div>
                        )}
                      </div>

                      <div className='flex-1'>
                        <Input
                          type='file'
                          accept='image/*'
                          onChange={(e) =>
                            handleInputChange(field as keyof ProfileConsultantResult, e.target.files?.[0] ?? null)
                          }
                          className='file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                        />
                        <p className='text-xs text-gray-500 mt-1'>
                          Upload a new {label.toLowerCase()} (PNG, JPG, GIF up to 10MB)
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Separator className='my-6' />

          <DialogFooter className='gap-3'>
            <Button variant='outline' onClick={onCancel} className='px-6'>
              Cancel
            </Button>
            <Button onClick={onSave} className='px-6 bg-blue-600 hover:bg-blue-700'>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
)

EditConsultantModal.displayName = 'EditConsultantModal'

export default EditConsultantModal
