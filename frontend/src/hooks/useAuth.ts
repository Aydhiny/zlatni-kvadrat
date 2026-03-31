import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { ApiResponse, AuthTokens } from '@/types'

interface LoginCredentials {
  email: string
  password: string
}

/**
 * useAuth — hook for authentication actions.
 * Server state (tokens) lives in Zustand with localStorage persistence.
 */
export function useAuth() {
  const { setAuth, clearAuth, isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await api.post('auth/login', { json: credentials })
      return res.json<ApiResponse<AuthTokens>>()
    },
    onSuccess: (data) => {
      setAuth(data.data)
      navigate({ to: '/admin' })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post('auth/logout')
    },
    onSettled: () => {
      clearAuth()
      navigate({ to: '/login' })
    },
  })

  return {
    isAuthenticated,
    user,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
  }
}
