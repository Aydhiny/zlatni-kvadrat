import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ListingForm } from '@/components/listings/ListingForm'
import { useListing, useUpdateListing } from '@/hooks/useListings'
import type { Listing } from '@/types'

export const Route = createFileRoute('/admin/listings/$id/edit')({
  component: EditListingPage,
})

function EditListingPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useListing(id)
  const updateMutation = useUpdateListing(id)
  const listing = data?.data

  const handleSubmit = (data: Partial<Listing>) => {
    updateMutation.mutate(data, {
      onSuccess: () => navigate({ to: '/admin/listings' }),
    })
  }

  if (isLoading) return <div className="animate-pulse h-96 bg-gray-100 rounded-xl" />

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-foreground mb-1">Edit Listing</h1>
        <p className="text-muted text-sm truncate">{listing?.title}</p>
      </div>
      <ListingForm defaultValues={listing} onSubmit={handleSubmit} isSubmitting={updateMutation.isPending} />
    </div>
  )
}
