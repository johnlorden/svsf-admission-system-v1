import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'
import PDFDocument from 'pdfkit'
import QRCode from 'qrcode'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const applicationId = searchParams.get('applicationId')

  if (!applicationId) {
    return NextResponse.json({ message: 'Application ID is required' }, { status: 400 })
  }

  try {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { user: true },
    })

    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 })
    }

    if (application.status !== 'APPROVED') {
      return NextResponse.json({ message: 'Application must be approved to generate enrollment slip' }, { status: 403 })
    }

    const doc = new PDFDocument()
    const chunks: Uint8Array[] = []

    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => {
      const result = Buffer.concat(chunks)
      const res = new NextResponse(result)
      res.headers.set('Content-Type', 'application/pdf')
      res.headers.set('Content-Disposition', `attachment; filename=${application.user.lastName}-${application.user.firstName}-${application.id}.pdf`)
      return res
    })

    // Add school logo
    doc.image('public/school-logo.png', 50, 50, { width: 50 })

    // Add school information
    doc.fontSize(18).text('St. Vincent School Foundation, Inc.', 110, 50)
    doc.fontSize(12).text('123 School Street, City, Philippines', 110, 70)

    doc.moveDown()
    doc.fontSize(16).text('Enrollment Slip', { align: 'center' })
    doc.moveDown()

    // Add student information
    doc.fontSize(12).text(`Name: ${application.user.firstName} ${application.user.lastName}`)
    doc.text(`Grade Level: ${application.gradeLevel}`)
    doc.text(`Application ID: ${application.id}`)
    doc.text(`Status: ${application.status}`)

    // Add QR code
    const qrCodeData = await QRCode.toDataURL(`https://your-domain.com/verify/${application.id}`)
    doc.image(qrCodeData, 450, 50, { width: 100 })

    doc.moveDown()
    doc.fontSize(10).text('This is an auto-generated enrollment slip.', { align: 'center' })

    doc.end()

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error('Error generating enrollment slip:', error)
    return NextResponse.json({ message: 'Error generating enrollment slip' }, { status: 500 })
  }
}

