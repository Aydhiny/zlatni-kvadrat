import type { ListingFilters } from '@/types';
interface ListingFiltersProps {
    filters: ListingFilters;
    onChange: (filters: ListingFilters) => void;
}
export declare function ListingFilters({ filters, onChange }: ListingFiltersProps): import("react/jsx-runtime").JSX.Element;
export {};
