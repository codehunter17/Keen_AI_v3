import { CardSkeleton, Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      <Skeleton className="h-8 w-32" />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}
