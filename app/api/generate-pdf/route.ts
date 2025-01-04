import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'
import PDFDocument from 'pdfkit'
import QRCode from 'qrcode'
import crypto from 'crypto';

const prisma = new PrismaClient()

function generateVerificationCode() {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
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

    const verificationCode = generateVerificationCode();

    const doc = new PDFDocument()
    const chunks: Uint8Array[] = []

    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', async () => {
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

    // Generate QR code with verification link
    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verification/${application.user.lastName.toLowerCase()}-${application.id}`
    const qrCodeData = await QRCode.toDataURL(verificationLink)
    doc.image(qrCodeData, 450, 50, { width: 100 })
    doc.fontSize(10).text('Scan to verify', 450, 155, { width: 100, align: 'center' })

    doc.fontSize(10).text(`Verification Code: ${verificationCode}`, 450, 170, { width: 100, align: 'center' });

    doc.moveDown()
    doc.fontSize(10).text('This is an auto-generated enrollment slip.', { align: 'center' })

    await prisma.application.update({
      where: { id: application.id },
      data: { verificationCode },
    });

    doc.end()

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json({ message: 'An error occurred while generating the PDF' }, { status: 500 })
  }
}

