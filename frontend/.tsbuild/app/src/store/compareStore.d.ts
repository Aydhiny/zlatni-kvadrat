import type { Listing } from '@/types';
interface CompareStore {
    items: Listing[];
    open: boolean;
    add: (listing: Listing) => void;
    remove: (id: string) => void;
    has: (id: string) => boolean;
    clear: () => void;
    setOpen: (v: boolean) => void;
}
export declare const useCompareStore: import("zustand").UseBoundStore<import("zustand").StoreApi<CompareStore>>;
export {};
