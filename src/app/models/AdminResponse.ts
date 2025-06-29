export interface CountUser {
  CUSTOMER: number
  STAFF: number
  GUEST: number
  ADMIN: number
  CONSULTANT: number
}

export interface CountUserResponse {
  message: string
  count: CountUser
}

export interface RevenuePerPackage {
  testPackageId: number
  testPackageName: string
  totalAmount: string
}

export interface RevenuePackageResponse {
  message: string
  data: RevenuePerPackage[]
}
