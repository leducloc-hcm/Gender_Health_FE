import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import type { ProfileConsultantManagementResponse, ProfileConsultantResult } from './models/ProfleConsultantManagement'
import { getScheduleColumns } from './partials/columns'
import DataTable from './partials/DataTable'
import { staffApi } from '@/app/apis/staff.api'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Button } from '@/app/components/ui/button'
import { sStaffProfile } from '@/app/hooks/sStaffProfile'

const ProfileConsultantManagement = () => {
  const [consultants, setConsultants] = useState<ProfileConsultantResult[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
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
    setIsModalOpen(true)
    toast.info(`Edit schedule with ID: ${consultant.id}`, {
      position: 'top-right',
      autoClose: 1000
    })
  }

  const handleSave = () => {
    if (selectedConsultant) {
      toast.success(`Consultant ${selectedConsultant.name} updated successfully`, {
        position: 'top-right',
        autoClose: 1000
      })
      setConsultants((prev) => prev.map((c) => (c.id === selectedConsultant.id ? selectedConsultant : c)))
    }
    setIsModalOpen(false)
    setSelectedConsultant(null)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedConsultant(null)
  }

  const EditConsultantModal = () => (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Consultant Profile</DialogTitle>
        </DialogHeader>
        {selectedConsultant && (
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Name
              </Label>
              <Input
                id='name'
                value={selectedConsultant.name || ''}
                onChange={(e) =>
                  setSelectedConsultant({
                    ...selectedConsultant,
                    name: e.target.value
                  })
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
                value={selectedConsultant.email || ''}
                onChange={(e) =>
                  setSelectedConsultant({
                    ...selectedConsultant,
                    email: e.target.value
                  })
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
                  setSelectedConsultant({
                    ...selectedConsultant,
                    description: e.target.value
                  })
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
                  setSelectedConsultant({
                    ...selectedConsultant,
                    specialties: e.target.value.split(',').map((s) => s.trim())
                  })
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
                  setSelectedConsultant({
                    ...selectedConsultant,
                    languages: e.target.value.split(',').map((s) => s.trim())
                  })
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
                value={selectedConsultant.rating || ''}
                onChange={(e) =>
                  setSelectedConsultant({
                    ...selectedConsultant,
                    rating: parseFloat(e.target.value) || 0
                  })
                }
                className='col-span-3'
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Schedule Approve Management</h1>
      <div className='table-container'>
        <DataTable columns={getScheduleColumns({ onEdit: handleEdit })} data={consultants} />
        <EditConsultantModal />
      </div>
    </div>
  )
}

export default ProfileConsultantManagement
