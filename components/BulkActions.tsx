'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

type Application = {
  id: string
  status: string
  // Add other relevant fields
}

type BulkActionsProps = {
  applications: Application[]
  onActionComplete: () => void
}

export function BulkActions({ applications, onActionComplete }: BulkActionsProps) {
  const [selectedApplications, setSelectedApplications] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState('')
  const { toast } = useToast()

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplications(applications.map(app => app.id))
    } else {
      setSelectedApplications([])
    }
  }

  const handleSelectApplication = (applicationId: string, checked: boolean) => {
    if (checked) {
      setSelectedApplications([...selectedApplications, applicationId])
    } else {
      setSelectedApplications(selectedApplications.filter(id => id !== applicationId))
    }
  }

  const handleBulkAction = async () => {
    if (!bulkAction || selectedApplications.length === 0) {
      toast({
        title: "Error",
        description: "Please select an action and at least one application.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/admin/bulk-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: bulkAction, applicationIds: selectedApplications }),
      })
      if (response.ok) {
        toast({
          title: "Success",
          description: `Bulk action '${bulkAction}' completed successfully.`,
        })
        onActionComplete()
        setSelectedApplications([])
        setBulkAction('')
      } else {
        throw new Error('Failed to perform bulk action')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform bulk action.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="select-all"
          checked={selectedApplications.length === applications.length}
          onCheckedChange={handleSelectAll}
        />
        <label htmlFor="select-all">Select All</label>
      </div>
      {applications.map(app => (
        <div key={app.id} className="flex items-center space-x-2">
          <Checkbox
            id={`app-${app.id}`}
            checked={selectedApplications.includes(app.id)}
            onCheckedChange={(checked) => handleSelectApplication(app.id, checked as boolean)}
          />
          <label htmlFor={`app-${app.id}`}>Application {app.id}</label>
        </div>
      ))}
      <div className="flex items-center space-x-2">
        <Select value={bulkAction} onValueChange={setBulkAction}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="approve">Approve</SelectItem>
            <SelectItem value="reject">Reject</SelectItem>
            <SelectItem value="review">Mark for Review</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleBulkAction}>Apply Bulk Action</Button>
      </div>
    </div>
  )
}

