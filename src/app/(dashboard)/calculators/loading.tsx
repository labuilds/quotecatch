import { Skeleton } from "@/components/ui/skeleton"

export default function CalculatorsLoading() {
  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
      {/* Hero Section Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
        <div className="space-y-6 max-w-2xl">
          <Skeleton className="h-8 w-40 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-[64px] w-full max-w-lg rounded-2xl" />
            <Skeleton className="h-[64px] w-3/4 rounded-2xl" />
          </div>
          <Skeleton className="h-6 w-full max-w-md rounded-lg" />
        </div>
        <div className="shrink-0 space-y-4">
          <Skeleton className="h-16 w-64 rounded-2xl" />
          <Skeleton className="h-4 w-32 mx-auto rounded-md" />
        </div>
      </div>

      {/* Grid Section Skeleton */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-8 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48 rounded-lg" />
            <Skeleton className="h-5 w-96 rounded-md" />
          </div>
          <Skeleton className="h-6 w-32 rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[320px] rounded-[3rem]" />
          ))}
        </div>
      </div>
    </div>
  )
}
