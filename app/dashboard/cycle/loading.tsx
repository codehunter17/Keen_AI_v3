import { CardSkeleton, Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-4xl mx-auto">
      <div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="rounded-2xl surface-premium lift-strong p-6">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-8 w-2/3 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <CardSkeleton />
    </div>
  );
}
