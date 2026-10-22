import { Skeleton } from "@/components/ui/skeleton"
import { PageContainer } from "@/components/shared/page-container"

export default function Loading() {
  return (
    <PageContainer className="py-10">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-2 mb-8 h-4 w-56" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-3/4 w-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    </PageContainer>
  )
}
