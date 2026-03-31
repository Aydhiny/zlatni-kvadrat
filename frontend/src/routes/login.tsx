import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-foreground mb-2">Admin Login</h1>
          <p className="text-muted text-sm">Zlatni Kvadrat Management Panel</p>
        </div>
        <div className="bg-card rounded-lg border border-border shadow-card p-8">
          <form onSubmit={handleSubmit((data) => login(data))} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
              <input
                type="email"
                {...register('email')}
                placeholder="admin@example.com"
                className={cn(
                  'w-full px-4 py-2.5 rounded-md border bg-white text-foreground text-sm placeholder:text-muted/70',
                  'focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors',
                  errors.email ? 'border-red-400' : 'border-border',
                )}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Password"
                  className={cn(
                    'w-full px-4 py-2.5 rounded-md border bg-white text-foreground text-sm placeholder:text-muted/70 pr-10',
                    'focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors',
                    errors.password ? 'border-red-400' : 'border-border',
                  )}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-md">
                Invalid credentials. Please try again.
              </div>
            )}
            <button
              type="submit"
              disabled={isLoggingIn}
              className={cn(
                'w-full py-2.5 px-4 rounded-md font-medium text-sm',
                'bg-gold text-white hover:bg-gold-dark transition-colors disabled:opacity-50',
              )}
            >
              {isLoggingIn ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
