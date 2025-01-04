import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'
import { uploadFile, deleteFile } from '@/lib/r2'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const settings = await prisma.schoolSettings.findFirst()
    return NextResponse.json(settings, { status: 200 })
  } catch (error) {
    console.error('Error in get-school-settings:', error)
    return NextResponse.json({ message: 'An error occurred while fetching school settings' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const schoolName = formData.get('schoolName') as string
    const offerChoices = formData.get('offerChoices') as string
    const requirements = formData.get('requirements') as string
    const schoolLogo = formData.get('schoolLogo') as File

    let logoFileName = ''
    if (schoolLogo) {
      const buffer = Buffer.from(await schoolLogo.arrayBuffer())
      logoFileName = `school-logo-${Date.now()}-${schoolLogo.name}`
      await uploadFile(buffer, logoFileName, schoolLogo.type)

      // Delete the old logo if it exists
      const currentSettings = await prisma.schoolSettings.findFirst()
      if (currentSettings?.logoFileName) {
        await deleteFile(currentSettings.logoFileName)
      }
    }

    const updatedSettings = await prisma.schoolSettings.upsert({
      where: { id: 1 },
      update: {
        schoolName,
        offerChoices: offerChoices.split('\n'),
        requirements: requirements.split('\n'),
        ...(logoFileName && { logoFileName }),
      },
      create: {
        schoolName,
        offerChoices: offerChoices.split('\n'),
        requirements: requirements.split('\n'),
        logoFileName,
      },
    })

    return NextResponse.json(updatedSettings, { status: 200 })
  } catch (error) {
    console.error('Error in update-school-settings:', error)
    return NextResponse.json({ message: 'An error occurred while updating school settings' }, { status: 500 })
  }
}

