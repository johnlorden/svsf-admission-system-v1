import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { slug, verificationCode } = await req.json();
    const [lastName, applicationId] = slug.split('-');

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { user: true },
    });

    if (!application || application.user.lastName.toLowerCase() !== lastName || application.verificationCode !== verificationCode) {
      return NextResponse.json({ message: 'Invalid verification code' }, { status: 400 });
    }

    return NextResponse.json({ application }, { status: 200 });
  } catch (error) {
    console.error('Error verifying application:', error);
    return NextResponse.json({ message: 'An error occurred while verifying the application' }, { status: 500 });
  }
}

