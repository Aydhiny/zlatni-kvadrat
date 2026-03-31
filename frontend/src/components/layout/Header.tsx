import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Heart, Menu, X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useFavoritesStore } from '@/store/favoritesStore'

type DesktopMenuItem = {
  label: string
  href: string
  description: string
}

type DesktopMenuGroup = {
  label: string
  items: DesktopMenuItem[]
}

const desktopGroups: DesktopMenuGroup[] = [
  {
    label: 'Buy',
    items: [
      { label: 'All Properties', href: '/listings?type=sale', description: 'Explore verified homes, villas, and investment opportunities.' },
      { label: 'Apartments', href: '/listings?type=sale&property_type=apartment', description: 'Urban apartments in prime neighborhoods.' },
      { label: 'Houses and Villas', href: '/listings?type=sale&property_type=house', description: 'Family homes and premium villa listings.' },
      { label: 'Commercial', href: '/listings?type=sale&property_type=commercial', description: 'Retail, office, and hospitality assets.' },
    ],
  },
  {
    label: 'Rent',
    items: [
      { label: 'All Rentals', href: '/listings?type=rent', description: 'Handpicked rentals with complete documentation.' },
      { label: 'Long-Term Homes', href: '/listings?type=rent&property_type=house', description: 'Comfortable long-stay homes for families.' },
      { label: 'City Apartments', href: '/listings?type=rent&property_type=apartment', description: 'Central living in Sarajevo, Mostar, and beyond.' },
      { label: 'Business Spaces', href: '/listings?type=rent&property_type=commercial', description: 'Flexible spaces for growing businesses.' },
    ],
  },
  {
    label: 'Services',
    items: [
      { label: 'How We Work', href: '/#process', description: 'Our advisory process from briefing to closing.' },
      { label: 'Featured Picks', href: '/#featured', description: 'A rotating selection curated by our advisors.' },
      { label: 'Private Consultation', href: '/#insights', description: 'Get a personalized shortlist and market outlook.' },
      { label: 'Market Coverage', href: '/listings', description: 'Bosnia and Adriatic opportunities in one platform.' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { label: 'Market Intelligence', href: '/#insights', description: 'Neighborhood trends and pricing signals.' },
      { label: 'Featured Reports', href: '/#insights', description: 'Data-backed investment narratives for buyers.' },
      { label: 'Buyer Guide', href: '/#process', description: 'Legal, due diligence, and acquisition essentials.' },
      { label: 'Explore Listings', href: '/listings', description: 'Apply insights directly to active opportunities.' },
    ],
  },
]

const mobileLinks = [
  { label: 'Buy', href: '/listings?type=sale' },
  { label: 'Rent', href: '/listings?type=rent' },
  { label: 'Featured', href: '/#featured' },
  { label: 'Process', href: '/#process' },
  { label: 'Insights', href: '/#insights' },
]

export function Header() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const favCount = useFavoritesStore((s) => s.ids.length)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      <header
        className="fixed top-0 left-0 z-[80] w-full transition-all duration-300"
        style={{
          backgroundColor: 'rgba(248,245,240,0.96)',
          backdropFilter: 'blur(18px) saturate(150%)',
          borderBottom: '1px solid #e2d9cc',
          boxShadow: scrolled ? '0 8px 24px rgba(0,0,0,0.08)' : 'none',
        }}
      >
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="shrink-0 flex items-center gap-2.5 group">
            <img
              src="/logo.svg"
              alt="Zlatni Kvadrat"
              width={36}
              height={36}
              className="transition-transform group-hover:scale-105"
            />
            <span className="font-serif text-lg hidden sm:block text-foreground">
              Zlatni <span style={{ color: '#b5472a' }}>Kvadrat</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center rounded-full border px-2 py-1" style={{ borderColor: '#dfd3c4', backgroundColor: 'rgba(255,255,255,0.62)' }}>
            {desktopGroups.map((group) => (
              <div key={group.label} className="relative group">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-slate-600 hover:text-foreground transition-colors"
                >
                  {group.label}
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                <div className="pointer-events-none opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 absolute top-full left-1/2 -translate-x-1/2 pt-4">
                  <div
                    className="w-[560px] rounded-2xl border p-4 shadow-2xl"
                    style={{
                      borderColor: 'rgba(223,211,196,0.95)',
                      backgroundColor: 'rgba(255,255,255,0.96)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {group.items.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          className="rounded-xl p-3 transition-colors hover:bg-[#f7f0e8]"
                        >
                          <p className="text-sm font-semibold text-foreground">{item.label}</p>
                          <p className="text-xs mt-1 text-slate-500 leading-relaxed">{item.description}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isAuthenticated && (
              <Link to="/admin" className="text-sm font-medium text-slate-600 hover:text-foreground transition-colors">
                Admin
              </Link>
            )}

            <Link
              to="/listings"
              aria-label="Favourites"
              className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all border"
              style={{
                backgroundColor: favCount > 0 ? '#fef2ee' : 'transparent',
                borderColor: '#e2d9cc',
              }}
            >
              <Heart
                className="w-4 h-4"
                style={{ color: favCount > 0 ? '#b5472a' : '#64748b' }}
                fill={favCount > 0 ? '#b5472a' : 'none'}
              />
              {favCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                  style={{ backgroundColor: '#b5472a' }}
                >
                  {favCount}
                </span>
              )}
            </Link>

            <Link
              to="/listings"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white btn-3d-primary"
            >
              Browse Listings
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors border"
            style={{
              borderColor: '#e2d9cc',
              color: '#1c1410',
              backgroundColor: 'transparent',
            }}
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-[85] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 h-full w-[82vw] max-w-xs z-[90] flex flex-col md:hidden"
              style={{ backgroundColor: '#f8f5f0', borderLeft: '1px solid #e2d9cc' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-border">
                <span className="font-serif text-base text-foreground">
                  Zlatni <span style={{ color: '#b5472a' }}>Kvadrat</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-border"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-1 px-5 py-6 flex flex-col gap-1">
                {mobileLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="py-3 text-sm font-medium text-foreground border-b border-border/50"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="px-5 pb-8 space-y-3">
                {favCount > 0 && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted flex items-center gap-2">
                      <Heart className="w-4 h-4" fill="#b5472a" stroke="#b5472a" />
                      {favCount} saved
                    </span>
                  </div>
                )}
                {isAuthenticated && (
                  <Link
                    to="/admin"
                    className="block text-center py-2.5 text-sm text-muted"
                    onClick={() => setMobileOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/listings"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white btn-3d-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  Browse Listings <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
