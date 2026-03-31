import type { Listing, ApiResponse, ListingFilters } from '@/types';
export declare function useListings(filters?: ListingFilters): import("@tanstack/react-query").UseQueryResult<ApiResponse<Listing[]>, Error>;
export declare function useFeaturedListings(): import("@tanstack/react-query").UseQueryResult<ApiResponse<Listing[]>, Error>;
export declare function useListing(id: string): import("@tanstack/react-query").UseQueryResult<ApiResponse<Listing>, Error>;
export declare function useCreateListing(): import("@tanstack/react-query").UseMutationResult<ApiResponse<Listing>, Error, Partial<Listing>, unknown>;
export declare function useUpdateListing(id: string): import("@tanstack/react-query").UseMutationResult<ApiResponse<Listing>, Error, Partial<Listing>, unknown>;
export declare function useDeleteListing(): import("@tanstack/react-query").UseMutationResult<void, Error, string, unknown>;
