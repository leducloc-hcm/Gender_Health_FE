import { signify } from "react-signify"

export const sAdminProfile = signify({
  id: 0,
  email: '',
  role: '',
  status: '',
  consultant_profile_id: 0,
  created_at: '',
  updated_at: '',
  name: '',
  bio: null,
  location: null,
  username: '',
  avatar: null,
  coverPhoto: null,
  date_of_birth: null,
  website: null,
  phone_number: '',
  description: null
})

export const setAdminProfileToSignify = (profile: any) => {
  sAdminProfile.set((prev) => {
    prev.value = profile
  })
}
