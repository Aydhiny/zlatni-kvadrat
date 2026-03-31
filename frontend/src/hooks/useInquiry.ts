import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Inquiry, ApiResponse } from '@/types'

const INQUIRIES_KEY = 'inquiries'

interface InquirySubmitData {
  listing_id: string
  name: string
  email: string
  phone?: string
  message?: string
}

export function useSubmitInquiry() {
  return useMutation({
    mutationFn: async (data: InquirySubmitData) => {
      const res = await api.post('inquiries', { json: data })
      return res.json<ApiResponse<Inquiry>>()
    },
  })
}

export function useInquiries() {
  return useQuery({
    queryKey: [INQUIRIES_KEY],
    queryFn: async () => {
      const res = await api.get('admin/inquiries')
      return res.json<ApiResponse<Inquiry[]>>()
    },
  })
}

export function useMarkInquiryRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`admin/inquiries/${id}/read`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INQUIRIES_KEY] })
    },
  })
}
