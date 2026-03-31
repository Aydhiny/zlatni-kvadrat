import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Listing, ApiResponse, ListingFilters } from '@/types'

const LISTINGS_KEY = 'listings'

export function useListings(filters: ListingFilters = {}) {
  return useQuery({
    queryKey: [LISTINGS_KEY, filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (filters.type) searchParams.set('type', filters.type)
      if (filters.property_type) searchParams.set('property_type', filters.property_type)
      if (filters.min_price) searchParams.set('min_price', String(filters.min_price))
      if (filters.max_price) searchParams.set('max_price', String(filters.max_price))
      if (filters.location) searchParams.set('location', filters.location)
      if (filters.page) searchParams.set('page', String(filters.page))
      if (filters.per_page) searchParams.set('per_page', String(filters.per_page))
      const res = await api.get('listings', { searchParams })
      return res.json<ApiResponse<Listing[]>>()
    },
  })
}

export function useFeaturedListings() {
  return useQuery({
    queryKey: [LISTINGS_KEY, 'featured'],
    queryFn: async () => {
      const res = await api.get('listings/featured')
      return res.json<ApiResponse<Listing[]>>()
    },
  })
}

export function useListing(id: string) {
  return useQuery({
    queryKey: [LISTINGS_KEY, id],
    queryFn: async () => {
      const res = await api.get(`listings/${id}`)
      return res.json<ApiResponse<Listing>>()
    },
    enabled: !!id,
  })
}

export function useCreateListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Listing>) => {
      const res = await api.post('admin/listings', { json: data })
      return res.json<ApiResponse<Listing>>()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LISTINGS_KEY] })
    },
  })
}

export function useUpdateListing(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Listing>) => {
      const res = await api.put(`admin/listings/${id}`, { json: data })
      return res.json<ApiResponse<Listing>>()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LISTINGS_KEY] })
    },
  })
}

export function useDeleteListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`admin/listings/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LISTINGS_KEY] })
    },
  })
}
