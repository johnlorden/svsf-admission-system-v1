'use client';

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ApplicationForm } from './ApplicationForm'
import { useToast } from '@/components/ui/use-toast'
import { EnrollmentSlipDownload } from './EnrollmentSlipDownload'
import { FilePdf, Clipboard } from '@phosphor-icons/react'

export function StudentDashboard() {
  const { data: session } = useSession()
  const [application, setApplication] = useState(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchApplication()
  }, [])

  const fetchApplication = async () => {
    try {
      const response = await fetch('/api/application')
      if (response.ok) {
        const data = await response.json()
        setApplication(data.application)
      }
    } catch (error) {
      console.error('Error fetching application:', error)
      toast({
        title: "Error",
        description: "Failed to fetch application data. Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleStartApplication = () => {
    if (application) {
      toast({
        title: "Error",
        description: "You have already submitted an application.",
        variant: "destructive",
      })
    } else {
      setShowApplicationForm(true)
    }
  }

  const handleDownloadApplicationPDF = async () => {
    try {
      const response = await fetch(`/api/generate-pdf?type=application&id=${application.id}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `application-${application.id}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        throw new Error('Failed to generate application PDF')
      }
    } catch (error) {
      console.error('Error downloading application PDF:', error)
      toast({
        title: "Error",
        description: "Failed to download application PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (showApplicationForm) {
    return <ApplicationForm />
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {session?.user?.name}</h1>
      {application ? (
        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>Your current application status and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Status: {application.status}</p>
            <Progress value={getProgressValue(application.status)} className="mb-4" />
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => setShowApplicationForm(true)} className="flex items-center">
                <Clipboard className="mr-2" size={20} />
                View Application
              </Button>
              <Button onClick={handleDownloadApplicationPDF} className="flex items-center">
                <FilePdf className="mr-2" size={20} />
                Download Application PDF
              </Button>
              <EnrollmentSlipDownload 
                applicationId={application.id} 
                isApproved={application.status === 'APPROVED'} 
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Start Your Application</CardTitle>
            <CardDescription>Begin your enrollment process</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleStartApplication} className="flex items-center">
              <Clipboard className="mr-2" size={20} />
              Start Application
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function getProgressValue(status: string) {
  switch (status) {
    case 'PENDING':
      return 25
    case 'UNDER_REVIEW':
      return 50
    case 'APPROVED':
      return 75
    case 'ENROLLED':
      return 100
    default:
      return 0
  }
}

