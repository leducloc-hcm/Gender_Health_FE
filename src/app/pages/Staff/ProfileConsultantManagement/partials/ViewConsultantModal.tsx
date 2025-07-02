import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Label } from '@/app/components/ui/label'
import { format } from 'date-fns'
import { memo } from 'react'
import type { ProfileConsultantResult } from '../ProfileConsultantManagement'

export interface ViewConsultantModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedConsultant: ProfileConsultantResult | null
}

const ViewConsultantModal = memo(({ isOpen, onOpenChange, selectedConsultant }: ViewConsultantModalProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className='sm:max-w-[700px] max-h-[95vh]'>
      <DialogHeader className='pb-4'>
        <DialogTitle>Consultant Profile Details</DialogTitle>
      </DialogHeader>

      {selectedConsultant && (
        <div className='overflow-y-auto max-h-[calc(90vh-120px)] pr-2'>
          <div className='space-y-6'>
            <div className='space-y-4'>
              <h3 className='text-lg font-medium border-b pb-2'>Basic Information</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {[
                  { label: 'Name', value: selectedConsultant.name ?? 'No name' },
                  { label: 'Username', value: selectedConsultant.username ?? 'No username' },
                  { label: 'Email', value: selectedConsultant.email ?? 'No email' },
                  { label: 'Role', value: selectedConsultant.role ?? 'N/A' },
                  { label: 'Status', value: selectedConsultant.status ?? 'Unknown' },
                  { label: 'Phone Number', value: selectedConsultant.phone_number ?? 'No phone' }
                ].map(({ label, value }) => (
                  <div key={label} className='space-y-1'>
                    <Label className='text-sm font-medium text-gray-600'>{label}</Label>
                    <p className='text-sm'>{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className='space-y-4'>
              <h3 className='text-lg font-medium border-b pb-2'>Personal Information</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {[
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
                        className='text-blue-500 hover:underline text-sm'
                      >
                        {selectedConsultant.website}
                      </a>
                    ) : (
                      'No website'
                    )
                  }
                ].map(({ label, value }) => (
                  <div key={label} className='space-y-1'>
                    <Label className='text-sm font-medium text-gray-600'>{label}</Label>
                    <div className='text-sm'>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-medium border-b pb-2'>Professional Information</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {[
                  { label: 'Degree', value: selectedConsultant.degree ?? 'No degree' },
                  { label: 'Hospital', value: selectedConsultant.hospital ?? 'No hospital' },
                  {
                    label: 'Experience',
                    value: selectedConsultant.experience ? `${selectedConsultant.experience} years` : 'No experience'
                  },
                  {
                    label: 'Response Time',
                    value: selectedConsultant.response_time
                      ? `${selectedConsultant.response_time} mins`
                      : 'No response time'
                  },
                  {
                    label: 'Rating',
                    value: selectedConsultant.rating != null ? selectedConsultant.rating.toFixed(1) : 'No rating'
                  },
                  { label: 'Total Reviews', value: selectedConsultant.total_reviews ?? 'No reviews' }
                ].map(({ label, value }) => (
                  <div key={label} className='space-y-1'>
                    <Label className='text-sm font-medium text-gray-600'>{label}</Label>
                    <p className='text-sm'>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-medium border-b pb-2'>Skills & Languages</h3>

              <div className='space-y-1'>
                <Label className='text-sm font-medium text-gray-600'>Specialties</Label>
                <div className='flex flex-wrap gap-2'>
                  {Array.isArray(selectedConsultant.specialties) && selectedConsultant.specialties.length > 0 ? (
                    selectedConsultant.specialties.map((specialty, index) => (
                      <Badge key={index} className='bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs font-medium'>
                        {String(specialty)}
                      </Badge>
                    ))
                  ) : (
                    <span className='text-sm text-gray-500'>No specialties</span>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div className='space-y-1'>
                <Label className='text-sm font-medium text-gray-600'>Languages</Label>
                <p className='text-sm'>
                  {selectedConsultant.languages?.length ? selectedConsultant.languages.join(', ') : 'No languages'}
                </p>
              </div>
            </div>

            {/* Images */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium border-b pb-2'>Images</h3>
              <div className='flex gap-8 justify-center'>
                {[
                  { field: 'avatar' as const, label: 'Avatar' },
                  { field: 'coverPhoto' as const, label: 'Cover Photo' }
                ].map(({ field, label }) => (
                  <div key={field} className='text-center space-y-2'>
                    <Label className='text-sm font-medium text-gray-600'>{label}</Label>
                    {typeof selectedConsultant[field] === 'string' && selectedConsultant[field] ? (
                      <Avatar className='w-20 h-20 mx-auto'>
                        <AvatarImage src={selectedConsultant[field] as string} />
                        <AvatarFallback>{selectedConsultant.name ?? 'N/A'}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-500 mx-auto'>
                        No {label.toLowerCase()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <DialogFooter className='py-3 border-t'>
        <Button variant='outline' onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
))

ViewConsultantModal.displayName = 'ViewConsultantModal'

export default ViewConsultantModal
