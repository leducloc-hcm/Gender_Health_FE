import { Button } from '@/app/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { Upload } from 'lucide-react'
import { memo, useRef } from 'react'
import type { StaffData } from '../StaffManagement'

interface EditStaffModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedStaff: StaffData | null
  setSelectedStaff: (staff: StaffData) => void
  onSave: () => void
  onCancel: () => void
}

const EditStaffModal = memo(
  ({ isOpen, onOpenChange, selectedStaff, setSelectedStaff, onSave, onCancel }: EditStaffModalProps) => {
    const avatarInputRef = useRef<HTMLInputElement>(null)
    const coverPhotoInputRef = useRef<HTMLInputElement>(null)

    if (!selectedStaff) return null

    const handleInputChange = (field: keyof StaffData, value: string) => {
      setSelectedStaff({ ...selectedStaff, [field]: value })
    }

    const handleFileChange = (field: 'avatar' | 'coverPhoto', file: File | null) => {
      setSelectedStaff({ ...selectedStaff, [field]: file })
    }

    const getImagePreview = (image: string | File | null) => {
      if (!image) return null
      if (typeof image === 'string') return image
      return URL.createObjectURL(image)
    }

    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[700px] max-h-[95vh]'>
          <DialogHeader className='pb-4'>
            <DialogTitle>Edit Staff Profile</DialogTitle>
          </DialogHeader>

          <div className='overflow-y-auto max-h-[calc(90vh-120px)] p-2'>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Name</Label>
                  <Input
                    id='name'
                    value={selectedStaff.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder='Enter full name'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='username'>Username</Label>
                  <Input
                    id='username'
                    value={selectedStaff.username || ''}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder='Enter username'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='phone_number'>Phone Number</Label>
                  <Input
                    id='phone_number'
                    value={selectedStaff.phone_number || ''}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    placeholder='Enter phone number'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='date_of_birth'>Date of Birth</Label>
                  <Input
                    id='date_of_birth'
                    type='date'
                    value={selectedStaff.date_of_birth || ''}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='location'>Location</Label>
                <Input
                  id='location'
                  value={selectedStaff.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder='Enter location'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='website'>Website</Label>
                <Input
                  id='website'
                  value={selectedStaff.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder='Enter website URL'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='bio'>Bio</Label>
                <Textarea
                  id='bio'
                  value={selectedStaff.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder='Enter bio'
                  rows={3}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  value={selectedStaff.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder='Enter description'
                  rows={3}
                />
              </div>

              <div className='space-y-4 pt-4 border-t'>
                <div className='space-y-2'>
                  <Label>Avatar</Label>
                  <div className='flex items-center gap-4'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => avatarInputRef.current?.click()}
                      className='flex items-center gap-2'
                    >
                      <Upload className='h-4 w-4' />
                      Upload Avatar
                    </Button>
                    <input
                      ref={avatarInputRef}
                      type='file'
                      accept='image/*'
                      onChange={(e) => handleFileChange('avatar', e.target.files?.[0] || null)}
                      className='hidden'
                    />
                    {selectedStaff.avatar && (
                      <img
                        src={getImagePreview(selectedStaff.avatar) || ''}
                        alt='Avatar preview'
                        className='h-10 w-10 rounded-full object-cover'
                      />
                    )}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label>Cover Photo</Label>
                  <div className='flex items-center gap-4'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => coverPhotoInputRef.current?.click()}
                      className='flex items-center gap-2'
                    >
                      <Upload className='h-4 w-4' />
                      Upload Cover Photo
                    </Button>
                    <input
                      ref={coverPhotoInputRef}
                      type='file'
                      accept='image/*'
                      onChange={(e) => handleFileChange('coverPhoto', e.target.files?.[0] || null)}
                      className='hidden'
                    />
                    {selectedStaff.coverPhoto && (
                      <img
                        src={getImagePreview(selectedStaff.coverPhoto) || ''}
                        alt='Cover photo preview'
                        className='h-10 w-20 rounded object-cover'
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className='py-3 border-t'>
            <Button variant='outline' onClick={onCancel}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={onSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
)

EditStaffModal.displayName = 'EditStaffModal'

export default EditStaffModal
