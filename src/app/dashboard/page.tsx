"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { SummaryCard } from "@/components/summary-card";
import { PortfolioChart } from "@/components/portfolio-chart";
import { PortfolioAllocation } from "@/components/portfolio-allocation";
import { ActivityFeed } from "@/components/activity-feed";
import { QuickActions } from "@/components/quick-actions";
import { usePortfolioData } from "@/hooks/use-portfolio-data";
import { formatKSh } from "@/lib/utils";
import { DashboardSkeleton } from "@/components/skeleton";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardPage() {
  const { data, error } = usePortfolioData();
  const user = useAuthStore((state) => state.user);

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-500">{error}</div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  const totalInvestment = Number(data.totalInvestment);
  const currentValue = Number(data.currentValue);
  const netProfit = Number(data.netProfit);
  const todayChange = Number(data.todayChange);
  const todayChangePercent = Number(data.todayChangePercent);

  const totalReturnPercent = totalInvestment !== 0 ? ((netProfit / totalInvestment) * 100).toFixed(1) : "0.0";

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Welcome, {user?.fullName?.split(' ')[0]}</h1>
            <p className="text-muted-foreground">Here is your current portfolio status.</p>
          </div>
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">
              Live updates: {new Date(data.lastUpdate).toLocaleTimeString()}
            </span>
          </div>
        </div>

        <QuickActions />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard 
            label="Total Investment" 
            value={formatKSh(totalInvestment)} 
            subtext="Initial capital"
          />
          <SummaryCard 
            label="Current Value" 
            value={formatKSh(currentValue)} 
            subtext="Portfolio worth"
            trend={{ 
              value: `+${totalReturnPercent}%`, 
              positive: true 
            }}
          />
          <SummaryCard 
            label="Net Profit" 
            value={formatKSh(netProfit)} 
            subtext="Lifetime earnings"
            trend={{ 
              value: `+${totalReturnPercent}%`, 
              positive: true 
            }}
          />
          <SummaryCard 
            label="Today's Change" 
            value={`${todayChange >= 0 ? "+" : ""}${formatKSh(todayChange)}`} 
            subtext="Last 24 hours"
            trend={{ 
              value: `${todayChangePercent >= 0 ? "+" : ""}${todayChangePercent.toFixed(2)}%`, 
              positive: todayChange >= 0 
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <PortfolioChart />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-10">
            <PortfolioAllocation />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
