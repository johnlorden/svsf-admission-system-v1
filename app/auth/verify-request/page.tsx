import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function VerifyRequest() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>A sign in link has been sent to your email address.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>If you don't see it, check your spam folder.</p>
        </CardContent>
      </Card>
    </div>
  )
}

