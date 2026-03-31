import type { Listing } from '@/types';
interface ListingFormProps {
    defaultValues?: Partial<Listing>;
    onSubmit: (data: Partial<Listing>) => void;
    isSubmitting?: boolean;
}
export declare function ListingForm({ defaultValues, onSubmit, isSubmitting }: ListingFormProps): import("react/jsx-runtime").JSX.Element;
export {};
