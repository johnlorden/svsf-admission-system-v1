import { PrismaClient } from '@prisma/client'
import { sendEmail } from './email'

const prisma = new PrismaClient()

export async function sendIncompleteApplicationReminders() {
  const incompleteApplications = await prisma.application.findMany({
    where: {
      status: 'INCOMPLETE',
      updatedAt: {
        lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      }
    },
    include: {
      user: true
    }
  })

  for (const application of incompleteApplications) {
    await sendEmail(
      application.user.email,
      'Complete Your SVSFI Enrollment Application',
      'incompleteApplicationReminder',
      {
        studentName: application.user.name,
        applicationId: application.id
      }
    )
  }
}

