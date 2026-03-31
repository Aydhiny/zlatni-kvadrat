import { Link, useRouterState } from '@tanstack/react-router'
import { ArrowLeft, Plus } from 'lucide-react'

const sectionLabels: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/listings': 'Listings',
  '/admin/listings/new': 'New Listing',
  '/admin/inquiries': 'Inquiries',
}

function getLabel(pathname: string): string {
  // Check exact match first, then prefix match for edit routes
  if (sectionLabels[pathname]) return sectionLabels[pathname]
  if (pathname.includes('/edit')) return 'Edit Listing'
  return 'Admin'
}

export function AdminTopBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const label = getLabel(pathname.replace(/\/$/, ''))

  const isListingsNew = pathname.includes('/listings/new')
  const isListingsIndex = pathname.replace(/\/$/, '') === '/admin/listings'
  const isDashboard = pathname.replace(/\/$/, '') === '/admin'

  return (
    <div
      className="shrink-0 h-14 px-6 flex items-center justify-between border-b"
      style={{ backgroundColor: '#ffffff', borderColor: '#e2d9cc' }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          to="/"
          className="flex items-center gap-1.5 font-medium transition-colors"
          style={{ color: '#6b7280' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#b5472a')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to site
        </Link>
        <span style={{ color: '#e2d9cc' }}>/</span>
        <span style={{ color: '#1c1410', fontWeight: 500 }}>{label}</span>
      </div>

      {/* Contextual quick actions */}
      <div className="flex items-center gap-3">
        {(isDashboard || isListingsIndex) && (
          <Link
            to="/admin/listings/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: '#b5472a' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#943b22')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#b5472a')}
          >
            <Plus className="w-3.5 h-3.5" />
            New Listing
          </Link>
        )}
        {isListingsNew && (
          <Link
            to="/admin/listings"
            className="text-sm transition-colors"
            style={{ color: '#6b7280' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#1c1410')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
          >
            ← All Listings
          </Link>
        )}
      </div>
    </div>
  )
}
