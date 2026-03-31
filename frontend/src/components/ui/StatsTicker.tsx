import { Home, Globe, TrendingUp, Star, Users, Award } from 'lucide-react'

const BRAND = '#b5472a'

const stats = [
  { icon: Home,      value: '500+',      label: 'Active Listings' },
  { icon: Globe,     value: '12',        label: 'Cities Covered' },
  { icon: TrendingUp,value: '€2.4M',     label: 'Avg. Sale Price' },
  { icon: Star,      value: '98%',       label: 'Client Satisfaction' },
  { icon: Users,     value: '1,200+',    label: 'Buyers Served' },
  { icon: Award,     value: '8 yrs',     label: 'Market Experience' },
]

// Duplicate for seamless infinite loop
const items = [...stats, ...stats]

export function StatsTicker() {
  return (
    <div
      className="overflow-hidden py-8 border-y"
      style={{ borderColor: '#e2d9cc', backgroundColor: '#f3ede4' }}
      aria-label="Platform statistics"
    >
      <div className="flex animate-marquee" style={{ width: 'max-content' }}>
        {items.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div
              key={i}
              className="flex items-center gap-4 px-12"
              style={{ borderRight: i < items.length - 1 ? '1px solid #e2d9cc' : 'none' }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${BRAND}18` }}
              >
                <Icon className="w-4 h-4" style={{ color: BRAND }} />
              </div>
              <div>
                <div
                  className="font-serif text-2xl leading-none"
                  style={{ color: '#1c1410' }}
                >
                  {stat.value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                  {stat.label}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
