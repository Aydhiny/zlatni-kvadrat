import { redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/authStore'

/**
 * adminGuard — TanStack Router beforeLoad guard for admin routes.
 * Redirects to /login if the user is not authenticated or token is expired.
 */
export function adminGuard() {
  const { isAuthenticated, isTokenExpired } = useAuthStore.getState()
  if (!isAuthenticated || isTokenExpired()) {
    throw redirect({ to: '/login' })
  }
}
