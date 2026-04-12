import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-shimmer rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:400%_100%]", className)}
      {...props}
    />
  )
}

export { Skeleton }
