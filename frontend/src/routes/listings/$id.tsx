import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, MapPin, Maximize2, Bed, Bath } from 'lucide-react'
import { useListing } from '@/hooks/useListings'
import { InquiryModal } from '@/components/inquiry/InquiryModal'
import { formatPrice, formatDate, getListingImage } from '@/lib/utils'

export const Route = createFileRoute('/listings/$id')({
  component: ListingDetailPage,
})

function ListingDetailPage() {
  const { id } = Route.useParams()
  const { data, isLoading } = useListing(id)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const listing = data?.data

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-96 bg-gray-100 rounded-lg" />
          <div className="h-8 bg-gray-100 rounded w-2/3" />
          <div className="h-4 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h1 className="font-serif text-3xl text-foreground mb-4">Listing Not Found</h1>
        <Link to="/listings" className="text-gold hover:underline">Back to listings</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link to="/listings" className="inline-flex items-center gap-2 text-muted text-sm hover:text-gold transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />Back to listings
      </Link>

      <div className="rounded-xl overflow-hidden mb-8 aspect-video bg-gray-100">
        <img src={getListingImage(listing.images)} alt={listing.title} className="w-full h-full object-cover" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gold/10 text-gold capitalize">{listing.type}</span>
              <span className="text-xs text-muted capitalize">{listing.property_type?.replace('_', ' ')}</span>
            </div>
            <h1 className="font-serif text-4xl text-foreground mb-3">{listing.title}</h1>
            {listing.location && (
              <div className="flex items-center gap-1.5 text-muted text-sm">
                <MapPin className="w-4 h-4" />{listing.location}
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 py-4 border-y border-border">
            {listing.area > 0 && <div className="flex items-center gap-1.5 text-sm"><Maximize2 className="w-4 h-4 text-gold" /><span>{listing.area} m²</span></div>}
            {listing.bedrooms > 0 && <div className="flex items-center gap-1.5 text-sm"><Bed className="w-4 h-4 text-gold" /><span>{listing.bedrooms} beds</span></div>}
            {listing.bathrooms > 0 && <div className="flex items-center gap-1.5 text-sm"><Bath className="w-4 h-4 text-gold" /><span>{listing.bathrooms} baths</span></div>}
          </div>

          {listing.description && (
            <div>
              <h2 className="font-semibold text-foreground mb-3">Description</h2>
              <p className="text-muted leading-relaxed whitespace-pre-line">{listing.description}</p>
            </div>
          )}
          <p className="text-xs text-muted">Listed {formatDate(listing.created_at)}</p>
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-6 bg-card border border-border rounded-xl p-6 shadow-card">
            <div className="mb-6">
              <p className="text-muted text-xs mb-1">{listing.type === 'rent' ? 'Monthly Rent' : 'Sale Price'}</p>
              <p className="font-serif text-3xl text-foreground">
                {formatPrice(listing.price, listing.currency)}
                {listing.type === 'rent' && <span className="text-lg text-muted font-sans">/mo</span>}
              </p>
            </div>
            <button
              onClick={() => setInquiryOpen(true)}
              className="w-full py-3 px-4 bg-gold text-white rounded-lg font-medium text-sm hover:bg-gold-dark transition-colors"
            >
              Request Information
            </button>
            {listing.address && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted">{listing.address}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <InquiryModal
        listingId={listing.id}
        listingTitle={listing.title}
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
      />
    </div>
  )
}
