"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PortfolioAllocation } from "@/components/portfolio-allocation";
import { SummaryCard } from "@/components/summary-card";
import { formatKSh } from "@/lib/utils";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  Download, 
  ArrowRightLeft, 
  ShieldCheck,
  Zap,
  LayoutGrid,
  List
} from "lucide-react";

const portfolioDetails = [
  { 
    name: "Stocks", 
    value: 638579.37, 
    profit: 52410.00, 
    change: "+8.2%", 
    assets: ["Safaricom", "EABL", "KCB Bank"],
    risk: "Moderate",
    color: "#3B82F6"
  },
  { 
    name: "MMF (Money Market)", 
    value: 456128.12, 
    profit: 12450.00, 
    change: "+2.7%", 
    assets: ["91-Day T-Bill", "Equity MMF"],
    risk: "Low",
    color: "#10B981"
  },
  { 
    name: "Forex Trading", 
    value: 456128.12, 
    profit: 86850.00, 
    change: "+19.2%", 
    assets: ["USD/KES", "EUR/USD", "GBP/USD"],
    risk: "High",
    color: "#FACC15"
  },
  { 
    name: "Crypto Trading", 
    value: 273676.88, 
    profit: 92450.00, 
    change: "+34.5%", 
    assets: ["BitCoin (BTC)", "Ethereum (ETH)", "USDT"],
    risk: "High-Risk",
    color: "#F97316"
  },
];

const milestones = [
  { date: "24 Mar, 2026", event: "Portfolio Reached KSh 1.8M", type: "achievement" },
  { date: "15 Jan, 2026", event: "Initial Diversified Entry", type: "entry" },
  { date: "02 Jan, 2026", event: "Account Verification Approved", type: "security" },
];

export default function PortfolioPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCompounding, setIsCompounding] = useState<Record<string, boolean>>({
    "Stocks": true,
    "MMF (Money Market)": true,
  });

  const toggleCompounding = (name: string) => {
    setIsCompounding(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tighter">Asset Portfolio</h1>
            <p className="text-muted-foreground font-medium">Institutional breakdown of your capital distribution and historical performance.</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                <Download size={14} />
                Export KRA Tax Receipt
             </button>
             <button className="p-2 border border-border rounded-xl hover:bg-muted transition-colors">
                <ArrowRightLeft size={18} className="text-muted-foreground" />
             </button>
          </div>
        </div>

        {/* Top-Level Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SummaryCard label="Total Portfolio Value" value={formatKSh(1824512.50)} subtext="Sum of all asset pools" />
          <SummaryCard label="Active Asset Pools" value="4" subtext="Diversified across sectors" />
          <SummaryCard label="Weight (Forex/Crypto)" value="40%" subtext="High-yield exposure" />
          <SummaryCard label="Annualized Return" value="18.4%" subtext="Est. yearly performance" trend={{ value: "+2.1%", positive: true }} />
        </div>

        {/* Allocation & Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
             <PortfolioAllocation />
          </div>
          
          <div className="lg:col-span-2">
             <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-xl h-full flex flex-col">
               <div className="flex justify-between items-center mb-10">
                 <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Performance Heatmap</h3>
                 <div className="flex bg-muted/30 p-1 rounded-lg border">
                    <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}><LayoutGrid size={14} /></button>
                    <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}><List size={14} /></button>
                 </div>
               </div>

               {viewMode === "grid" ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {portfolioDetails.map((pool) => (
                      <div key={pool.name} className="relative group overflow-hidden bg-background/50 border border-border/40 rounded-2xl p-6 hover:border-primary/30 transition-all">
                        <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform" style={{ color: pool.color }}>
                          <Zap size={40} fill="currentColor" />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pool.color }} />
                          <p className="text-xs font-black uppercase tracking-widest leading-none">{pool.name}</p>
                        </div>
                        <p className="text-2xl font-black font-numbers mb-1">{formatKSh(pool.value)}</p>
                        <div className="flex items-center justify-between">
                           <p className="text-[10px] text-muted-foreground font-medium italic">{pool.assets.join(" • ")}</p>
                           <span className="text-xs font-bold text-green-500">{pool.change}</span>
                        </div>

                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/20">
                           <div className="flex flex-col">
                             <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground">Compounding</span>
                             <span className="text-[10px] font-bold text-primary">{isCompounding[pool.name] ? "Enabled" : "Paused"}</span>
                           </div>
                           <button 
                             onClick={() => toggleCompounding(pool.name)}
                             className={`w-10 h-5 rounded-full relative transition-colors ${isCompounding[pool.name] ? "bg-primary" : "bg-muted"}`}
                           >
                             <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isCompounding[pool.name] ? "right-1" : "left-1"}`} />
                           </button>
                        </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="space-y-4">
                    {/* List view implementation */}
                    {portfolioDetails.map((pool) => (
                      <div key={pool.name} className="flex items-center justify-between p-4 bg-muted/20 border border-border/40 rounded-xl">
                        <div className="flex items-center gap-4">
                           <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: pool.color }} />
                           <div>
                              <p className="text-xs font-black uppercase tracking-widest">{pool.name}</p>
                              <p className="text-[10px] text-muted-foreground">{pool.assets.join(", ")}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-black font-numbers">{formatKSh(pool.value)}</p>
                           <p className="text-[10px] text-green-500 font-bold">{pool.change}</p>
                        </div>
                      </div>
                    ))}
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Milestone Timeline & Rebalance Sim */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <div className="lg:col-span-2 bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-xl">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-8">Asset History & Milestones</h3>
              <div className="relative pl-8 border-l border-border/50 space-y-10 py-2">
                 {milestones.map((ms, i) => (
                   <div key={i} className="relative">
                      <div className="absolute -left-[41px] top-1.5 w-5 h-5 bg-background border-2 border-primary rounded-full flex items-center justify-center shadow-lg">
                         <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div>
                          <p className="text-xs font-black text-foreground">{ms.event}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{ms.date}</p>
                        </div>
                        <span className="text-[10px] font-bold px-3 py-1 bg-muted/60 border rounded-full uppercase tracking-tighter">
                          Log Verified
                        </span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="lg:col-span-1 bg-primary/5 border border-primary/20 rounded-2xl p-8 shadow-xl flex flex-col group overflow-hidden relative">
              <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:rotate-12 transition-transform">
                 <RefreshCw size={180} className="text-primary" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                 <RefreshCw size={16} />
                 Rebalance Simulator
              </h3>
              <p className="text-xs text-muted-foreground mb-8 leading-relaxed font-bold">
                 Project your future wealth by shifting capital between asset classes.
              </p>
              
              <div className="space-y-8 flex-grow">
                 <div>
                    <div className="flex justify-between mb-3">
                       <span className="text-[10px] font-black uppercase text-muted-foreground">Equity/Stocks Risk</span>
                       <span className="text-[10px] font-black text-primary">35%</span>
                    </div>
                    <div className="h-1.5 bg-background rounded-full overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: "35%" }} />
                    </div>
                 </div>
                 
                 <div>
                    <div className="flex justify-between mb-3">
                       <span className="text-[10px] font-black uppercase text-muted-foreground">High-Yield Yield (Forex/Crypto)</span>
                       <span className="text-[10px] font-black text-primary">40%</span>
                    </div>
                    <div className="h-1.5 bg-background rounded-full overflow-hidden">
                       <div className="h-full bg-orange-500" style={{ width: "40%" }} />
                    </div>
                 </div>

                 <div className="p-4 bg-background/50 rounded-xl border border-border/50 border-dashed">
                    <p className="text-[10px] text-muted-foreground mb-1 uppercase font-black tracking-widest text-center">Projected Performance</p>
                    <p className="text-2xl font-black font-numbers text-center text-primary">+24.5% <span className="text-[10px] uppercase align-middle ml-1">Annually</span></p>
                 </div>
              </div>

              <button className="mt-8 w-full bg-primary text-primary-foreground py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 relative z-10 active:scale-95 transition-all">
                 Apply Rebalance Strategy
              </button>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
