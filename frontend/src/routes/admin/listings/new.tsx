import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { ListingForm } from '@/components/listings/ListingForm'
import { useCreateListing } from '@/hooks/useListings'
import type { Listing } from '@/types'

export const Route = createFileRoute('/admin/listings/new')({
  component: NewListingPage,
})

function NewListingPage() {
  const navigate = useNavigate()
  const createMutation = useCreateListing()

  const handleSubmit = (data: Partial<Listing>) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Listing created successfully.')
        navigate({ to: '/admin/listings' })
      },
      onError: () => toast.error('Failed to create listing. Please try again.'),
    })
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-foreground mb-1">New Listing</h1>
        <p className="text-muted text-sm">Add a new property to the platform.</p>
      </div>
      <ListingForm onSubmit={handleSubmit} isSubmitting={createMutation.isPending} />
    </div>
  )
}
