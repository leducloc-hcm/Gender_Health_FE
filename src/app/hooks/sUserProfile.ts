import { signify } from 'react-signify'

export const sUserProfile = signify({
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
  date_of_birth: ''
})

export const setUserProfileToSignify = (profile: any) => {
  sUserProfile.set((prev) => {
    prev.value = profile
  })
}

export const clearUserProfileSignify = () => {
  sUserProfile.set((prev) => {
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
      date_of_birth: ''
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
