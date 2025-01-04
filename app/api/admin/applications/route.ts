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
    const status = searchParams.get('status')
    const gradeLevel = searchParams.get('gradeLevel')
    const strand = searchParams.get('strand')

    const applications = await prisma.application.findMany({
      where: {
        status: status !== 'ALL' ? status : undefined,
        gradeLevel: gradeLevel !== 'ALL' ? gradeLevel : undefined,
        strand: strand !== 'ALL' ? strand : undefined,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ applications }, { status: 200 })
  } catch (error) {
    console.error('Error in get-applications:', error)
    return NextResponse.json({ message: 'An error occurred while fetching applications' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { applicationId, status } = await req.json()

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    })

    return NextResponse.json({ application: updatedApplication }, { status: 200 })
  } catch (error) {
    console.error('Error in update-application-status:', error)
    return NextResponse.json({ message: 'An error occurred while updating application status' }, { status: 500 })
  }
}

