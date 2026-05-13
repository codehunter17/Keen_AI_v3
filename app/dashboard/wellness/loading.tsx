import { CardSkeleton, Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-5xl mx-auto">
      <Skeleton className="h-8 w-40" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}
