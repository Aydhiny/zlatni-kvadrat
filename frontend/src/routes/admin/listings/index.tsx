import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Pencil, Trash2 } from 'lucide-react'
import { useListings, useDeleteListing } from '@/hooks/useListings'
import { formatPrice } from '@/lib/utils'
import { ConfirmModal } from '@/components/ui/ConfirmModal'

export const Route = createFileRoute('/admin/listings/')({
  component: AdminListingsPage,
})

function AdminListingsPage() {
  const { data, isLoading } = useListings({ per_page: 50 })
  const deleteMutation = useDeleteListing()
  const listings = data?.data ?? []

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => toast.success(`"${deleteTarget.title}" was deleted.`),
      onError: () => toast.error('Failed to delete listing. Please try again.'),
      onSettled: () => setDeleteTarget(null),
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-foreground mb-1">Listings</h1>
        <p className="text-muted text-sm">{data?.meta?.total ?? 0} total properties</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted-bg/60">
                  <th className="text-left px-4 py-3 text-muted font-medium">Title</th>
                  <th className="text-left px-4 py-3 text-muted font-medium">Type</th>
                  <th className="text-left px-4 py-3 text-muted font-medium">Price</th>
                  <th className="text-left px-4 py-3 text-muted font-medium">Location</th>
                  <th className="text-left px-4 py-3 text-muted font-medium">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-b border-border last:border-0 hover:bg-muted-bg/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground max-w-[220px] truncate">{listing.title}</td>
                    <td className="px-4 py-3 capitalize text-muted">{listing.type}</td>
                    <td className="px-4 py-3 text-foreground whitespace-nowrap">{formatPrice(listing.price, listing.currency)}</td>
                    <td className="px-4 py-3 text-muted">{listing.location || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${listing.is_available ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {listing.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to="/admin/listings/$id/edit"
                          params={{ id: listing.id }}
                          className="p-2 rounded-lg text-muted hover:text-gold hover:bg-muted-bg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget({ id: listing.id, title: listing.title })}
                          className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {listings.length === 0 && (
            <div className="text-center py-12 text-muted">
              No listings yet.{' '}
              <Link to="/admin/listings/new" className="text-gold hover:underline">Create your first listing.</Link>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete listing?"
        message={`"${deleteTarget?.title}" will be permanently removed. This cannot be undone.`}
        confirmLabel={deleteMutation.isPending ? 'Deleting…' : 'Yes, delete'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
