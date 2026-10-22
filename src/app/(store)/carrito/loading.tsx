import { Skeleton } from "@/components/ui/skeleton"
import { PageContainer } from "@/components/shared/page-container"

export default function Loading() {
  return (
    <PageContainer className="py-10">
      <Skeleton className="mb-6 h-8 w-40" />
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </PageContainer>
  )
}
