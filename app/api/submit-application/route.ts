import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const applicationData = await req.json()

    const application = await prisma.application.create({
      data: {
        userId: session.user.id,
        ...applicationData,
        status: 'PENDING',
      },
    })

    // Send email notification
    await sendEmailNotification(session.user.email, 'Application Submitted', 'Your application has been submitted successfully.')

    return NextResponse.json({ message: 'Application submitted successfully', application }, { status: 201 })
  } catch (error) {
    console.error('Error in submit-application:', error)
    return NextResponse.json({ message: 'An error occurred while submitting the application' }, { status: 500 })
  }
}

async function sendEmailNotification(email: string, subject: string, message: string) {
  // Implement email sending logic here
  console.log(`Sending email to ${email}: ${subject} - ${message}`)
}

