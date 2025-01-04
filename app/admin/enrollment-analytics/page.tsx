'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type EnrollmentData = {
  gradeLevel: string
  count: number
}

export default function EnrollmentAnalytics() {
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData[]>([])

  useEffect(() => {
    fetchEnrollmentData()
  }, [])

  const fetchEnrollmentData = async () => {
    try {
      const response = await fetch('/api/admin/enrollment-analytics')
      if (response.ok) {
        const data = await response.json()
        setEnrollmentData(data.enrollmentData)
      }
    } catch (error) {
      console.error('Error fetching enrollment data:', error)
    }
  }

  return (
    <div className="container mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="gradeLevel" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

