"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardSkeleton } from "@/components/skeleton";
import { PortfolioChart } from "@/components/portfolio-chart";
import { ActivePoolsList } from "@/components/active-pools-list";
import { usePortfolioData } from "@/hooks/use-portfolio-data";
import { formatKSh } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PocketsCard } from "@/components/pockets-card";
import { ActivityFeed } from "@/components/activity-feed";
import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine, History as HistoryIcon, PieChart } from "lucide-react";

export default function DashboardPage() {
  const { data, error } = usePortfolioData();
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

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
  const netProfit = Number(data.netProfit || 0);
  const wallets = user?.wallets || [];
  const allocationBalance = Number(wallets.find(w => w.type === "POCKET_ALLOCATION")?.balance || 0);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 font-sans">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-border/50 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {user?.fullName || user?.email?.split("@")[0] || "Investor"}
            </h1>
            <p className="text-xs text-muted-foreground">Overview of your account, portfolio, and recent activity.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            {/* Portfolio Value Summary */}
            <div className="rounded-xl border border-border bg-card/60 backdrop-blur px-4 py-2 min-w-[130px] flex sm:flex-col justify-between sm:justify-start items-center sm:items-end">
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Portfolio value</span>
              <span className="text-lg font-black font-numbers">{formatKSh(currentValue)}</span>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 sm:flex items-center gap-2 flex-grow sm:flex-grow-0">
              <Link 
                href="/deposit" 
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/80 bg-card/40 backdrop-blur px-3 py-2.5 text-[10px] font-black uppercase tracking-wider hover:bg-accent hover:border-primary/20 transition-all shadow-sm group"
              >
                <ArrowDownToLine size={13} className="text-blue-500 group-hover:translate-y-0.5 transition-transform" /> Deposit
              </Link>
              <Link 
                href="/withdraw" 
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/80 bg-card/40 backdrop-blur px-3 py-2.5 text-[10px] font-black uppercase tracking-wider hover:bg-accent hover:border-primary/20 transition-all shadow-sm group"
              >
                <ArrowUpFromLine size={13} className="text-emerald-500 group-hover:-translate-y-0.5 transition-transform" /> Withdraw
              </Link>
              <Link 
                href="/transactions" 
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/80 bg-card/40 backdrop-blur px-3 py-2.5 text-[10px] font-black uppercase tracking-wider hover:bg-accent hover:border-primary/20 transition-all shadow-sm group"
              >
                <HistoryIcon size={13} className="text-purple-500 group-hover:rotate-12 transition-transform" /> History
              </Link>
              <Link 
                href="/portfolio" 
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/80 bg-card/40 backdrop-blur px-3 py-2.5 text-[10px] font-black uppercase tracking-wider hover:bg-accent hover:border-primary/20 transition-all shadow-sm group"
              >
                <PieChart size={13} className="text-amber-500 group-hover:scale-105 transition-transform" /> Portfolio
              </Link>
            </div>
          </div>
        </div>

        <PocketsCard />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-2 space-y-8">
            <PortfolioChart 
              currentValue={currentValue} 
              netProfit={netProfit} 
              allocationBalance={allocationBalance} 
            />
          </div>
          <div className="lg:col-span-1">
             <ActivePoolsList />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
