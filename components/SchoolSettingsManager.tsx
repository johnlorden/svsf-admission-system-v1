'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

export function SchoolSettingsManager() {
  const [schoolName, setSchoolName] = useState('')
  const [schoolAddress, setSchoolAddress] = useState('')
  const [schoolLogo, setSchoolLogo] = useState<File | null>(null)
  const [schoolDescription, setSchoolDescription] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchSchoolSettings()
  }, [])

  const fetchSchoolSettings = async () => {
    try {
      const response = await fetch('/api/admin/school-settings')
      if (response.ok) {
        const data = await response.json()
        setSchoolName(data.name)
        setSchoolAddress(data.address)
        setSchoolDescription(data.description)
      }
    } catch (error) {
      console.error('Error fetching school settings:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', schoolName)
    formData.append('address', schoolAddress)
    formData.append('description', schoolDescription)
    if (schoolLogo) {
      formData.append('logo', schoolLogo)
    }

    try {
      const response = await fetch('/api/admin/school-settings', {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">School Settings</h3>
      <div className="space-y-2">
        <Label htmlFor="school-name">School Name</Label>
        <Input
          id="school-name"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="school-address">School Address</Label>
        <Input
          id="school-address"
          value={schoolAddress}
          onChange={(e) => setSchoolAddress(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="school-logo">School Logo</Label>
        <Input
          id="school-logo"
          type="file"
          accept="image/*"
          onChange={(e) => setSchoolLogo(e.target.files?.[0] || null)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="school-description">School Description</Label>
        <Textarea
          id="school-description"
          value={schoolDescription}
          onChange={(e) => setSchoolDescription(e.target.value)}
          rows={4}
        />
      </div>
      <Button type="submit">Update School Settings</Button>
    </form>
  )
}

