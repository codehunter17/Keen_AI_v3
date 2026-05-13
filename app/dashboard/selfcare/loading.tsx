import { CardSkeleton, Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-80" />
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i}>
          <Skeleton className="h-5 w-28 mb-3" />
          <div className="grid sm:grid-cols-2 gap-3">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      ))}
    </div>
  );
}
