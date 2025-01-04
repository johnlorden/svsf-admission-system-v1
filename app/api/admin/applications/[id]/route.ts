import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'
import { sendApplicationApproved, sendApplicationRejected } from '@/lib/email'

// Updated import statement
import { prisma } from '@/lib/prisma'

//const prisma = new PrismaClient() // Removed as prisma is now imported from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { status, note } = await req.json()

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status, rejectionReason: note },
      include: { user: true },
    })

    // Send email based on the new status
    if (status === 'APPROVED') {
      await sendApplicationApproved(
        updatedApplication.user.email,
        updatedApplication.user.name,
        updatedApplication.gradeLevel,
        updatedApplication.strand
      )
    } else if (status === 'REJECTED') {
      await sendApplicationRejected(
        updatedApplication.user.email,
        updatedApplication.user.name,
        note
      )
    }

    return NextResponse.json({ application: updatedApplication }, { status: 200 })
  } catch (error) {
    console.error('Error in update-application-status:', error)
    return NextResponse.json({ message: 'An error occurred while updating application status' }, { status: 500 })
  }
}

