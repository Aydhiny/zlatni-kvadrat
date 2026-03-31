import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Listing } from '@/types'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const listingSchema = z.object({
  title: z.string().min(3).max(500),
  description: z.string().optional(),
  type: z.enum(['sale', 'rent']),
  property_type: z.enum(['apartment', 'house', 'commercial', 'land']),
  price: z.coerce.number().positive('Price must be positive'),
  currency: z.string().length(3).optional().default('EUR'),
  area: z.coerce.number().optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  is_featured: z.boolean().optional().default(false),
  is_available: z.boolean().optional().default(true),
})

type ListingFormData = z.infer<typeof listingSchema>

interface ListingFormProps {
  defaultValues?: Partial<Listing>
  onSubmit: (data: Partial<Listing>) => void
  isSubmitting?: boolean
}

export function ListingForm({ defaultValues, onSubmit, isSubmitting = false }: ListingFormProps) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      type: defaultValues?.type ?? 'sale',
      property_type: defaultValues?.property_type ?? 'apartment',
      price: defaultValues?.price ?? 0,
      currency: defaultValues?.currency ?? 'EUR',
      area: defaultValues?.area ?? undefined,
      bedrooms: defaultValues?.bedrooms ?? undefined,
      bathrooms: defaultValues?.bathrooms ?? undefined,
      location: defaultValues?.location ?? '',
      address: defaultValues?.address ?? '',
      is_featured: defaultValues?.is_featured ?? false,
      is_available: defaultValues?.is_available ?? true,
    },
  })

  const fieldClass = cn(
    'w-full px-3 py-2.5 text-sm border border-border rounded-md bg-white text-foreground placeholder:text-muted/70',
    'focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors',
  )
  const labelClass = 'block text-sm font-medium text-foreground mb-1.5'
  const selectTriggerClass = 'bg-white text-foreground'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
        <h2 className="font-medium text-foreground">Basic Information</h2>
        <div>
          <label className={labelClass}>Title *</label>
          <input type="text" {...register('title')} className={fieldClass} placeholder="e.g. Luxury Penthouse in Sarajevo" />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea {...register('description')} rows={4} className={fieldClass} placeholder="Describe the property..." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Type *</label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select modal={false} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <label className={labelClass}>Property Type *</label>
            <Controller
              control={control}
              name="property_type"
              render={({ field }) => (
                <Select modal={false} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
        <h2 className="font-medium text-foreground">Pricing & Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Price *</label>
            <input type="number" {...register('price')} className={fieldClass} placeholder="250000" />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Currency</label>
            <Controller
              control={control}
              name="currency"
              render={({ field }) => (
                <Select modal={false} value={field.value ?? 'EUR'} onValueChange={field.onChange}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="BAM">BAM</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><label className={labelClass}>Area (m²)</label><input type="number" {...register('area')} className={fieldClass} placeholder="75" /></div>
          <div><label className={labelClass}>Bedrooms</label><input type="number" {...register('bedrooms')} className={fieldClass} placeholder="2" /></div>
          <div><label className={labelClass}>Bathrooms</label><input type="number" {...register('bathrooms')} className={fieldClass} placeholder="1" /></div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
        <h2 className="font-medium text-foreground">Location</h2>
        <div><label className={labelClass}>City / Area</label><input type="text" {...register('location')} className={fieldClass} placeholder="e.g. Sarajevo, Stari Grad" /></div>
        <div><label className={labelClass}>Full Address</label><input type="text" {...register('address')} className={fieldClass} placeholder="Street, number" /></div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-4">
        <h2 className="font-medium text-foreground">Settings</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" {...register('is_featured')} className="w-4 h-4 accent-gold" />
          <span className="text-sm text-foreground">Feature this listing on the homepage</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" {...register('is_available')} className="w-4 h-4 accent-gold" />
          <span className="text-sm text-foreground">Listing is available</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn('px-8 py-3 bg-gold text-white rounded-lg font-medium text-sm hover:bg-gold-dark transition-colors disabled:opacity-50')}
      >
        {isSubmitting ? 'Saving...' : 'Save Listing'}
      </button>
    </form>
  )
}
