import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Do nothing while loading

    if (session) {
      // User is authenticated
      if (router.pathname.startsWith('/auth')) {
        router.push('/dashboard') // Redirect to dashboard if trying to access auth pages
      }
    } else {
      // User is not authenticated
      if (!router.pathname.startsWith('/auth') && router.pathname !== '/') {
        router.push('/auth/signin') // Redirect to signin for protected routes
      }
    }
  }, [session, status, router])

  // If the user is an admin, set a cookie to log them out when the browser is closed
  useEffect(() => {
    if (session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN') {
      document.cookie = 'adminSession=true; path=/; max-age=0; secure; samesite=strict'
    }
  }, [session])

  return <>{children}</>
}

export default AuthWrapper

