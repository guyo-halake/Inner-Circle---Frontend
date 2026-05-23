"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardSkeleton } from "@/components/skeleton";
import { PortfolioChart } from "@/components/portfolio-chart";
import { ActivePoolsList } from "@/components/active-pools-list";
import { QuickActions } from "@/components/quick-actions";
import { usePortfolioData } from "@/hooks/use-portfolio-data";
import { formatKSh } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PocketsCard } from "@/components/pockets-card";
import { ActivityFeed } from "@/components/activity-feed";

export default function DashboardPage() {
  const { data, error } = usePortfolioData();
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [showActivity, setShowActivity] = useState(false);

  useEffect(() => {
    if (user) {
      const role = user.role?.toLowerCase();
      if (role === "admin" || role === "developer") {
        router.replace("/admin");
      }
    }
  }, [user, router]);

  if (!data) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  const currentValue = Number(data.currentValue || 0);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 font-sans">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back, {user?.fullName || user?.email?.split("@")[0] || "Investor"}
            </h1>
            <p className="text-sm text-muted-foreground">Overview of your account, portfolio, and recent activity.</p>
          </div>
          <div className="rounded-xl border border-border bg-card px-4 py-3 text-right">
            <p className="text-xs text-muted-foreground">Portfolio value</p>
            <p className="text-lg font-semibold">{formatKSh(currentValue)}</p>
          </div>
        </div>

        <QuickActions />
        <PocketsCard />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-2 space-y-8">
            <PortfolioChart />
          </div>
          <div className="lg:col-span-1 space-y-8">
             <ActivePoolsList />
             <ActivityFeed />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
