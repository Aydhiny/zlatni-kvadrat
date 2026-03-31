interface SidebarStore {
    collapsed: boolean;
    toggle: () => void;
}
export declare const useSidebarStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<SidebarStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<SidebarStore, SidebarStore>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: SidebarStore) => void) => () => void;
        onFinishHydration: (fn: (state: SidebarStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<SidebarStore, SidebarStore>>;
    };
}>;
export {};
