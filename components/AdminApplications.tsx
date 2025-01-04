'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

export function AdminApplications() {
  const [applications, setApplications] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [gradeLevelFilter, setGradeLevelFilter] = useState('ALL')
  const [strandFilter, setStrandFilter] = useState('ALL')
  const { toast } = useToast()

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications')
      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        fetchApplications()
        toast({
          title: "Success",
          description: "Application status updated successfully.",
        })
      } else {
        throw new Error('Failed to update application status')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive",
      })
    }
  }

  const handleBulkAction = async (action) => {
    try {
      const response = await fetch('/api/applications/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, applications: filteredApplications.map(app => app.id) }),
      })
      if (response.ok) {
        fetchApplications()
        toast({
          title: "Success",
          description: `Bulk ${action} completed successfully.`,
        })
      } else {
        throw new Error(`Failed to perform bulk ${action}`)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to perform bulk ${action}.`,
        variant: "destructive",
      })
    }
  }

  const handleExport = async (applicationId) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}/export`, {
        method: 'GET',
      })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `application_${applicationId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        toast({
          title: "Success",
          description: "Application exported successfully.",
        })
      } else {
        throw new Error('Failed to export application')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export application.",
        variant: "destructive",
      })
    }
  }

  const filteredApplications = applications.filter(app =>
    (app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     app.gradeLevel.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'ALL' || app.status === statusFilter) &&
    (gradeLevelFilter === 'ALL' || app.gradeLevel === gradeLevelFilter) &&
    (strandFilter === 'ALL' || app.strand === strandFilter)
  )

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Application Management</CardTitle>
        <CardDescription>Manage and review student applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Search by name or grade level"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={gradeLevelFilter} onValueChange={setGradeLevelFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by grade level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="ELEMENTARY">Elementary</SelectItem>
              <SelectItem value="JUNIOR_HIGH">Junior High</SelectItem>
              <SelectItem value="SENIOR_HIGH">Senior High</SelectItem>
            </SelectContent>
          </Select>
          {gradeLevelFilter === 'SENIOR_HIGH' && (
            <Select value={strandFilter} onValueChange={setStrandFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by strand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="STEM">STEM</SelectItem>
                <SelectItem value="ABM">ABM</SelectItem>
                <SelectItem value="HUMSS">HUMSS</SelectItem>
                <SelectItem value="TVL">TVL</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="mb-4">
          <Button onClick={() => handleBulkAction('approve')} className="mr-2">Bulk Approve</Button>
          <Button onClick={() => handleBulkAction('reject')} variant="destructive">Bulk Reject</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Grade Level</TableHead>
              <TableHead>Strand</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>{app.studentName}</TableCell>
                <TableCell>{app.gradeLevel}</TableCell>
                <TableCell>{app.strand || 'N/A'}</TableCell>
                <TableCell>{app.status}</TableCell>
                <TableCell>
                  <Select
                    value={app.status}
                    onValueChange={(newStatus) => handleStatusChange(app.id, newStatus)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => handleExport(app.id)} className="ml-2">Export</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

