import { Skeleton } from "@/components/ui/skeleton"

export default function EditorLoading() {
  return (
    <div className="flex flex-col lg:flex-row h-full gap-8 animate-in fade-in duration-500">
      {/* Left Sidebar Skeleton */}
      <div className="w-full lg:w-1/2 space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-8 w-48 rounded-lg" />
        </div>
        
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 space-y-8">
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-10 flex-1 rounded-xl" />
            ))}
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-14 w-full rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Preview Skeleton */}
      <div className="lg:flex-1 hidden lg:block">
        <div className="sticky top-8 space-y-6">
          <Skeleton className="h-6 w-32 mx-auto rounded-full" />
          <Skeleton className="h-[600px] w-full max-w-[440px] mx-auto rounded-[3rem]" />
        </div>
      </div>
    </div>
  )
}
