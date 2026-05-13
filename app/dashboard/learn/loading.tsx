import { GridSkeleton, Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-4 w-72 mb-6" />
      <GridSkeleton count={6} />
    </div>
  );
}
