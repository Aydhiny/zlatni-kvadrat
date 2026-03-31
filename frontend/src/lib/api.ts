import ky, { type KyInstance } from 'ky'
import { useAuthStore } from '@/store/authStore'

/**
 * Configured ky instance for all API calls.
 * Automatically injects the Authorization header and handles 401 responses.
 * Never use raw fetch — always use this instance.
 */
export const api: KyInstance = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1',
  timeout: 30_000,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = useAuthStore.getState().accessToken
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          useAuthStore.getState().clearAuth()
        }
        return response
      },
    ],
  },
})
