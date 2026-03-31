import type { Listing } from '@/types';
interface RecentlyViewedStore {
    listings: Listing[];
    add: (listing: Listing) => void;
}
export declare const useRecentlyViewedStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<RecentlyViewedStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<RecentlyViewedStore, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: RecentlyViewedStore) => void) => () => void;
        onFinishHydration: (fn: (state: RecentlyViewedStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<RecentlyViewedStore, unknown>>;
    };
}>;
export {};
