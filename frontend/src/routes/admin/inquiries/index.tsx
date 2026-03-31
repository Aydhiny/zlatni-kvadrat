import { createFileRoute } from '@tanstack/react-router'
import { MailOpen, Mail } from 'lucide-react'
import { useInquiries, useMarkInquiryRead } from '@/hooks/useInquiry'
import { formatDate } from '@/lib/utils'

export const Route = createFileRoute('/admin/inquiries/')({
  component: AdminInquiriesPage,
})

function AdminInquiriesPage() {
  const { data, isLoading } = useInquiries()
  const markReadMutation = useMarkInquiryRead()
  const inquiries = data?.data ?? []
  const unread = inquiries.filter((i) => !i.is_read).length

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-foreground mb-1">Inquiries</h1>
        <p className="text-muted text-sm">{unread > 0 ? `${unread} unread` : 'All caught up'}</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className={`bg-card border rounded-xl p-5 shadow-card ${inquiry.is_read ? 'border-border' : 'border-gold/30 bg-gold/5'}`}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {inquiry.is_read ? <MailOpen className="w-4 h-4 text-muted flex-shrink-0" /> : <Mail className="w-4 h-4 text-gold flex-shrink-0" />}
                    <span className="font-medium text-foreground text-sm">{inquiry.name}</span>
                    <span className="text-muted text-sm">·</span>
                    <span className="text-muted text-sm break-all">{inquiry.email}</span>
                    {inquiry.phone && <><span className="text-muted text-sm">·</span><span className="text-muted text-sm">{inquiry.phone}</span></>}
                  </div>
                  {inquiry.message && <p className="text-muted text-sm leading-relaxed">{inquiry.message}</p>}
                  <p className="text-xs text-muted mt-2">{formatDate(inquiry.created_at)}</p>
                </div>
                {!inquiry.is_read && (
                  <button onClick={() => markReadMutation.mutate(inquiry.id)} className="text-xs text-gold hover:underline flex-shrink-0">
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
          {inquiries.length === 0 && <div className="text-center py-12 text-muted">No inquiries yet.</div>}
        </div>
      )}
    </div>
  )
}
