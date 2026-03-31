import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { MapPin, Maximize2, Bed, Bath, Heart, BarChart2 } from 'lucide-react'
import type { Listing } from '@/types'
import { formatPrice, getListingImage } from '@/lib/utils'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useCompareStore } from '@/store/compareStore'

interface ListingCardProps {
  listing: Listing
}

const BRAND = '#b5472a'

export function ListingCard({ listing }: ListingCardProps) {
  const isFav = useFavoritesStore((s) => s.has(listing.id))
  const toggleFav = useFavoritesStore((s) => s.toggle)
  const isCompared = useCompareStore((s) => s.has(listing.id))
  const compareCount = useCompareStore((s) => s.items.length)
  const addCompare = useCompareStore((s) => s.add)
  const removeCompare = useCompareStore((s) => s.remove)

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFav(listing.id)
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isCompared) removeCompare(listing.id)
    else if (compareCount < 3) addCompare(listing)
  }

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
      <Link
        to="/listings/$id"
        params={{ id: listing.id }}
        className="group block bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-card-hover hover:border-gold/40 transition-all duration-200"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={getListingImage(listing.images)}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

          {/* Type / featured badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-foreground/85 text-white capitalize">
              {listing.type}
            </span>
            {listing.is_featured && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gold text-white">
                Featured
              </span>
            )}
          </div>

          {/* Heart */}
          <button
            onClick={handleFav}
            aria-label={isFav ? 'Remove from favourites' : 'Save to favourites'}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{
              backgroundColor: isFav ? BRAND : 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Heart
              className="w-4 h-4"
              fill={isFav ? 'white' : 'none'}
              stroke="white"
              strokeWidth={2}
            />
          </button>
        </div>

        {/* Card body */}
        <div className="p-4">
          <p className="text-xs text-muted uppercase tracking-widest mb-1">
            {listing.property_type?.replace('_', ' ')}
          </p>
          <h3 className="font-medium text-foreground text-base leading-snug mb-2 line-clamp-2">
            {listing.title}
          </h3>
          {listing.location && (
            <div className="flex items-center gap-1 text-muted text-xs mb-3">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{listing.location}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-xs text-muted mb-4">
            {listing.area > 0 && (
              <span className="flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5" />{listing.area} m²
              </span>
            )}
            {listing.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5" />{listing.bedrooms}
              </span>
            )}
            {listing.bathrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5" />{listing.bathrooms}
              </span>
            )}
          </div>

          {/* Price + compare */}
          <div className="flex items-center justify-between border-t border-border pt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-xl text-foreground">
                {formatPrice(listing.price, listing.currency)}
              </span>
              {listing.type === 'rent' && (
                <span className="text-xs text-muted">/month</span>
              )}
            </div>

            <button
              onClick={handleCompare}
              aria-label={isCompared ? 'Remove from comparison' : 'Add to comparison'}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all"
              style={{
                borderColor: isCompared ? BRAND : '#e2d9cc',
                color: isCompared ? BRAND : '#6b7280',
                backgroundColor: isCompared ? `${BRAND}10` : 'transparent',
              }}
            >
              <BarChart2 className="w-3 h-3" />
              {isCompared ? 'Added' : compareCount >= 3 ? 'Full' : 'Compare'}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
