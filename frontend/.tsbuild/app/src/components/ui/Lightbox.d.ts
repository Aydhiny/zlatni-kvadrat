interface Props {
    images: string[];
    index: number;
    onClose: () => void;
    onChange: (i: number) => void;
}
export declare function Lightbox({ images, index, onClose, onChange }: Props): import("react").ReactPortal;
export {};
