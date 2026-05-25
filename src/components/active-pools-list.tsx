"use client";

import { usePortfolioData } from "@/hooks/use-portfolio-data";
import { formatKSh, formatRelativeTime } from "@/lib/utils";
import { CalendarDays, ArrowDownRight, ArrowUpRight, Wallet, TrendingUp, Coins, AlertCircle } from "lucide-react";
import Link from "next/link";

export function ActivePoolsList() {
  const { data } = usePortfolioData();
  
  const activities = data?.historyLedger || [];

  const getIcon = (type: string) => {
    switch (type) {
      case 'Deposit': return ArrowDownRight;
      case 'Withdrawal': return ArrowUpRight;
      case 'Allocation': return Wallet;
      case 'Profit': return TrendingUp;
      default: return Coins;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'Deposit': return 'text-blue-500 bg-blue-500/10';
      case 'Withdrawal': return 'text-red-500 bg-red-500/10';
      case 'Allocation': return 'text-amber-500 bg-amber-500/10';
      case 'Profit': return 'text-emerald-500 bg-emerald-500/10';
      default: return 'text-zinc-500 bg-zinc-500/10';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Approved':
      case 'Completed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Rejected':
      case 'Failed': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  return (
    <div className="bg-card/30 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 h-full flex flex-col group shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 text-muted-foreground/80">
          <CalendarDays size={16} className="text-primary" /> Recent Activity
        </h3>
        <Link href="/transactions" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
          View History
        </Link>
      </div>

      <div className="flex-1 space-y-4">
        {activities.length > 0 ? (
          activities.slice(0, 5).map((activity: any) => {
            const Icon = getIcon(activity.action);
            const iconStyle = getIconColor(activity.action);
            return (
              <div 
                key={activity.id} 
                className="p-4 bg-background/20 border border-white/5 rounded-2xl hover:border-primary/20 transition-all flex items-center justify-between group/item cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconStyle}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-tight text-foreground/90 group-hover/item:text-primary transition-colors">{activity.action}</p>
                    <p className="text-[8px] font-black uppercase tracking-wider text-muted-foreground/30 italic">{formatRelativeTime(activity.date)}</p>
                  </div>
                </div>
                
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="text-xs font-black font-numbers tracking-tighter">{formatKSh(Number(activity.amount))}</p>
                    <span className={`inline-block text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 border rounded-md mt-1 ${getStatusClass(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 px-6 bg-background/10 border border-dashed border-white/5 rounded-3xl">
            <AlertCircle size={28} className="text-muted-foreground/20 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">No Transactions Found</p>
            <p className="text-[9px] font-bold text-muted-foreground/40 mt-2 leading-relaxed">
              Any deposits, allocations, or payouts will be displayed here in real-time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
