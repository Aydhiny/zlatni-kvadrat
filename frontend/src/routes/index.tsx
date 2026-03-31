import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ListingCard } from '@/components/listings/ListingCard'
import { StatsTicker } from '@/components/ui/StatsTicker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFeaturedListings } from '@/hooks/useListings'
import { ArrowRight, MapPin, Search } from 'lucide-react'
import type { ListingType, PropertyType } from '@/types'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const fade = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
  viewport: { once: true, amount: 0.12 },
}

const BRAND = '#b5472a'

// 4K hero carousel images
const HERO_IMAGES = [
  'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=3840&h=2160&dpr=1',
  'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=3840&h=2160&dpr=1',
  'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=3840&h=2160&dpr=1',
]
const HERO_IMAGE_FALLBACK =
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=3840&h=2160&dpr=1'
const PAPER_PLANE_IMAGE =
  '/paper-plane.svg'

const CITIES = ['Sarajevo', 'Mostar', 'Banja Luka', 'Tuzla', 'Split', 'Dubrovnik']
const PROPERTY_TYPES: { label: string; value: PropertyType | 'any' }[] = [
  { label: 'Any type',   value: 'any' },
  { label: 'Apartment',  value: 'apartment' },
  { label: 'House',      value: 'house' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Land',       value: 'land' },
]
const LISTING_TYPES: { label: string; value: ListingType | 'any' }[] = [
  { label: 'Any listing', value: 'any' },
  { label: 'For Sale', value: 'sale' },
  { label: 'For Rent', value: 'rent' },
]

// Search bar
function HeroSearch() {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [type, setType] = useState<ListingType | ''>('')
  const [propType, setPropType] = useState<PropertyType | ''>('')

  const go = () => {
    navigate({
      to: '/listings',
      search: {
        ...(location && { location }),
        ...(type && { type }),
        ...(propType && { property_type: propType }),
      },
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.5 }}
      className="w-full"
    >
      <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <span className="text-[11px] uppercase tracking-[0.28em] font-semibold text-muted">Quick Search</span>
        <span className="text-xs text-muted">Refine by location, listing, and property type</span>
      </div>
      <div
        className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)_170px] md:gap-0 rounded-3xl overflow-hidden border p-3 md:p-0"
        style={{
          backgroundColor: 'rgba(255,255,255,0.98)',
          borderColor: 'rgba(226,217,204,0.9)',
          boxShadow: '0 18px 50px rgba(12,16,25,0.14)',
        }}
      >
        <label className="flex items-center gap-2.5 px-4 md:px-5 py-3 md:py-5 cursor-text rounded-xl md:rounded-none border md:border-none md:border-r border-border">
          <MapPin className="w-4 h-4 shrink-0" style={{ color: BRAND }} />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">Location</span>
            <input
              list="hero-cities"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or area..."
              className="bg-transparent text-sm outline-none text-foreground placeholder:text-muted/60 leading-tight"
            />
            <datalist id="hero-cities">
              {CITIES.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
        </label>

        <div className="flex items-center px-4 md:px-5 py-3 md:py-5 rounded-xl md:rounded-none border md:border-none md:border-r border-border">
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">Listing</span>
            <Select
              value={type || 'any'}
              onValueChange={(value) => setType(value === 'any' ? '' : (value as ListingType))}
            >
              <SelectTrigger
                className="h-auto border-0 bg-transparent px-0 py-0 shadow-none text-sm font-medium text-foreground focus:ring-0 focus:ring-offset-0 w-full"
                aria-label="Listing type"
              >
                <SelectValue placeholder="Any listing" />
              </SelectTrigger>
              <SelectContent>
                {LISTING_TYPES.map((listingType) => (
                  <SelectItem key={listingType.value} value={listingType.value}>
                    {listingType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center px-4 md:px-5 py-3 md:py-5 rounded-xl md:rounded-none border md:border-none md:border-r border-border">
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">Property</span>
            <Select
              value={propType || 'any'}
              onValueChange={(value) => setPropType(value === 'any' ? '' : (value as PropertyType))}
            >
              <SelectTrigger
                className="h-auto border-0 bg-transparent px-0 py-0 shadow-none text-sm font-medium text-foreground focus:ring-0 focus:ring-offset-0 w-full"
                aria-label="Property type"
              >
                <SelectValue placeholder="Any type" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((pt) => (
                  <SelectItem key={pt.value} value={pt.value}>
                    {pt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <button
          onClick={go}
          className="h-12 md:h-full md:px-8 flex items-center justify-center gap-2 text-sm font-bold text-white shrink-0 transition-all hover:opacity-95 hover:brightness-105 rounded-xl md:rounded-r-3xl md:rounded-l-none"
          style={{ background: `linear-gradient(180deg, #c85232 0%, #8f311d 100%)` }}
          aria-label="Search properties"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </div>
    </motion.div>
  )
}

// Home Page
function HomePage() {
  const { data, isLoading } = useFeaturedListings()
  const listings = (data?.data ?? []).slice(0, 3)
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, smoothTouch: false })
    let raf = 0
    const tick = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % HERO_IMAGES.length)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [])

  const { scrollY } = useScroll()
  const orbY = useTransform(scrollY, [400, 1400], [0, -50])

  return (
    <div style={{ backgroundColor: '#f8f5f0' }}>

      <section className="relative max-w-[1480px] mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="flex items-center gap-4 mb-7">
              <span className="h-px w-10" style={{ backgroundColor: '#b86a4f' }} />
              <span className="text-xs uppercase tracking-[0.34em] font-semibold" style={{ color: '#a4593f' }}>
                Balkan Estate Advisory
              </span>
            </div>

            <h1 className="font-serif leading-[1.05] text-foreground" style={{ fontSize: 'clamp(3rem, 6vw, 5.3rem)' }}>
              Premium real estate.
              <br />
              <em
                className="font-cormorant lowercase"
                style={{
                  fontStyle: 'italic',
                  fontSize: '1.08em',
                  backgroundImage: 'linear-gradient(180deg, #d98460 0%, #bb5635 48%, #8d321b 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                }}
              >
                concierge guidance.
              </em>
            </h1>

            <p className="mt-6 text-lg leading-relaxed max-w-2xl" style={{ color: '#6b7280' }}>
              Verified listings across Sarajevo, Mostar, and the Adriatic coast - paired with advisors who manage every step from discovery to closing.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/listings"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white btn-3d-primary"
              >
                Browse Properties
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#process"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  border: '1px solid #d5cabb',
                  backgroundColor: 'rgba(255,255,255,0.72)',
                  color: '#2b2621',
                  backdropFilter: 'blur(8px)',
                }}
              >
                How We Work
              </a>
            </div>

            <div className="pointer-events-none absolute inset-0 hidden lg:block overflow-hidden">
              <motion.div
                className="absolute h-[2px] rounded-full"
                style={{ left: '-8%', top: '18%', width: '58%', background: 'linear-gradient(90deg, rgba(70,196,241,0) 0%, rgba(70,196,241,0.65) 45%, rgba(70,196,241,0) 100%)' }}
                animate={{ x: [0, 120, 260], y: [0, 10, -4], opacity: [0, 0.7, 0] }}
                transition={{ duration: 8.4, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
              />
              <motion.img
                src={PAPER_PLANE_IMAGE}
                alt=""
                aria-hidden
                className="absolute w-8 h-8 opacity-0"
                style={{ left: '-10%', top: '15%', filter: 'drop-shadow(0 5px 9px rgba(0,0,0,0.2))' }}
                animate={{
                  x: [0, 180, 420, 680],
                  y: [0, 18, 10, 22],
                  rotate: [14, 8, 2, -6],
                  opacity: [0, 0.58, 0.66, 0],
                }}
                transition={{ duration: 9.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2.3 }}
              />

              <motion.div
                className="absolute h-[2px] rounded-full"
                style={{ left: '-4%', top: '36%', width: '66%', background: 'linear-gradient(90deg, rgba(70,196,241,0) 0%, rgba(70,196,241,0.58) 50%, rgba(70,196,241,0) 100%)' }}
                animate={{ x: [0, 210, 500], y: [0, -14, -28], opacity: [0, 0.75, 0] }}
                transition={{ duration: 8.8, delay: 0.8, repeat: Infinity, repeatDelay: 1.1, ease: 'easeInOut' }}
              />
              <motion.img
                src={PAPER_PLANE_IMAGE}
                alt=""
                aria-hidden
                className="absolute w-7 h-7 opacity-0"
                style={{ left: '-6%', top: '34%', filter: 'drop-shadow(0 5px 9px rgba(0,0,0,0.2))' }}
                animate={{
                  x: [0, 230, 520, 760],
                  y: [0, -14, -26, -8],
                  rotate: [26, 14, 5, -8],
                  opacity: [0, 0.6, 0.7, 0],
                }}
                transition={{ duration: 10.2, delay: 1.1, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.8 }}
              />

              <motion.div
                className="absolute h-[2px] rounded-full"
                style={{ right: '-12%', top: '47%', width: '62%', background: 'linear-gradient(90deg, rgba(70,196,241,0) 0%, rgba(70,196,241,0.55) 45%, rgba(70,196,241,0) 100%)' }}
                animate={{ x: [0, -180, -460], y: [0, 18, 36], opacity: [0, 0.68, 0] }}
                transition={{ duration: 9.4, delay: 0.3, repeat: Infinity, repeatDelay: 2.1, ease: 'easeInOut' }}
              />
              <motion.img
                src={PAPER_PLANE_IMAGE}
                alt=""
                aria-hidden
                className="absolute w-7 h-7 opacity-0"
                style={{ right: '-10%', top: '44%', filter: 'drop-shadow(0 5px 9px rgba(0,0,0,0.2))' }}
                animate={{
                  x: [0, -180, -460, -760],
                  y: [0, 22, 44, 58],
                  rotate: [202, 194, 186, 178],
                  opacity: [0, 0.56, 0.66, 0],
                }}
                transition={{ duration: 10.8, delay: 0.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2.6 }}
              />

              <motion.div
                className="absolute h-[2px] rounded-full"
                style={{ left: '-8%', top: '74%', width: '82%', background: 'linear-gradient(90deg, rgba(70,196,241,0) 0%, rgba(70,196,241,0.48) 52%, rgba(70,196,241,0) 100%)' }}
                animate={{ x: [0, 190, 430], y: [0, 42, 78], opacity: [0, 0.58, 0] }}
                transition={{ duration: 11.4, delay: 1.6, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
              />
              <motion.img
                src={PAPER_PLANE_IMAGE}
                alt=""
                aria-hidden
                className="absolute w-6 h-6 opacity-0"
                style={{ left: '-10%', top: '69%', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.18))' }}
                animate={{
                  x: [0, 160, 360, 610],
                  y: [0, 28, 52, 88],
                  rotate: [10, 20, 30, 36],
                  opacity: [0, 0.52, 0.62, 0],
                }}
                transition={{ duration: 11.8, delay: 2.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2.4 }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="hidden md:flex relative flex-col items-end gap-4 pt-4 md:pt-8"
          >
            {[0, 1, 2].map((offset) => {
              const image = HERO_IMAGES[(heroIndex + offset) % HERO_IMAGES.length]
              const widthClass = offset === 0 ? 'w-[88%]' : offset === 1 ? 'w-[76%]' : 'w-[82%]'
              const horizontalOffset = offset === 0 ? '26px' : offset === 1 ? '0px' : '42px'
              return (
                <div
                  key={`hero-card-${offset}`}
                  className={`rounded-[1.6rem] overflow-hidden border ${widthClass}`}
                  style={{
                    borderColor: 'rgba(226,217,204,0.9)',
                    boxShadow: '0 14px 30px rgba(16,18,25,0.12)',
                    marginRight: horizontalOffset,
                  }}
                >
                  <motion.img
                    key={image}
                    src={image}
                    alt="Premium property"
                    className="w-full h-[138px] lg:h-[156px] object-cover"
                    initial={{ opacity: 0.65, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    onError={(event) => {
                      const target = event.currentTarget
                      if (target.src !== HERO_IMAGE_FALLBACK) {
                        target.src = HERO_IMAGE_FALLBACK
                      }
                    }}
                  />
                </div>
              )
            })}

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.35 }}
              className="absolute left-0 -bottom-8 rounded-2xl border px-4 py-3 w-[260px]"
              style={{
                borderColor: 'rgba(223,211,196,0.95)',
                backgroundColor: 'rgba(255,255,255,0.92)',
                boxShadow: '0 14px 30px rgba(16,18,25,0.16)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <p className="text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: '#8a7b6a' }}>
                Featured Opportunity
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">Waterfront Villa, Opatija</p>
              <div className="mt-2 flex items-center justify-between text-xs" style={{ color: '#6b7280' }}>
                <span>from EUR 1.85M</span>
                <span>4 beds | 312 m2</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-10 md:mt-14"
        >
          <HeroSearch />
        </motion.div>
      </section>

      {/* STATS TICKER */}
      <StatsTicker />

      {/* FEATURED PROPERTIES */}
      <section id="featured" className="relative max-w-[1480px] mx-auto px-6 md:px-10 py-24 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse, ${BRAND}09 0%, transparent 65%)`,
            y: orbY,
          }}
          aria-hidden
        />

        <motion.div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 relative" {...fade}>
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-medium" style={{ color: BRAND }}>
              Curated Selection
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-2">
              Featured Properties
            </h2>
            <p className="mt-2 max-w-lg" style={{ color: '#6b7280' }}>
              Handpicked for location, documentation, and long-term value.
            </p>
          </div>
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 text-sm font-semibold whitespace-nowrap transition-opacity hover:opacity-70"
            style={{ color: BRAND }}
          >
            All listings <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl animate-pulse" style={{ backgroundColor: '#e8ddd0' }} />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative" {...fade}>
            {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </motion.div>
        ) : (
          <p className="text-center py-16" style={{ color: '#6b7280' }}>No featured listings yet.</p>
        )}
      </section>

      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <div className="h-px" style={{ backgroundColor: '#e2d9cc' }} />
      </div>

      {/* PROCESS */}
      <section id="process" className="max-w-[1480px] mx-auto px-6 md:px-10 py-24">
        <motion.div className="max-w-2xl mb-16" {...fade}>
          <span className="text-xs uppercase tracking-[0.25em] font-medium" style={{ color: BRAND }}>
            Our Process
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-2">
            White-glove guidance,<br />
            <em className="font-cormorant" style={{ fontStyle: 'italic', color: BRAND, fontWeight: 500 }}>
              start to finish.
            </em>
          </h2>
          <p className="mt-4 text-lg leading-relaxed" style={{ color: '#6b7280' }}>
            We pair every client with a senior advisor who owns the entire journey - from the first briefing call to signing.
          </p>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" {...fade}>
          {[
            { step: '01', title: 'Discover', desc: 'Tell us your goals, budget, and preferred areas. Within 48 hours we deliver a curated shortlist matched to your criteria.' },
            { step: '02', title: 'Visit',    desc: 'Private, guided tours with complete documentation review, local market context, and our honest assessment of each property.' },
            { step: '03', title: 'Close',    desc: 'Full negotiation support, legal review, and a managed ownership transfer - we stay until the keys are in your hand.' },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              className="relative rounded-2xl p-8 border"
              style={{ backgroundColor: '#ffffff', borderColor: '#e2d9cc' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <span className="font-serif text-6xl leading-none select-none" style={{ color: `${BRAND}1e` }}>
                {s.step}
              </span>
              <h3 className="font-serif text-2xl text-foreground mt-3 mb-3">{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <div className="h-px" style={{ backgroundColor: '#e2d9cc' }} />
      </div>

      {/* INSIGHTS */}
      <section id="insights" className="max-w-[1480px] mx-auto px-6 md:px-10 py-24">
        <motion.div className="mb-12" {...fade}>
          <span className="text-xs uppercase tracking-[0.25em] font-medium" style={{ color: BRAND }}>
            Market Insights
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-2">
            Confident decisions<br />start with data.
          </h2>
        </motion.div>
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" {...fade}>
          {[
            { title: 'Prime Locations',  desc: 'Top-performing neighbourhoods ranked by demand, rental yield, and appreciation potential across the Balkan region.' },
            { title: 'Verified Deals',   desc: 'Every listing undergoes legal due diligence - ownership chain, documentation completeness, and title verification.' },
            { title: 'Investment Outlook', desc: 'Access rental yield data, infrastructure pipeline, and buyer sentiment reports updated quarterly.' },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              className="rounded-2xl border p-7"
              style={{ backgroundColor: '#ffffff', borderColor: '#e2d9cc' }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <h3 className="font-medium text-foreground text-lg mb-3">{c.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{c.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-[1480px] mx-auto px-6 md:px-10 py-24">
        <motion.div
          className="relative overflow-hidden rounded-3xl px-8 md:px-16 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border"
          style={{
            background: 'linear-gradient(140deg, rgba(18,23,32,0.88) 0%, rgba(44,30,24,0.86) 50%, rgba(23,29,40,0.84) 100%)',
            borderColor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px) saturate(140%)',
            boxShadow: '0 24px 70px rgba(0,0,0,0.25)',
          }}
          {...fade}
        >
          <div
            className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,173,128,0.32) 0%, rgba(255,173,128,0) 70%)' }}
          />
          <div
            className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(122,180,255,0.24) 0%, rgba(122,180,255,0) 70%)' }}
          />
          <div>
            <span className="text-[11px] uppercase tracking-[0.32em] text-white/65">Private Advisory</span>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl text-white">Ready to find your property?</h2>
            <p className="mt-3 text-white/75 text-lg max-w-2xl">
              Private consultation, no obligation. We respond within 24 hours with a tailored shortlist and advisor support.
            </p>
          </div>
          <Link
            to="/listings"
            className="shrink-0 inline-flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-semibold text-white whitespace-nowrap"
            style={{
              border: '1px solid rgba(255,255,255,0.32)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 100%)',
              backdropFilter: 'blur(8px)',
            }}
          >
            Browse Listings <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

    </div>
  )
}


