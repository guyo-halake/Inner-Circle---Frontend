"use client";

import { usePortfolioData } from "@/hooks/use-portfolio-data";
import { formatKSh } from "@/lib/utils";
import { LayoutGrid, TrendingUp, AlertCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

export function ActivePoolsList() {
  const { data } = usePortfolioData();
  
  const activePools = data?.poolInvestments || [];

  let aggregateROI = 0;
  let totalStaked = 0;
  let totalCurrent = 0;

  activePools.forEach((pool: any) => {
    totalStaked += Number(pool.staked_amount || 0);
    totalCurrent += Number(pool.current_value || 0);
  });

  if (totalStaked > 0) {
    aggregateROI = ((totalCurrent - totalStaked) / totalStaked) * 100;
  } else if (data && Number(data.totalInvestment) > 0) {
    aggregateROI = (Number(data.netProfit) / Number(data.totalInvestment)) * 100;
  }

  return (
    <div className="bg-card/30 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 h-full flex flex-col group">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-black uppercase tracking-[0.3em] flex items-center gap-3 text-muted-foreground/80">
          <LayoutGrid size={16} className="text-primary" /> Active Stakes
        </h3>
        <Link href="/portfolio" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
          View All
        </Link>
      </div>

      <div className="flex-1 space-y-4">
        {activePools.length > 0 ? (
          activePools.map((pool: any) => (
            <div key={pool.id} className="p-5 bg-background/20 border border-white/5 rounded-2xl hover:border-primary/20 transition-all flex items-center justify-between group/item cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black uppercase ${
                  pool.category === 'Forex' ? 'bg-blue-500/10 text-blue-500' :
                  pool.category === 'Crypto' ? 'bg-orange-500/10 text-orange-500' :
                  'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {pool.category?.substring(0, 3)}
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-tight">{pool.name}</p>
                  <p className="text-[10px] font-bold text-muted-foreground/60">Yield: +{pool.current_yield}%</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-4">
                <div>
                   <p className="text-xs font-black font-numbers tracking-tighter">{formatKSh(Number(pool.current_value))}</p>
                   <p className="text-[9px] font-bold text-emerald-500 uppercase">+{((pool.current_value - pool.staked_amount) / pool.staked_amount * 100).toFixed(1)}%</p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground/20 group-hover/item:text-primary transition-colors" />
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-background/10 border border-dashed border-white/5 rounded-3xl">
            <AlertCircle size={32} className="text-muted-foreground/20 mb-4" />
            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">No Pools Chosen</p>
            <p className="text-[9px] font-bold text-muted-foreground/40 mt-2 leading-relaxed">
               Allocate capital from your Pocket Hold to begin generating yield.
            </p>
            <Link href="/dashboard" className="mt-6 px-6 py-2.5 bg-primary/10 text-primary rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all">
               Stake Capital Now
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8 pt-8 border-t border-white/5">
         <div className="flex items-center justify-between opacity-40">
            <span className="text-[9px] font-black uppercase tracking-widest">Aggregate ROI</span>
            <span className="text-xs font-black font-numbers text-emerald-500">+{aggregateROI.toFixed(1)}%</span>
         </div>
      </div>
    </div>
  );
}
