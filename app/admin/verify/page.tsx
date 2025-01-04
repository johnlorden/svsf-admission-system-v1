'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

export default function VerifyEnrollmentSlip() {
  const [applicationId, setApplicationId] = useState('')
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const { toast } = useToast()

  const handleVerify = async () => {
    try {
      const response = await fetch(`/api/admin/verify-enrollment-slip?applicationId=${applicationId}`)
      if (response.ok) {
        const result = await response.json()
        setVerificationResult(result)
      } else {
        throw new Error('Failed to verify enrollment slip')
      }
    } catch (error) {
      console.error('Error verifying enrollment slip:', error)
      toast({
        title: "Error",
        description: "Failed to verify enrollment slip. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Verify Enrollment Slip</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter Application ID"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
            />
            <Button onClick={handleVerify}>Verify</Button>
          </div>
          {verificationResult && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Verification Result:</h3>
              <p>Status: {verificationResult.status}</p>
              <p>Student Name: {verificationResult.studentName}</p>
              <p>Grade Level: {verificationResult.gradeLevel}</p>
              <p>Application Date: {new Date(verificationResult.createdAt).toLocaleDateString()}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

