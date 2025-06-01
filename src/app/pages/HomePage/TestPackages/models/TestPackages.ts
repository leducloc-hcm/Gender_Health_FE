// TestCategory
interface TestCategory {
  id: number
  name: string
  code: string
  description: string
}

// Test package
export interface TestPackageItem {
  id: number
  name: string
  code: string
  description: string
  price: number
  tests: TestCategory[]
}

export interface TestPackageResponse {
  message: string
  data: TestPackageItem[]
}

// Test type
export interface TestTypeItem {
  id: number
  name: string
  code: string
  description: string
  tests: TestCategory[]
}

export interface TestTypeResponse {
  message: string
  data: TestTypeItem[]
}

// Modified Test Category
interface MergedTestCategory {
  id: number | string
  code: string
  name: string
  description: string
  includedInPackages: boolean[]
}

// Final test type
export interface MergedTestType {
  typeId: number | string
  typeCode: string
  typeName: string
  tests: MergedTestCategory[]
}
