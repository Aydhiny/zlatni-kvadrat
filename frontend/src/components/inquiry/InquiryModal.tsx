import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, X } from 'lucide-react'
import { toast } from 'sonner'
import { useSubmitInquiry } from '@/hooks/useInquiry'
import { cn } from '@/lib/utils'

const inquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  message: z.string().max(2000).optional(),
})

type InquiryFormData = z.infer<typeof inquirySchema>

interface InquiryModalProps {
  listingId: string
  listingTitle: string
  isOpen: boolean
  onClose: () => void
}

export function InquiryModal({ listingId, listingTitle, isOpen, onClose }: InquiryModalProps) {
  const submitMutation = useSubmitInquiry()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
  })

  const onSubmit = (data: InquiryFormData) => {
    submitMutation.mutate({ ...data, listing_id: listingId }, {
      onSuccess: () => {
        reset()
        onClose()
        toast.success('Inquiry sent! We\'ll be in touch within one business day.')
      },
      onError: () => toast.error('Failed to send inquiry. Please try again.'),
    })
  }

  const inputClass = cn(
    'w-full px-3 py-2.5 text-sm border border-border rounded-md bg-white text-foreground placeholder:text-muted/70',
    'focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors',
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-4 bottom-4 md:inset-auto md:right-8 md:bottom-8 md:w-[26rem] bg-white text-foreground border border-border rounded-2xl shadow-elevated z-50 p-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-serif text-xl text-foreground">Request Information</h3>
                <p className="text-muted text-xs mt-0.5 truncate max-w-[240px]">{listingTitle}</p>
              </div>
              <button onClick={onClose} className="p-1.5 text-muted hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
            </div>

            {submitMutation.isSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-gold mx-auto mb-3" />
                <h4 className="font-medium text-foreground mb-1">Inquiry Sent</h4>
                <p className="text-muted text-sm">We'll be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <input {...register('name')} placeholder="Your name *" className={inputClass} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <input type="email" {...register('email')} placeholder="Email address *" className={inputClass} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <input type="tel" {...register('phone')} placeholder="Phone (optional)" className={inputClass} />
                <textarea {...register('message')} placeholder="Your message..." rows={3} className={inputClass} />
                <button type="submit" disabled={submitMutation.isPending} className={cn('w-full py-2.5 bg-gold text-white rounded-lg text-sm font-medium hover:bg-gold-dark transition-colors disabled:opacity-50')}>
                  {submitMutation.isPending ? 'Sending...' : 'Send Inquiry'}
                </button>
                <p className="text-[11px] text-muted text-center">We respond within one business day.</p>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
