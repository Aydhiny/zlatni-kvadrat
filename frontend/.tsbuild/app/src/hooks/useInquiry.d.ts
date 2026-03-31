import type { Inquiry, ApiResponse } from '@/types';
interface InquirySubmitData {
    listing_id: string;
    name: string;
    email: string;
    phone?: string;
    message?: string;
}
export declare function useSubmitInquiry(): import("@tanstack/react-query").UseMutationResult<ApiResponse<Inquiry>, Error, InquirySubmitData, unknown>;
export declare function useInquiries(): import("@tanstack/react-query").UseQueryResult<ApiResponse<Inquiry[]>, Error>;
export declare function useMarkInquiryRead(): import("@tanstack/react-query").UseMutationResult<void, Error, string, unknown>;
export {};
