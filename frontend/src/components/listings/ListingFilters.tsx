import type { ListingFilters } from '@/types'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ListingFiltersProps {
  filters: ListingFilters
  onChange: (filters: ListingFilters) => void
}

export function ListingFilters({ filters, onChange }: ListingFiltersProps) {
  const update = (key: keyof ListingFilters, value: ListingFilters[typeof key]) => {
    onChange({ ...filters, [key]: value || undefined, page: 1 })
  }

  const inputClass = cn(
    'w-full px-3 py-2 text-sm border border-border rounded-md bg-white text-foreground placeholder:text-muted/70',
    'focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors',
  )

  const selectTriggerClass = cn('bg-white text-foreground')

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card space-y-5">
      <h3 className="font-medium text-foreground text-sm">Filters</h3>
      <div>
        <label className="block text-xs text-muted mb-1.5">Listing Type</label>
        <Select
          modal={false}
          value={filters.type ?? 'any'}
          onValueChange={(value) => update('type', value === 'any' ? undefined : (value as ListingFilters['type']))}
        >
          <SelectTrigger className={selectTriggerClass}>
            <SelectValue placeholder="Any" className="text-foreground" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="sale">For Sale</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-xs text-muted mb-1.5">Property Type</label>
        <Select
          modal={false}
          value={filters.property_type ?? 'any'}
          onValueChange={(value) => update('property_type', value === 'any' ? undefined : (value as ListingFilters['property_type']))}
        >
          <SelectTrigger className={selectTriggerClass}>
            <SelectValue placeholder="Any" className="text-foreground" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="land">Land</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-xs text-muted mb-1.5">Location</label>
        <input type="text" placeholder="City or area..." value={filters.location ?? ''} onChange={(e) => update('location', e.target.value)} className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-muted mb-1.5">Min Price (€)</label>
          <input type="number" placeholder="0" value={filters.min_price ?? ''} onChange={(e) => update('min_price', e.target.value ? Number(e.target.value) : undefined)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1.5">Max Price (€)</label>
          <input type="number" placeholder="Any" value={filters.max_price ?? ''} onChange={(e) => update('max_price', e.target.value ? Number(e.target.value) : undefined)} className={inputClass} />
        </div>
      </div>
      <button onClick={() => onChange({ page: 1, per_page: 12 })} className="w-full text-xs text-muted hover:text-gold transition-colors py-1">
        Clear all filters
      </button>
    </div>
  )
}
