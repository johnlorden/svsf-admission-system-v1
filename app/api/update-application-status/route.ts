import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function POST(req: Request) {
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

