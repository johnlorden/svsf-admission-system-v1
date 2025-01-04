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

    const { searchParams } = new URL(req.url)
    const applicationId = searchParams.get('applicationId')

    if (!applicationId) {
      return NextResponse.json({ message: 'Application ID is required' }, { status: 400 })
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { user: true },
    })

    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 })
    }

    return NextResponse.json({
      status: application.status,
      studentName: `${application.user.firstName} ${application.user.lastName}`,
      gradeLevel: application.gradeLevel,
      createdAt: application.createdAt,
    }, { status: 200 })

  } catch (error) {
    console.error('Error verifying enrollment slip:', error)
    return NextResponse.json({ message: 'An error occurred while verifying the enrollment slip' }, { status: 500 })
  }
}

