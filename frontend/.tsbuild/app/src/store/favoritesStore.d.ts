interface FavoritesStore {
    ids: string[];
    toggle: (id: string) => void;
    has: (id: string) => boolean;
}
export declare const useFavoritesStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<FavoritesStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<FavoritesStore, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: FavoritesStore) => void) => () => void;
        onFinishHydration: (fn: (state: FavoritesStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<FavoritesStore, unknown>>;
    };
}>;
export {};
