import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const enrollmentData = await prisma.application.groupBy({
      by: ['gradeLevel'],
      _count: {
        _all: true,
      },
    })

    const formattedData = enrollmentData.map(item => ({
      gradeLevel: item.gradeLevel,
      count: item._count._all,
    }))

    return NextResponse.json({ enrollmentData: formattedData }, { status: 200 })
  } catch (error) {
    console.error('Error in enrollment-analytics:', error)
    return NextResponse.json({ message: 'An error occurred while fetching enrollment data' }, { status: 500 })
  }
}

