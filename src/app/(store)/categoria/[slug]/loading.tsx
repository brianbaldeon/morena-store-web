import { Skeleton } from "@/components/ui/skeleton"
import { PageContainer } from "@/components/shared/page-container"

export default function Loading() {
  return (
    <>
      <Skeleton className="h-56 w-full rounded-none sm:h-64 lg:h-72" />
      <PageContainer className="py-8">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-7 w-64" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          <div className="hidden space-y-3 lg:block">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
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
        </div>
      </PageContainer>
    </>
  )
}
