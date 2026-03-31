import { createRootRouteWithContext, Outlet, useRouterState, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { AdminTopBar } from '@/components/layout/AdminTopBar'
import { AIChatbot } from '@/components/AIChatbot'
import { useAuthStore } from '@/store/authStore'

export interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

/**
 * AdminShell — isolated app-shell for all /admin/* routes.
 *
 * Why here and not in admin/_layout.tsx:
 * routeTree.gen.ts places ALL admin pages as flat children of root
 * (parentRoute: rootRoute), so _layout.tsx's component never wraps them.
 * This is the only reliable place to inject the shared admin layout.
 */
function AdminShell() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isTokenExpired = useAuthStore((s) => s.isTokenExpired)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated || isTokenExpired()) {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, isTokenExpired, navigate])

  if (!isAuthenticated || isTokenExpired()) return null

  return (
    // "App shell" pattern: h-screen + overflow-hidden keeps the sidebar pinned
    // while only the inner content column scrolls.
    <div className="h-screen overflow-hidden flex" style={{ backgroundColor: '#f8f5f0' }}>
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <AdminTopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

function RootLayout() {
  const isAdmin = useRouterState({
    select: (s) => s.location.pathname.startsWith('/admin'),
  })

  return (
    <>
      {/* Single Toaster instance for the whole app */}
      <Toaster position="bottom-right" richColors closeButton />

      {isAdmin ? (
        <>
          <AdminShell />
          {import.meta.env.DEV && <TanStackRouterDevtools />}
        </>
      ) : (
        <>
          <Header />
          <main className="min-h-screen pt-16">
            <Outlet />
          </main>
          <Footer />
          <AIChatbot />
          {import.meta.env.DEV && <TanStackRouterDevtools />}
        </>
      )}
    </>
  )
}
