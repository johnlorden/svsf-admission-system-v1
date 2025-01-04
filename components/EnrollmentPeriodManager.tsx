'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'

export function EnrollmentPeriodManager() {
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchEnrollmentPeriod()
  }, [])

  const fetchEnrollmentPeriod = async () => {
    try {
      const response = await fetch('/api/admin/enrollment-period')
      if (response.ok) {
        const data = await response.json()
        setIsEnrollmentOpen(data.isOpen)
        setStartDate(data.startDate)
        setEndDate(data.endDate)
      }
    } catch (error) {
      console.error('Error fetching enrollment period:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/enrollment-period', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isOpen: isEnrollmentOpen, startDate, endDate }),
      })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Enrollment period settings updated successfully.",
        })
      } else {
        throw new Error('Failed to update enrollment period settings')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update enrollment period settings.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          checked={isEnrollmentOpen}
          onCheckedChange={setIsEnrollmentOpen}
          id="enrollment-status"
        />
        <Label htmlFor="enrollment-status">Enrollment is {isEnrollmentOpen ? 'Open' : 'Closed'}</Label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-date">End Date</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
      </div>
      <Button type="submit">Save Enrollment Period Settings</Button>
    </form>
  )
}

