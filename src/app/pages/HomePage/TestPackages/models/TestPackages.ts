// TestCategory
export interface TestCategory {
  id: number
  name: string
  code: string
  description: string
  created_at?: string
  updated_at?: string
  type_of_test_id?: number
  type_of_test?: any
  test_range?: any[]
}
export interface TestCategoryResponse {
  message: string
  data: TestCategory[]
}

// Test package
export interface TestPackageItem {
  id: number
  name: string
  code: string
  description: string
  price: number
  tests: TestCategory[]
  bgColor?: string
  checkColor?: string
}

export interface TestPackageItemResponse {
  message: string
  data: TestPackageItem
}

export interface TestPackageResponse {
  message: string
  data: TestPackageItem[]
}

export interface EditTestPackageItem {
  name?: string
  code?: string
  description?: string
  priceList?: number
  tests?: string[]
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
