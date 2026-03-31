export type ListingType = 'sale' | 'rent'
export type PropertyType = 'apartment' | 'house' | 'commercial' | 'land'

export interface Listing {
  id: string
  title: string
  description: string
  type: ListingType
  property_type: PropertyType
  price: number
  currency: string
  area: number
  bedrooms: number
  bathrooms: number
  location: string
  address: string
  latitude: number | null
  longitude: number | null
  images: string[]
  is_featured: boolean
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface Inquiry {
  id: string
  listing_id: string
  name: string
  email: string
  phone: string
  message: string
  is_read: boolean
  created_at: string
}

export interface User {
  id: string
  email: string
  role: string
  created_at: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  expires_in: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  meta?: PaginationMeta
}

export interface PaginationMeta {
  page: number
  per_page: number
  total: number
}

export interface ListingFilters {
  type?: ListingType
  property_type?: PropertyType
  min_price?: number
  max_price?: number
  location?: string
  page?: number
  per_page?: number
}
