'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { AdminApplications } from '@/components/AdminApplications'
import { AdminManagement } from '@/components/AdminManagement'
import { SchoolSettings } from '@/components/SchoolSettings'

export default function AdminDashboard() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(true)

  useEffect(() => {
    // Fetch current enrollment status
    fetch('/api/enrollment-status')
      .then(res => res.json())
      .then(data => setIsEnrollmentOpen(data.isOpen))
  }, [])

  const handleEnrollmentToggle = async () => {
    try {
      const response = await fetch('/api/enrollment-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen: !isEnrollmentOpen }),
      })
      if (response.ok) {
        setIsEnrollmentOpen(!isEnrollmentOpen)
        toast({
          title: "Success",
          description: `Enrollment is now ${!isEnrollmentOpen ? 'open' : 'closed'}.`,
        })
      } else {
        throw new Error('Failed to update enrollment status')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update enrollment status.",
        variant: "destructive",
      })
    }
  }

  if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPER_ADMIN') {
    return <div>Access Denied</div>
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Enrollment Status</CardTitle>
          <CardDescription>Control the enrollment system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              checked={isEnrollmentOpen}
              onCheckedChange={handleEnrollmentToggle}
            />
            <Label>Enrollment is {isEnrollmentOpen ? 'Open' : 'Closed'}</Label>
          </div>
        </CardContent>
      </Card>

      <AdminApplications />

      {session.user.role === 'SUPER_ADMIN' && (
        <>
          <AdminManagement />
          <SchoolSettings />
        </>
      )}
    </div>
  )
}

