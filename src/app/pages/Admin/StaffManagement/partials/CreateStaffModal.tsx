import { Button } from '@/app/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { memo } from 'react'
import type { StaffManagementRequestCreate } from '../models/staff.type'

interface CreateStaffModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  newStaff: Partial<StaffManagementRequestCreate>
  setNewStaff: (staff: Partial<StaffManagementRequestCreate>) => void
  onCreate: () => void
  onCancel: () => void
}

const CreateStaffModal = memo(
  ({ isOpen, onOpenChange, newStaff, setNewStaff, onCreate, onCancel }: CreateStaffModalProps) => {
    const handleInputChange = (field: keyof StaffManagementRequestCreate, value: string) => {
      setNewStaff({ ...newStaff, [field]: value })
    }

    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[700px] max-h-[95vh]'>
          <DialogHeader className='pb-4'>
            <DialogTitle>Create New Staff</DialogTitle>
          </DialogHeader>

          <div className='overflow-y-auto max-h-[calc(90vh-120px)] p-2'>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Name *</Label>
                  <Input
                    id='name'
                    value={newStaff.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder='Enter full name'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='username'>Username</Label>
                  <Input
                    id='username'
                    value={newStaff.username || ''}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder='Enter username'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Email *</Label>
                <Input
                  id='email'
                  type='email'
                  value={newStaff.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder='Enter email address'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='password'>Password *</Label>
                  <Input
                    id='password'
                    type='password'
                    value={newStaff.password || ''}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder='Enter password'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='confirm_password'>Confirm Password *</Label>
                  <Input
                    id='confirm_password'
                    type='password'
                    value={newStaff.confirm_password || ''}
                    onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                    placeholder='Confirm password'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='phone_number'>Phone Number</Label>
                  <Input
                    id='phone_number'
                    value={newStaff.phone_number || ''}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    placeholder='Enter phone number'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='date_of_birth'>Date of Birth</Label>
                  <Input
                    id='date_of_birth'
                    type='date'
                    value={newStaff.date_of_birth || ''}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='location'>Location</Label>
                <Input
                  id='location'
                  value={newStaff.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder='Enter location'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='website'>Website</Label>
                <Input
                  id='website'
                  value={newStaff.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder='Enter website URL'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='bio'>Bio</Label>
                <Textarea
                  id='bio'
                  value={newStaff.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder='Enter bio'
                  rows={3}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  value={newStaff.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder='Enter description'
                  rows={3}
                />
              </div>
            </div>
          </div>

          <DialogFooter className='py-3 border-t'>
            <Button variant='outline' onClick={onCancel}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={onCreate}>
              Create Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
)

CreateStaffModal.displayName = 'CreateStaffModal'

export default CreateStaffModal
