import { createFileRoute, Link } from '@tanstack/react-router'
import { useListings } from '@/hooks/useListings'
import { useInquiries } from '@/hooks/useInquiry'
import { formatDate } from '@/lib/utils'
import { LayoutDashboard, Home, Mail, TrendingUp, ArrowUpRight } from 'lucide-react'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboardPage,
})

function AdminDashboardPage() {
  const { data: listingsData } = useListings({ per_page: 100 })
  const { data: inquiriesData } = useInquiries()

  const listings = listingsData?.data ?? []
  const inquiries = inquiriesData?.data ?? []

  const totalListings = listingsData?.meta?.total ?? 0
  const unreadInquiries = inquiries.filter((i) => !i.is_read).length
  const featuredCount = listings.filter((l) => l.is_featured).length
  const availableCount = listings.filter((l) => l.is_available).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-foreground mb-1">Dashboard</h1>
        <p className="text-muted text-sm">Overview of your platform activity and pending actions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: Home, label: 'Total Listings', value: totalListings },
          { icon: Mail, label: 'Unread Inquiries', value: unreadInquiries },
          { icon: TrendingUp, label: 'Featured', value: featuredCount },
          { icon: LayoutDashboard, label: 'Available', value: availableCount },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted text-sm">{stat.label}</span>
              <stat.icon className="w-5 h-5 text-gold" />
            </div>
            <div className="font-serif text-3xl text-foreground">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent inquiries</h2>
            <Link to="/admin/inquiries" className="text-sm text-gold hover:text-gold-dark inline-flex items-center gap-1">
              View all <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          {inquiries.length === 0 ? (
            <div className="text-sm text-muted">No inquiries yet. New leads will appear here.</div>
          ) : (
            <div className="space-y-4">
              {inquiries.slice(0, 5).map((inquiry) => (
                <div key={inquiry.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-border/70 rounded-xl p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{inquiry.name}</p>
                    <p className="text-xs text-muted">{inquiry.email} • {inquiry.phone || 'No phone'}</p>
                    <p className="text-xs text-muted mt-1">Received {formatDate(inquiry.created_at)}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${inquiry.is_read ? 'bg-muted-bg text-muted' : 'bg-gold/10 text-gold'}`}>
                    {inquiry.is_read ? 'Read' : 'New'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
            <h2 className="font-semibold text-foreground mb-2">Next actions</h2>
            <ul className="text-sm text-muted space-y-2">
              <li>Review unread inquiries and reply within 24 hours.</li>
              <li>Refresh featured listings for the homepage.</li>
              <li>Verify pricing and availability for new uploads.</li>
            </ul>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
            <h2 className="font-semibold text-foreground mb-2">Quick links</h2>
            <div className="flex flex-col gap-2">
              <Link to="/admin/listings" className="text-sm text-foreground hover:text-gold transition-colors">Manage listings</Link>
              <Link to="/admin/inquiries" className="text-sm text-foreground hover:text-gold transition-colors">Inbox inquiries</Link>
              <Link to="/" className="text-sm text-foreground hover:text-gold transition-colors">View public site</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
