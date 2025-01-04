import { useSession } from 'next-auth/react'
import { SuperAdminDashboard } from '@/components/SuperAdminDashboard'
import { AdminDashboard } from '@/components/AdminDashboard'
import { StudentDashboard } from '@/components/StudentDashboard'
import { EmailVerification } from '@/components/EmailVerification'
import { PasswordReset } from '@/components/PasswordReset'

export default function Dashboard() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>Access Denied</div>
  }

  if (session.user.role === 'SUPER_ADMIN') {
    return <SuperAdminDashboard />
  }

  if (session.user.role === 'ADMIN') {
    return <AdminDashboard />
  }

  return (
    <div className="space-y-8">
      <StudentDashboard />
      <EmailVerification />
      <PasswordReset />
    </div>
  )
}

