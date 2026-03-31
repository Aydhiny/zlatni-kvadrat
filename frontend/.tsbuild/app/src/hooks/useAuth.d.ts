import type { ApiResponse, AuthTokens } from '@/types';
interface LoginCredentials {
    email: string;
    password: string;
}
/**
 * useAuth — hook for authentication actions.
 * Server state (tokens) lives in Zustand with localStorage persistence.
 */
export declare function useAuth(): {
    isAuthenticated: boolean;
    user: import("@/types").User | null;
    login: import("@tanstack/react-query").UseMutateFunction<ApiResponse<AuthTokens>, Error, LoginCredentials, unknown>;
    logout: import("@tanstack/react-query").UseMutateFunction<void, Error, void, unknown>;
    isLoggingIn: boolean;
    loginError: Error | null;
};
export {};
