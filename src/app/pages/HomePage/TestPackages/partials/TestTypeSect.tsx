import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/app/components/ui/card'
import { useInView, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { MergedTestType, TestPackageItem, TestTypeItem } from '../models/TestPackages'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/app/components/ui/collapsible'
import { Minus, Plus, CircleX, CircleCheck } from 'lucide-react'
import { testApi } from '@/app/apis/test.api'
import { toast } from 'react-toastify'

const bgColorMapping: Record<string, string> = {
  SE110: 'bg-teal-500',
  SE111: 'bg-orange-500',
  SE112: 'bg-blue-500',
  SE113: 'bg-purple-600'
}

const checkColorMapping: Record<string, string> = {
  SE110: 'text-teal-500',
  SE111: 'text-orange-500',
  SE112: 'text-blue-500',
  SE113: 'text-purple-600'
}

export default function TestTypeSect() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const [testPackages, setTestPackages] = useState<TestPackageItem[]>([])
  const [renderedTestTypes, setRenderedTestTypes] = useState<MergedTestType[]>([])

  // TestTypes
  const [openTestTypes, setOpenTestTypes] = useState<{ [key: number | string]: boolean }>({})
  const toggleOpenTestTypes = (id: number | string) => {
    setOpenTestTypes((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // TestCategory
  const [openTestCategory, setOpenTestCategory] = useState<{ [key: number | string]: boolean }>({})
  const toggleOpenTestCategory = (id: number | string) => {
    setOpenTestCategory((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  // Function merge TestCategories (includedInPackages)
  function mergeTestCategoriesByType(testTypes: TestTypeItem[], testPackages: TestPackageItem[]): MergedTestType[] {
    // Collect array test codes in each package
    const packageTestCodes = testPackages.map((pkg) => pkg.tests.map((test) => test.code))

    return testTypes.map((type) => ({
      typeId: type.id,
      typeCode: type.code,
      typeName: type.name,
      tests: type.tests.map((test) => {
        // Check if the test code is included in each package’s list of codes
        // True: Included - False: Not included
        const includedInPackages = packageTestCodes.map((codes) => codes.includes(test.code))

        return {
          id: test.id,
          code: test.code,
          name: test.name,
          description: test.description,
          includedInPackages
        }
      })
    }))
  }

  async function fetchAllData(): Promise<void> {
    try {
      // fetch test packages & fetch test packages
      const [packagesRes, typesRes] = await Promise.all([testApi.getAllTestPackage(), testApi.getAllTypeOfTest()])

      // Add bgColor & checkColor for each package
      const pricingPlans = packagesRes.data?.map((pack) => ({
        ...pack,
        bgColor: bgColorMapping[pack.code] || 'bg-gray-500',
        checkColor: checkColorMapping[pack.code] || 'text-gray-500'
      }))
      setTestPackages(pricingPlans)

      // Merge TestCategories
      const merged = mergeTestCategoriesByType(typesRes.data, packagesRes.data)
      setRenderedTestTypes(merged)
    } catch (error: any) {
      console.error('Failed to fetch test data:', error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllData()
    toggleOpenTestTypes(1)
  }, [])

  return (
    <>
      <section id='test-type' className='py-20 bg-white'>
        <div className='container mx-auto px-4 md:px-8'>
          <motion.div ref={ref} variants={containerVariants} initial='hidden' animate={isInView ? 'visible' : 'hidden'}>
            {/* test packages */}
            <motion.div variants={itemVariants}>
              <h1 className='text-3xl lg:text-5xl text-center text-black font-extrabold'>
                Cost of the 13-Disease STi Testing Package
              </h1>
              <div className='grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 p-2 sm:p-4 md:p-6'>
                {testPackages.length === 0 ? (
                  <p className='col-span-4 text-center text-lg sm:text-xl md:text-2xl text-gray-600 font-semibold bg-gray-100 py-4 sm:py-6 md:py-8 rounded-lg sm:rounded-xl md:rounded-2xl'>
                    No test packages found
                  </p>
                ) : (
                  <>
                    {testPackages.map((pkg, index) => (
                      <Card
                        key={index}
                        className={`${pkg.bgColor} text-white border-0 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden`}
                      >
                        <CardHeader className='text-center pb-0 px-2 sm:px-4 md:px-6 pt-2 sm:pt-4 md:pt-6'>
                          <h3 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight'>
                            {pkg.name}
                          </h3>
                        </CardHeader>

                        <CardContent className='text-center pb-0 px-2 sm:px-4 md:px-6 pt-0'>
                          <p className='text-sm sm:text-lg font-semibold opacity-90 mb-1 sm:mb-2'>{pkg.description}</p>
                          <p className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight'>
                            {pkg.price.toLocaleString()} VND
                          </p>
                        </CardContent>

                        <CardFooter className='px-2 sm:px-4 md:px-6 pb-2 sm:pb-4 md:pb-6 pt-0 sm:pt-1'>
                          <Button className='w-full bg-white text-gray-800 hover:bg-gray-200 font-bold rounded-md sm:rounded-lg text-base md:text-xl py-4 md:py-5'>
                            Booking
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </>
                )}
              </div>
            </motion.div>

            {/* test types */}
            <motion.div variants={itemVariants}>
              <div className='w-full bg-white rounded-lg shadow-sm border'>
                {renderedTestTypes.length === 0 ? (
                  <p className='col-span-4 text-center text-lg sm:text-xl md:text-2xl text-gray-600 font-semibold bg-gray-100 py-4 sm:py-6 md:py-8 rounded-lg sm:rounded-xl md:rounded-2xl'>
                    No test types found
                  </p>
                ) : (
                  <>
                    {renderedTestTypes.map((type) => (
                      <Collapsible
                        key={type.typeId}
                        open={openTestTypes[type.typeId]}
                        onOpenChange={() => toggleOpenTestTypes(type.typeId)}
                      >
                        <CollapsibleTrigger className='flex items-center gap-3 w-full p-4 text-left hover:bg-gray-100 transition-colors'>
                          <div className='flex-shrink-0'>
                            {openTestTypes[type.typeId] ? (
                              <Minus className='h-5 w-5 text-gray-600' />
                            ) : (
                              <Plus className='h-5 w-5 text-gray-600' />
                            )}
                          </div>
                          <span className='text-gray-800 font-bold text-base md:text-xl'>{type.typeName}</span>
                        </CollapsibleTrigger>
                        {/* data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down */}
                        <CollapsibleContent className='overflow-hidden py-4'>
                          {type.tests.map((test) => (
                            <div key={test.id} className='ml-6 space-y-2'>
                              <div className='border-l-2 border-gray-100'>
                                <Collapsible
                                  open={openTestCategory[test.id]}
                                  onOpenChange={() => toggleOpenTestCategory(test.id)}
                                >
                                  <CollapsibleTrigger className='w-full p-4 hover:bg-gray-100 transition-colors'>
                                    <div className='flex justify-start items-center gap-3 mb-4'>
                                      <div className='flex-shrink-0'>
                                        {openTestCategory[test.id] ? (
                                          <Minus className='h-5 w-5 text-gray-600' />
                                        ) : (
                                          <Plus className='h-5 w-5 text-gray-600' />
                                        )}
                                      </div>
                                      <p className='text-gray-800 font-bold text-base md:text-xl'>{test.name}</p>
                                    </div>
                                    <div className='grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 w-full max-w-none'>
                                      {test.includedInPackages.map((included, pkgIndex) => (
                                        <div key={pkgIndex} className='flex justify-center items-center h-6'>
                                          {included ? (
                                            <CircleCheck
                                              className={`h-8 w-8 ${testPackages[pkgIndex].bgColor} rounded-full text-white`}
                                            />
                                          ) : (
                                            <CircleX className='h-8 w-8 text-gray-300 opacity-80 rounded-full' />
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent className='ml-7 py-2'>
                                    <p className='text-gray-600 font-semibold text-lg leading-relaxed italic'>
                                      {test.description}
                                    </p>
                                  </CollapsibleContent>
                                </Collapsible>
                              </div>
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
