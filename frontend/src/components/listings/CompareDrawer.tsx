import { motion, AnimatePresence } from 'framer-motion'
import { X, BarChart2, ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useCompareStore } from '@/store/compareStore'
import { formatPrice, getListingImage } from '@/lib/utils'
import type { Listing } from '@/types'

const BRAND = '#b5472a'

const ROWS: { label: string; render: (l: Listing) => string }[] = [
  { label: 'Price',      render: (l) => formatPrice(l.price, l.currency) + (l.type === 'rent' ? '/mo' : '') },
  { label: 'Type',       render: (l) => l.type === 'sale' ? 'For Sale' : 'For Rent' },
  { label: 'Property',   render: (l) => l.property_type?.replace('_', ' ') ?? '—' },
  { label: 'Area',       render: (l) => l.area > 0 ? `${l.area} m²` : '—' },
  { label: 'Bedrooms',   render: (l) => l.bedrooms > 0 ? String(l.bedrooms) : '—' },
  { label: 'Bathrooms',  render: (l) => l.bathrooms > 0 ? String(l.bathrooms) : '—' },
  { label: 'Location',   render: (l) => l.location || '—' },
]

export function CompareDrawer() {
  const { items, open, setOpen, remove, clear } = useCompareStore()

  const hasItems = items.length > 0

  return (
    <>
      {/* Floating trigger bar — shown when items selected but drawer is closed */}
      <AnimatePresence>
        {hasItems && !open && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-5 py-3 rounded-2xl shadow-elevated cursor-pointer select-none"
            style={{ backgroundColor: '#1c1410', color: '#fff' }}
            onClick={() => setOpen(true)}
          >
            <BarChart2 className="w-4 h-4" style={{ color: BRAND }} />
            <span className="text-sm font-medium">
              Comparing <strong>{items.length}</strong> {items.length === 1 ? 'property' : 'properties'}
            </span>
            <span
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl"
              style={{ backgroundColor: BRAND }}
            >
              View <ArrowRight className="w-3 h-3" />
            </span>
            <button
              className="ml-1 w-6 h-6 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); clear() }}
              aria-label="Clear comparison"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-50"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
              style={{ backgroundColor: '#f8f5f0', maxHeight: '85vh' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-4 border-b"
                style={{ borderColor: '#e2d9cc' }}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart2 className="w-4 h-4" style={{ color: BRAND }} />
                  <span className="font-semibold text-foreground text-sm">Property Comparison</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: BRAND }}
                  >
                    {items.length}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={clear}
                    className="text-xs text-muted hover:text-foreground transition-colors"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors hover:bg-muted-bg"
                    style={{ borderColor: '#e2d9cc' }}
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 65px)' }}>
                <div className="px-6 py-4 overflow-x-auto">
                  <table className="w-full min-w-[480px]">
                    <thead>
                      <tr>
                        {/* Label col */}
                        <th className="text-left py-2 pr-4 w-28" />
                        {items.map((l) => (
                          <th key={l.id} className="pb-4 px-3 text-left align-top">
                            <div className="relative">
                              <button
                                onClick={() => remove(l.id)}
                                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-foreground/20 transition-colors"
                                aria-label="Remove"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              <div className="rounded-xl overflow-hidden aspect-[4/3] mb-2">
                                <img
                                  src={getListingImage(l.images)}
                                  alt={l.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <Link
                                to="/listings/$id"
                                params={{ id: l.id }}
                                onClick={() => setOpen(false)}
                                className="text-sm font-medium text-foreground leading-snug hover:underline line-clamp-2"
                              >
                                {l.title}
                              </Link>
                            </div>
                          </th>
                        ))}
                        {/* Empty slot columns */}
                        {Array.from({ length: 3 - items.length }).map((_, i) => (
                          <th key={`empty-${i}`} className="px-3">
                            <div
                              className="rounded-xl aspect-[4/3] flex items-center justify-center text-xs text-muted border-2 border-dashed"
                              style={{ borderColor: '#e2d9cc' }}
                            >
                              Add property
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ROWS.map((row, ri) => (
                        <tr
                          key={row.label}
                          style={{ backgroundColor: ri % 2 === 0 ? '#f3ede4' : 'transparent' }}
                        >
                          <td className="py-3 pr-4 text-xs font-medium text-muted whitespace-nowrap">
                            {row.label}
                          </td>
                          {items.map((l) => (
                            <td key={l.id} className="py-3 px-3 text-sm text-foreground capitalize">
                              {row.render(l)}
                            </td>
                          ))}
                          {Array.from({ length: 3 - items.length }).map((_, i) => (
                            <td key={`empty-${i}`} className="py-3 px-3 text-sm text-muted/40">—</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
