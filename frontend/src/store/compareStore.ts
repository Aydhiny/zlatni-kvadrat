import { create } from 'zustand'
import type { Listing } from '@/types'

interface CompareStore {
  items: Listing[]
  open: boolean
  add: (listing: Listing) => void
  remove: (id: string) => void
  has: (id: string) => boolean
  clear: () => void
  setOpen: (v: boolean) => void
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  items: [],
  open: false,
  add: (listing) => {
    if (get().items.length >= 3 || get().has(listing.id)) return
    set((s) => ({ items: [...s.items, listing] }))
  },
  remove: (id) => set((s) => ({ items: s.items.filter((l) => l.id !== id) })),
  has: (id) => get().items.some((l) => l.id === id),
  clear: () => set({ items: [] }),
  setOpen: (v) => set({ open: v }),
}))
