import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface FavoritesStore {
  ids: string[]
  toggle: (id: string) => void
  has: (id: string) => boolean
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id],
        })),
      has: (id) => get().ids.includes(id),
    }),
    {
      name: 'zk-favorites',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
