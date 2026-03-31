import { Link, useRouterState } from '@tanstack/react-router'
import { LayoutDashboard, Home, Mail, LogOut, Globe, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useSidebarStore } from '@/store/sidebarStore'
import { cn } from '@/lib/utils'

type NavItem = {
  to: '/admin' | '/admin/listings' | '/admin/inquiries'
  icon: LucideIcon
  label: string
  exact?: boolean
}

const navItems: NavItem[] = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/listings', icon: Home, label: 'Listings' },
  { to: '/admin/inquiries', icon: Mail, label: 'Inquiries' },
]

const BRAND = '#b5472a'
const BG = '#0f172a'

export function AdminSidebar() {
  const { logout } = useAuth()
  const { collapsed, toggle } = useSidebarStore()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <aside
      className={cn(
        'shrink-0 flex flex-col overflow-y-auto overflow-x-hidden transition-all duration-200',
        collapsed ? 'w-16' : 'w-64',
      )}
      style={{ backgroundColor: BG, color: 'white' }}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center border-b border-white/10 transition-all duration-200',
          collapsed ? 'h-14 justify-center px-0' : 'h-14 px-5 justify-between',
        )}
      >
        {!collapsed && (
          <Link to="/" className="flex items-center min-w-0">
            <span className="font-serif text-base text-white whitespace-nowrap">
              Zlatni <span style={{ color: BRAND }}>Kvadrat</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <span className="font-serif text-base font-bold" style={{ color: BRAND }}>Z</span>
        )}
        <button
          onClick={toggle}
          className={cn(
            'flex items-center justify-center w-6 h-6 rounded-md transition-colors hover:bg-white/10 text-white/50 hover:text-white shrink-0',
            collapsed && 'hidden',
          )}
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className={cn('flex-1 py-4 space-y-0.5', collapsed ? 'px-2' : 'px-3')}>
        {navItems.map((item) => {
          const isActive = item.exact === true
            ? pathname.replace(/\/$/, '') === item.to
            : pathname.startsWith(item.to) && !(item.to === '/admin' && pathname.length > 7)

          return (
            <Link
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center rounded-lg text-sm transition-colors',
                collapsed ? 'justify-center h-10 w-10 mx-auto' : 'gap-3 px-3 py-2.5',
                isActive
                  ? 'bg-white/12 text-white'
                  : 'text-white/55 hover:text-white hover:bg-white/8',
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className={cn('py-4 border-t border-white/10 space-y-0.5', collapsed ? 'px-2' : 'px-3')}>
        {/* Expand button when collapsed */}
        {collapsed && (
          <button
            onClick={toggle}
            className="flex items-center justify-center h-10 w-10 mx-auto rounded-lg text-white/55 hover:text-white hover:bg-white/8 transition-colors"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        <Link
          to="/"
          title={collapsed ? 'View site' : undefined}
          className={cn(
            'flex items-center rounded-lg text-sm text-white/55 hover:text-white hover:bg-white/8 transition-colors',
            collapsed ? 'justify-center h-10 w-10 mx-auto' : 'gap-3 px-3 py-2.5 w-full',
          )}
        >
          <Globe className="w-4 h-4 shrink-0" />
          {!collapsed && 'View Site'}
        </Link>
        <button
          onClick={() => logout()}
          title={collapsed ? 'Sign out' : undefined}
          className={cn(
            'flex items-center rounded-lg text-sm text-white/55 hover:text-white hover:bg-white/8 transition-colors',
            collapsed ? 'justify-center h-10 w-10 mx-auto' : 'gap-3 px-3 py-2.5 w-full',
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </aside>
  )
}
