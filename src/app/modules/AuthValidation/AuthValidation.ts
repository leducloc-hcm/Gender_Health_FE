export const nameValidation = {
  required: 'Name is required',
  minLength: {
    value: 2,
    message: 'Name must be at least 2 characters'
  },
  maxLength: {
    value: 50,
    message: 'Name must be at most 50 characters'
  }
}

export const dateOfBirthValidation = {
  required: 'Date of Birth is required',
  validate: (value: Date | undefined) => {
    if (!value) return 'Date of Birth is required'
    const today = new Date()
    const birthDate = new Date(value)
    const age = today.getFullYear() - birthDate.getFullYear()
    if (age < 13) return 'You must be at least 13 years old'
    if (birthDate > today) return 'Date of birth cannot be in the future'
    return true
  }
}

export const emailValidation = {
  required: 'Email is required',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Please enter a valid email address'
  }
}

export const passwordValidation = {
  required: 'Password is required',
  minLength: {
    value: 6,
    message: 'Password must be at least 6 characters long'
  },
  maxLength: {
    value: 50,
    message: 'Password must be at most 50 characters long'
  },
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
    message: 'Password must include uppercase, lowercase, number, and symbol'
  }
}

export const otpValidation = {
  required: 'OTP code is required',
  pattern: {
    value: /^\d{6}$/,
    message: 'OTP code must be exactly 6 digits'
  }
}

export const telValidation = {
  required: 'Phone Number is required',
  pattern: {
    value: /^(0|\+84)\d{9,10}$/,
    message: 'Invalid, must be vietnamese phone number!'
  }
}

