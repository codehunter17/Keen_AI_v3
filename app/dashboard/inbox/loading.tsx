import { CardSkeleton, Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
      <Skeleton className="h-8 w-24" />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}
