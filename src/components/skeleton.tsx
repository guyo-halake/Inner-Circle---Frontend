export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded-md ${className}`} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <div className="flex gap-4">
        <Skeleton className="h-12 flex-1" />
        <Skeleton className="h-12 flex-1" />
        <Skeleton className="h-12 flex-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Skeleton className="lg:col-span-2 h-[400px]" />
        <div className="space-y-10">
          <Skeleton className="h-[250px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    </div>
  );
}
