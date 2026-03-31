import { useEffect } from 'react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

/**
 * ConfirmModal — plain DOM modal with no Radix dependency.
 * Used for destructive actions (delete) to replace window.confirm().
 */
export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Yes, delete',
  onConfirm,
  onCancel,
  danger = true,
}: ConfirmModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-elevated w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
        style={{ border: '1px solid #e2d9cc' }}
      >
        <h3 className="font-semibold text-foreground text-base mb-2">{title}</h3>
        <p className="text-muted text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-foreground transition-colors"
            style={{ backgroundColor: '#f3ede4', border: '1px solid #e2d9cc' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: danger ? '#d65549' : '#b5472a' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
