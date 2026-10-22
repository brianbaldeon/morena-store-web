import { Skeleton } from "@/components/ui/skeleton"
import { PageContainer } from "@/components/shared/page-container"

export default function Loading() {
  return (
    <PageContainer className="py-8">
      <Skeleton className="h-4 w-56" />
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
        <Skeleton className="aspect-square w-full" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
      <Skeleton className="mt-16 h-48 w-full" />
    </PageContainer>
  )
}
