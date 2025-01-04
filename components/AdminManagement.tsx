'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'

export function AdminManagement() {
  const [admins, setAdmins] = useState([])
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminName, setNewAdminName] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admins')
      if (response.ok) {
        const data = await response.json()
        setAdmins(data.admins)
      }
    } catch (error) {
      console.error('Error fetching admins:', error)
    }
  }

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newAdminEmail, name: newAdminName, password: newAdminPassword }),
      })
      if (response.ok) {
        fetchAdmins()
        setNewAdminEmail('')
        setNewAdminName('')
        setNewAdminPassword('')
        toast({
          title: "Success",
          description: "New admin added successfully.",
        })
      } else {
        throw new Error('Failed to add new admin')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add new admin.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAdmin = async (adminId) => {
    try {
      const response = await fetch(`/api/admins/${adminId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchAdmins()
        toast({
          title: "Success",
          description: "Admin deleted successfully.",
        })
      } else {
        throw new Error('Failed to delete admin')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete admin.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Admin Management</CardTitle>
        <CardDescription>Add or remove admin accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddAdmin} className="mb-6">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Add Admin</Button>
          </div>
        </form>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDeleteAdmin(admin.id)} variant="destructive">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

