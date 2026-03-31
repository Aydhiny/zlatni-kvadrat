import type { Listing } from '@/types'
import { ListingCard } from './ListingCard'

interface ListingGridProps {
  listings: Listing[]
  isLoading?: boolean
}

export function ListingGrid({ listings, isLoading = false }: ListingGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-border animate-pulse">
            <div className="aspect-[4/3] bg-gray-100" />
            <div className="p-4 space-y-3">
              <div className="h-3 bg-gray-100 rounded w-1/3" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              <div className="h-6 bg-gray-100 rounded w-1/3 mt-4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-20 text-muted">
        <p className="text-lg mb-2">No properties found</p>
        <p className="text-sm">Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
