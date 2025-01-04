'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

export function SchoolSettings() {
  const [schoolName, setSchoolName] = useState('')
  const [schoolLogo, setSchoolLogo] = useState<File | null>(null)
  const [offerChoices, setOfferChoices] = useState('')
  const [requirements, setRequirements] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchSchoolSettings()
  }, [])

  const fetchSchoolSettings = async () => {
    try {
      const response = await fetch('/api/school-settings')
      if (response.ok) {
        const data = await response.json()
        setSchoolName(data.schoolName)
        setOfferChoices(data.offerChoices.join('\n'))
        setRequirements(data.requirements.join('\n'))
      }
    } catch (error) {
      console.error('Error fetching school settings:', error)
    }
  }

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('schoolName', schoolName)
    if (schoolLogo) {
      formData.append('schoolLogo', schoolLogo)
    }
    formData.append('offerChoices', offerChoices)
    formData.append('requirements', requirements)

    try {
      const response = await fetch('/api/school-settings', {
        method: 'POST',
        body: formData,
      })
      if (response.ok) {
        toast({
          title: "Success",
          description: "School settings updated successfully.",
        })
      } else {
        throw new Error('Failed to update school settings')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update school settings.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>School Settings</CardTitle>
        <CardDescription>Modify school information and enrollment options</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="schoolName">School Name</Label>
            <Input
              id="schoolName"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="schoolLogo">School Logo</Label>
            <Input
              id="schoolLogo"
              type="file"
              accept="image/*"
              onChange={(e) => setSchoolLogo(e.target.files?.[0] || null)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="offerChoices">Offer Choices (one per line)</Label>
            <textarea
              id="offerChoices"
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={offerChoices}
              onChange={(e) => setOfferChoices(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="requirements">Requirements (one per line)</Label>
            <textarea
              id="requirements"
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Save Settings</Button>
        </form>
      </CardContent>
    </Card>
  )
}

