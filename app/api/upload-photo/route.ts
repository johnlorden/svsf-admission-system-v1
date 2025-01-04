import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'
import { uploadFile, getFileUrl } from '@/lib/r2'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('photo') as File
    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${session.user.id}-${Date.now()}-${file.name}`
    await uploadFile(buffer, fileName, file.type)

    const photoUrl = await getFileUrl(fileName)

    // Update user's profile photo in the database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: fileName }, // Store the file name instead of the full URL
    })

    return NextResponse.json({ photoUrl }, { status: 200 })
  } catch (error) {
    console.error('Error in upload-photo:', error)
    return NextResponse.json({ message: 'An error occurred while uploading the photo' }, { status: 500 })
  }
}

