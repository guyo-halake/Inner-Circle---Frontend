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
import { PayoutCountdown } from "@/components/payout-countdown";
import { TaxCard } from "@/components/tax-card";
import { TradeProofGallery } from "@/components/trade-proof-gallery";
import { Info, TrendingUp, ShieldCheck, History, ChevronRight, ChevronDown, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const { data, error } = usePortfolioData();
  const user = useAuthStore((state) => state.user);
  const [showActivity, setShowActivity] = useState(false);

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

  const portfolioAllocationData = [
    { name: "Stocks", value: 35, color: "hsl(var(--primary))" },
    { name: "MMF (Money Market)", value: 25, color: "hsl(var(--muted-foreground))" },
    { name: "Forex Trading", value: 25, color: "hsl(var(--primary) / 0.6)" },
    { name: "Crypto Trading", value: 15, color: "hsl(var(--primary) / 0.3)" },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10 font-sans">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-black mb-1 tracking-tight flex items-center gap-3">
              Welcome, {user?.fullName || "Investor"}
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <CheckCircle size={12} className="text-primary" />
              </div>
            </h1>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] flex items-center gap-2">
              Investor ID: <span className="text-primary">{user?.id ? `IC-${user.id}` : "IC-001"}</span> 
              <div className="w-1 h-1 bg-border rounded-full" />
              Platinum Status
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${error ? "bg-red-500/10 border-red-500/20" : "bg-muted/50"}`}>
              <div className={`w-2 h-2 rounded-full ${error ? "bg-red-500" : "bg-green-500"}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {error ? "Offline" : "Real-time updates active"}
              </span>
            </div>
            {!error && <p className="text-[9px] text-muted-foreground font-bold italic tracking-tight opacity-60">Connected to trading server</p>}
          </div>
        </div>

        <QuickActions />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard 
            label="Total Money" 
            value={formatKSh(totalInvestment)} 
            subtext="Your deposits"
          />
          <SummaryCard 
            label="Portfolio Value" 
            value={formatKSh(currentValue)} 
            subtext="Worth right now"
            trend={{ 
              value: `+${totalReturnPercent}%`, 
              positive: true 
            }}
          />
          <SummaryCard 
            label="Total Profit" 
            value={formatKSh(netProfit)} 
            subtext="Your lifetime earnings"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
          <div className="lg:col-span-2 space-y-10">
            <PortfolioChart />
            <div className="pt-10 border-t border-border/50">
              <TradeProofGallery />
            </div>
          </div>
          <div className="lg:col-span-1">
             <div className="flex flex-col gap-10 h-full">
               <TaxCard netProfit={netProfit} />
               <PortfolioAllocation />
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
