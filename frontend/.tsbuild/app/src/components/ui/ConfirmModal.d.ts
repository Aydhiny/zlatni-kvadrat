interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    danger?: boolean;
}
/**
 * ConfirmModal — plain DOM modal with no Radix dependency.
 * Used for destructive actions (delete) to replace window.confirm().
 */
export declare function ConfirmModal({ isOpen, title, message, confirmLabel, onConfirm, onCancel, danger, }: ConfirmModalProps): import("react/jsx-runtime").JSX.Element | null;
export {};
