import { DashboardSkeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto p-8 max-w-7xl pt-16 pl-64 min-h-screen">
      <DashboardSkeleton />
    </div>
  );
}
