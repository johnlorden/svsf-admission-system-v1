'use client';

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EnrollmentPeriodManager } from './EnrollmentPeriodManager'
import { SchoolSettingsManager } from './SchoolSettingsManager'
import { EnrollmentAnalytics } from './EnrollmentAnalytics'
import { AdminManagement } from './AdminManagement'

export function SuperAdminDashboard() {
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Super Admin Dashboard</h2>
      
      <EnrollmentPeriodManager />
      
      <SchoolSettingsManager />
      
      <EnrollmentAnalytics />
      
      <AdminManagement />

      <Card>
        <CardHeader>
          <CardTitle>System Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setNotification({ type: 'info', message: 'Feature coming soon. This feature is not yet implemented.' })}>
            Manage System Settings
          </Button>
        </CardContent>
      </Card>
      {notification && (
        <CustomNotification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  )
}

//CustomNotification Component (needs to be defined elsewhere and imported)
const CustomNotification = ({ type, message, onClose }: { type: 'success' | 'error' | 'info', message: string, onClose: () => void }) => {
  return (
    <div className={`p-4 rounded-md ${type === 'success' ? 'bg-green-100 text-green-800' : type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
      <p>{message}</p>
      <button onClick={onClose} className="float-right">Close</button>
    </div>
  )
}

