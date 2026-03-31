import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Listing } from '@/types'

interface RecentlyViewedStore {
  listings: Listing[]
  add: (listing: Listing) => void
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      listings: [],
      add: (listing) =>
        set((s) => ({
          listings: [listing, ...s.listings.filter((l) => l.id !== listing.id)].slice(0, 5),
        })),
    }),
    {
      name: 'zk-recently-viewed',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
