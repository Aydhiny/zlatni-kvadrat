import { type ClassValue } from 'clsx';
/**
 * cn — Combines clsx and tailwind-merge for conditional class merging.
 * Always use this instead of manual string concatenation.
 */
export declare function cn(...inputs: ClassValue[]): string;
/**
 * Formats a price with currency symbol and locale-aware thousands separators.
 */
export declare function formatPrice(price: number, currency?: string): string;
/**
 * Formats an ISO date string to a human-readable local date.
 */
export declare function formatDate(dateString: string): string;
/**
 * Returns a placeholder image URL for listings without images.
 */
export declare function getListingImage(images: string[], index?: number): string;
