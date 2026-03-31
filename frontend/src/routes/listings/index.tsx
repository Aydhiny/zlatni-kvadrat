import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { useListings } from '@/hooks/useListings'
import { ListingGrid } from '@/components/listings/ListingGrid'
import { ListingFilters as FiltersPanel } from '@/components/listings/ListingFilters'
import type { ListingFilters } from '@/types'

const searchSchema = z.object({
  type: z.enum(['sale', 'rent']).optional(),
  property_type: z.enum(['apartment', 'house', 'commercial', 'land']).optional(),
  location: z.string().optional(),
  min_price: z.coerce.number().optional(),
  max_price: z.coerce.number().optional(),
})

export const Route = createFileRoute('/listings/')({
  validateSearch: (search) => searchSchema.parse(search),
  component: ListingsPage,
})

function ListingsPage() {
  const search = Route.useSearch()
  const derivedFilters = useMemo<ListingFilters>(() => ({
    page: 1,
    per_page: 12,
    type: search.type,
    property_type: search.property_type,
    location: search.location,
    min_price: search.min_price,
    max_price: search.max_price,
  }), [search])

  const [filters, setFilters] = useState<ListingFilters>(derivedFilters)

  useEffect(() => {
    setFilters(derivedFilters)
  }, [derivedFilters])

  const { data, isLoading } = useListings(filters)
  const listings = data?.data ?? []
  const meta = data?.meta

  return (
    <div>
      <section className="bg-[#0b1220] text-white">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <p className="text-gold text-sm tracking-widest uppercase mb-2">All Properties</p>
          <h1 className="font-serif text-4xl md:text-5xl">Browse Listings</h1>
          <p className="text-white/70 mt-3 max-w-2xl">
            Explore vetted listings across the Balkans with verified documentation and advisor support.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
            <FiltersPanel filters={filters} onChange={setFilters} />
          </aside>
          <div className="lg:col-span-3">
            <ListingGrid listings={listings} isLoading={isLoading} />
            {meta && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2">
                <button
                  disabled={filters.page === 1}
                  onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
                  className="px-4 py-2 text-sm border border-border rounded-md disabled:opacity-40 hover:border-gold transition-colors"
                >Previous</button>
                <span className="px-4 py-2 text-sm text-muted">
                  Page {filters.page} of {Math.ceil(meta.total / meta.per_page)}
                </span>
                <button
                  disabled={(filters.page ?? 1) * meta.per_page >= meta.total}
                  onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
                  className="px-4 py-2 text-sm border border-border rounded-md disabled:opacity-40 hover:border-gold transition-colors"
                >Next</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
