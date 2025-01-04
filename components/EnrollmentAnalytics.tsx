'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

type EnrollmentData = {
  gradeLevel: string
  count: number
}

export function EnrollmentAnalytics() {
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
    <Card>
      <CardHeader>
        <CardTitle>Enrollment Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={enrollmentData}>
            <XAxis dataKey="gradeLevel" />
            <YAxis />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

