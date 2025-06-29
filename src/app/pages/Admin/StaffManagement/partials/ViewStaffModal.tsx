import { Badge } from '@/app/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Calendar, Globe, MapPin, Phone, User } from 'lucide-react'
import { memo } from 'react'
import type { StaffData } from '../StaffManagement'

interface ViewStaffModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedStaff: StaffData | null
}

const ViewStaffModal = memo(({ isOpen, onOpenChange, selectedStaff }: ViewStaffModalProps) => {
  if (!selectedStaff) return null

  const getImageUrl = (image: string | File | null) => {
    if (!image) return null
    if (typeof image === 'string') return image
    return URL.createObjectURL(image)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[800px] max-h-[95vh]'>
        <DialogHeader>
          <DialogTitle>Staff Details</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Cover Photo */}
          {selectedStaff.coverPhoto && (
            <div className='w-full h-32 rounded-lg overflow-hidden'>
              <img
                src={getImageUrl(selectedStaff.coverPhoto) || ''}
                alt='Cover'
                className='w-full h-full object-cover'
              />
            </div>
          )}

          {/* Profile Section */}
          <div className='flex items-start gap-4'>
            <div className='flex-shrink-0'>
              {selectedStaff.avatar ? (
                <img
                  src={getImageUrl(selectedStaff.avatar) || ''}
                  alt='Avatar'
                  className='w-20 h-20 rounded-full object-cover border-2 border-gray-200'
                />
              ) : (
                <div className='w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center'>
                  <User className='w-8 h-8 text-gray-500' />
                </div>
              )}
            </div>

            <div className='flex-1'>
              <h3 className='text-xl font-semibold'>{selectedStaff.name}</h3>
              <p className='text-gray-600'>@{selectedStaff.username}</p>
              <div className='flex items-center gap-2 mt-2'>
                <Badge variant='secondary'>{selectedStaff.role}</Badge>
                <Badge variant={selectedStaff.status === 'active' ? 'default' : 'destructive'}>
                  {selectedStaff.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <h4 className='font-medium text-gray-900'>Contact Information</h4>
              <div className='space-y-1 text-sm'>
                <p className='text-gray-600'>Email: {selectedStaff.email}</p>
                {selectedStaff.phone_number && (
                  <div className='flex items-center gap-2'>
                    <Phone className='w-4 h-4 text-gray-500' />
                    <span>{selectedStaff.phone_number}</span>
                  </div>
                )}
                {selectedStaff.location && (
                  <div className='flex items-center gap-2'>
                    <MapPin className='w-4 h-4 text-gray-500' />
                    <span>{selectedStaff.location}</span>
                  </div>
                )}
                {selectedStaff.website && (
                  <div className='flex items-center gap-2'>
                    <Globe className='w-4 h-4 text-gray-500' />
                    <a
                      href={selectedStaff.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline'
                    >
                      {selectedStaff.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <h4 className='font-medium text-gray-900'>Personal Information</h4>
              <div className='space-y-1 text-sm'>
                {selectedStaff.date_of_birth && (
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4 text-gray-500' />
                    <span>{new Date(selectedStaff.date_of_birth).toLocaleDateString()}</span>
                  </div>
                )}
                <p className='text-gray-600'>ID: {selectedStaff.id}</p>
                <p className='text-gray-600'>Profile ID: {selectedStaff.staff_profile_id}</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {selectedStaff.bio && (
            <div className='space-y-2'>
              <h4 className='font-medium text-gray-900'>Bio</h4>
              <p className='text-sm text-gray-600'>{selectedStaff.bio}</p>
            </div>
          )}

          {/* Description */}
          {selectedStaff.description && (
            <div className='space-y-2'>
              <h4 className='font-medium text-gray-900'>Description</h4>
              <p className='text-sm text-gray-600'>{selectedStaff.description}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className='pt-4 border-t border-gray-200'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500'>
              <div>
                <span className='font-medium'>Created:</span> {new Date(selectedStaff.created_at).toLocaleString()}
              </div>
              <div>
                <span className='font-medium'>Updated:</span> {new Date(selectedStaff.updated_at).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
})

ViewStaffModal.displayName = 'ViewStaffModal'

export default ViewStaffModal
