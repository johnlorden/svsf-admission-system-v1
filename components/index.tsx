'use client'

import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { ApplyingFor } from './ApplyingFor'
import { StudentInformation } from './StudentInformation'
import { FamilyBackground } from './FamilyBackground'
import { EducationalBackground } from './EducationalBackground'
import { DocumentUpload } from './DocumentUpload'
import { CustomNotification } from '../CustomNotification'

const formSchema = z.object({
  applyingFor: z.object({
    gradeLevel: z.string(),
    strand: z.string().optional(),
  }),
  studentInformation: z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    middleName: z.string().optional(),
    birthdate: z.string(),
    gender: z.string(),
    address: z.string(),
    city: z.string(),
    province: z.string(),
    postalCode: z.string(),
  }),
  familyBackground: z.object({
    fatherName: z.string().min(2, "Father's name must be at least 2 characters"),
    fatherOccupation: z.string(),
    motherName: z.string().min(2, "Mother's name must be at least 2 characters"),
    motherOccupation: z.string(),
    guardianName: z.string().optional(),
    guardianRelationship: z.string().optional(),
    householdIncome: z.string(),
  }),
  educationalBackground: z.object({
    previousSchool: z.string().min(2, "Previous school name must be at least 2 characters"),
    schoolAddress: z.string(),
    schoolContact: z.string().optional(),
    lrn: z.string().length(12, "LRN must be exactly 12 characters"),
    lastGradeCompleted: z.string(),
  }),
  documents: z.array(z.object({
    name: z.string(),
    file: z.instanceof(File),
  })),
})

type FormData = z.infer<typeof formSchema>

const steps = ['Applying For', 'Student Information', 'Family Background', 'Educational Background', 'Document Upload']

export function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const { data: session } = useSession()
  const [applicationCount, setApplicationCount] = useState(0)

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  })

  useEffect(() => {
    const fetchApplicationCount = async () => {
      const response = await fetch('/api/application-count')
      const data = await response.json()
      setApplicationCount(data.count)
    }

    fetchApplicationCount()
  }, [])

  const handleStepComplete = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }))
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (session?.user?.role === 'STUDENT' && applicationCount > 0) {
      setNotification({ type: 'error', message: 'Students are limited to one application.' })
      return
    }

    if (session?.user?.role === 'PARENT' && applicationCount >= 5) {
      setNotification({ type: 'error', message: 'Parents are limited to 5 applications.' })
      return
    }

    try {
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setNotification({ type: 'success', message: 'Your application has been successfully submitted.' })
        // Redirect to dashboard or confirmation page
      } else {
        throw new Error('Failed to submit application')
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to submit application. Please try again.' })
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ApplyingFor onComplete={handleStepComplete} />
      case 1:
        return <StudentInformation onComplete={handleStepComplete} />
      case 2:
        return <FamilyBackground onComplete={handleStepComplete} />
      case 3:
        return <EducationalBackground onComplete={handleStepComplete} gradeLevel={formData.gradeLevel} />
      case 4:
        return <DocumentUpload onComplete={handleStepComplete} gradeLevel={formData.gradeLevel} />
      default:
        return null
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Application Form</h2>
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex items-center ${
                  index <= currentStep ? 'text-primary' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStep ? 'bg-primary text-white' : 'bg-gray-200'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="ml-2 text-sm hidden md:inline">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {renderStep()}

        <div className="flex justify-between mt-8">
          {currentStep > 0 && (
            <Button type="button" onClick={() => setCurrentStep(prev => prev - 1)} variant="outline">
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={() => methods.handleSubmit(handleStepComplete)()}>
              Next
            </Button>
          ) : (
            <Button type="submit">Submit Application</Button>
          )}
        </div>
      </form>
      {notification && (
        <CustomNotification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </FormProvider>
  )
}

