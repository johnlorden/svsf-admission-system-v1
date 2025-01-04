'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const prisma = new PrismaClient();

async function getApplicationDetails(slug: string) {
  const [lastName, applicationId] = slug.split('-');
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { user: true },
  });

  if (!application || application.user.lastName.toLowerCase() !== lastName) {
    return null;
  }

  return application;
}

export default function VerificationPage({ params }: { params: { slug: string } }) {
  const [verificationCode, setVerificationCode] = useState('');
  const [application, setApplication] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleVerify = async () => {
    const response = await fetch(`/api/verify-application`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: params.slug, verificationCode }),
    });

    if (response.ok) {
      const data = await response.json();
      setApplication(data.application);
      setError('');
    } else {
      setError('Invalid verification code');
    }
  };

  if (application) {
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
    );
  }

  return (
    <div className="container mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Verify Enrollment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button onClick={handleVerify}>Verify</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

