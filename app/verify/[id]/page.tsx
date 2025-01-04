import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const prisma = new PrismaClient()

async function getApplicationDetails(id: string) {
  const application = await prisma.application.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!application) {
    notFound()
  }

  return application
}

export default async function VerificationPage({ params }: { params: { id: string } }) {
  const application = await getApplicationDetails(params.id)

  return (
    <div className="container mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <h3 className="font-semibold">Status</h3>
              <p className="text-green-600 font-bold">Verified</p>
            </div>
            <div>
              <h3 className="font-semibold">Student Name</h3>
              <p>{application.user.firstName} {application.user.lastName}</p>
            </div>
            <div>
              <h3 className="font-semibold">Grade Level</h3>
              <p>{application.gradeLevel}</p>
            </div>
            <div>
              <h3 className="font-semibold">Application ID</h3>
              <p>{application.id}</p>
            </div>
            <div>
              <h3 className="font-semibold">Application Status</h3>
              <p>{application.status}</p>
            </div>
            <div>
              <h3 className="font-semibold">Application Date</h3>
              <p>{new Date(application.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

