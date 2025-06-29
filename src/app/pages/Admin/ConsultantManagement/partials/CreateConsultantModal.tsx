import { Button } from '@/app/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { memo } from 'react'
import type { RegisterConsultantReqBody } from '../models/consultant.type'

export interface CreateConsultantModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  newConsultant: Partial<RegisterConsultantReqBody>
  setNewConsultant: React.Dispatch<React.SetStateAction<Partial<RegisterConsultantReqBody>>>
  onCreate: () => Promise<void>
  onCancel: () => void
}

const CreateConsultantModal = memo(
  ({ isOpen, onOpenChange, newConsultant, setNewConsultant, onCreate, onCancel }: CreateConsultantModalProps) => {
    const handleInputChange = <K extends keyof RegisterConsultantReqBody>(
      field: K,
      value: RegisterConsultantReqBody[K]
    ) => {
      setNewConsultant((prev) => ({ ...prev, [field]: value }))
    }

    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[600px] max-h-[95vh]'>
          <DialogHeader className='pb-4'>
            <DialogTitle>Create New Consultant</DialogTitle>
          </DialogHeader>

          <div className='overflow-y-auto max-h-[calc(90vh-120px)] p-2'>
            <div className='space-y-4'>
              {[
                { id: 'name', label: 'Name *', type: 'text', required: true },
                { id: 'username', label: 'Username', type: 'text' },
                { id: 'email', label: 'Email *', type: 'email', required: true },
                { id: 'password', label: 'Password *', type: 'password', required: true },
                { id: 'confirm_password', label: 'Confirm Password *', type: 'password', required: true },
                { id: 'phone_number', label: 'Phone Number', type: 'text' },
                { id: 'bio', label: 'Bio', type: 'text' },
                { id: 'description', label: 'Description', type: 'text' },
                { id: 'location', label: 'Location', type: 'text' },
                { id: 'website', label: 'Website', type: 'url' },
                { id: 'date_of_birth', label: 'Date of Birth', type: 'date' }
              ].map(({ id, label, type, required }) => (
                <div key={id} className='space-y-2'>
                  <Label htmlFor={id} className='text-sm font-medium'>
                    {label}
                  </Label>
                  <Input
                    id={id}
                    type={type}
                    value={newConsultant[id as keyof RegisterConsultantReqBody] || ''}
                    onChange={(e) => handleInputChange(id as keyof RegisterConsultantReqBody, e.target.value)}
                    required={required}
                    className='w-full'
                  />
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className='py-3 border-t'>
            <Button variant='outline' onClick={onCancel}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={onCreate}>
              Create Consultant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
)

CreateConsultantModal.displayName = 'CreateConsultantModal'

export default CreateConsultantModal
