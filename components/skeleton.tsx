// Tiny skeleton primitives. Use to build per-page loading.tsx files.

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-muted ${className}`}
      aria-hidden
    />
  );
}

export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-card lift p-6 ${className}`}>
      <Skeleton className="h-5 w-1/3 mb-3" />
      <Skeleton className="h-4 w-2/3 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
