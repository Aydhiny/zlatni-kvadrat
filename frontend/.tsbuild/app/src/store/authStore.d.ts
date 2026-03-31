import type { User, AuthTokens } from '@/types';
interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: number | null;
    user: User | null;
    isAuthenticated: boolean;
    setAuth: (tokens: AuthTokens, user?: User) => void;
    clearAuth: () => void;
    isTokenExpired: () => boolean;
}
export declare const useAuthStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<AuthState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<AuthState, {
            accessToken: string | null;
            refreshToken: string | null;
            expiresAt: number | null;
            user: User | null;
            isAuthenticated: boolean;
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: AuthState) => void) => () => void;
        onFinishHydration: (fn: (state: AuthState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<AuthState, {
            accessToken: string | null;
            refreshToken: string | null;
            expiresAt: number | null;
            user: User | null;
            isAuthenticated: boolean;
        }>>;
    };
}>;
export {};
