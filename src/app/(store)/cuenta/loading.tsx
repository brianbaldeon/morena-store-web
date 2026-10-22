import { Skeleton } from "@/components/ui/skeleton"
import { PageContainer } from "@/components/shared/page-container"

export default function Loading() {
  return (
    <PageContainer className="py-10">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <Skeleton className="hidden h-48 lg:block" />
        <Skeleton className="h-96" />
      </div>
    </PageContainer>
  )
}
