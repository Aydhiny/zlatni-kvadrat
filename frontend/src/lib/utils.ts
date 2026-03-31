import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * cn — Combines clsx and tailwind-merge for conditional class merging.
 * Always use this instead of manual string concatenation.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Formats a price with currency symbol and locale-aware thousands separators.
 */
export function formatPrice(price: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Formats an ISO date string to a human-readable local date.
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

/**
 * Returns a placeholder image URL for listings without images.
 */
export function getListingImage(images: string[], index = 0): string {
  if (images && images.length > index) return images[index]
  return `https://placehold.co/800x600/F3F4F6/9CA3AF?text=No+Image`
}
