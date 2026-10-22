import { Skeleton } from "@/components/ui/skeleton"
import { PageContainer } from "@/components/shared/page-container"

export default function Loading() {
  return (
    <PageContainer>
      <div className="mx-auto max-w-md space-y-4 py-16 text-center">
        <Skeleton className="mx-auto size-16 rounded-full" />
        <Skeleton className="mx-auto h-6 w-48" />
        <Skeleton className="mx-auto h-4 w-64" />
        <Skeleton className="mx-auto h-10 w-40" />
      </div>
    </PageContainer>
  )
}
