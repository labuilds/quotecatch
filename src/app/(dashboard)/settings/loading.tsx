import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Skeleton className="h-5 w-72 rounded-md" />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-8 space-y-10">
          <div className="space-y-6">
            <Skeleton className="h-8 w-32 rounded-md" />
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-5 w-24 rounded-md" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Skeleton className="h-12 w-32 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
