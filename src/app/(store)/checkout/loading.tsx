import { Skeleton } from "@/components/ui/skeleton"
import { PageContainer } from "@/components/shared/page-container"

export default function Loading() {
  return (
    <PageContainer className="py-10">
      <Skeleton className="mb-6 h-8 w-56" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    </PageContainer>
  )
}
