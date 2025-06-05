import { signify } from 'react-signify'

export const sConsultantProfile = signify({
  id: 0,
  email: '',
  role: '',
  status: '',
  consultant_profile_id: 0,
  created_at: '',
  updated_at: '',
  name: '',
  bio: '',
  location: '',
  username: '',
  avatar: '',
  coverPhoto: '',
  date_of_birth: '',
  website: '',
  phone_number: '',
  description: ''
})

export const setConsultantProfileToSignify = (profile: any) => {
  sConsultantProfile.set((prev) => {
    prev.value = profile
  })
}

export const clearConsultantProfileSignify = () => {
  sConsultantProfile.set((prev) => {
    prev.value = {
      id: 0,
      email: '',
      role: '',
      status: '',
      created_at: '',
      updated_at: '',
      name: '',
      bio: '',
      location: '',
      username: '',
      avatar: '',
      coverPhoto: '',
      date_of_birth: '',
      consultant_profile_id: 0,
      website: '',
      phone_number: '',
      description: ''
    }
  })
}

// export const updateUserProfileSignify = (updates: Partial<getProfileResult>) => {
//   sUserProfile.set((prev) => {
//     prev.value = {
//       ...prev.value,
//       ...updates
//     }
//   })
// }
