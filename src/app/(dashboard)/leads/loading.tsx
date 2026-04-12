import { Skeleton } from "@/components/ui/skeleton"

export default function LeadsLoading() {
  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <Skeleton className="h-12 w-64 rounded-xl" />
          <Skeleton className="h-5 w-96 rounded-lg" />
        </div>
        <Skeleton className="h-14 w-44 rounded-2xl" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-[28px]" />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 px-2">
          <Skeleton className="h-6 w-32 rounded-lg" />
          <Skeleton className="h-5 w-24 rounded-lg" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-[28px]" />
          ))}
        </div>
      </div>
    </div>
  )
}
