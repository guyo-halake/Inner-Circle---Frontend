"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { usePortfolioData } from "@/hooks/use-portfolio-data";
import { formatKSh } from "@/lib/utils";
import { Plus, ArrowUpRight } from "lucide-react";
import { useState } from "react";

export default function PortfolioPage() {
  const { data } = usePortfolioData();
  const [activeTab, setActiveTab] = useState("Assets");
  
  const activePools = data?.poolInvestments || [];
  const investmentHistory = data?.historyLedger || [];
  const rank = data?.rank || 1;
  const percentile = data?.percentile || 99;
  const totalUsers = data?.totalUsers || 1;

  const tabs = ["Assets", "Performance", "History", "Peers"];

  return (
    <DashboardLayout>
      <div className="space-y-8 font-sans antialiased text-foreground">
        
        {/* Simple Value Header */}
        <div className="flex justify-between items-end border-b border-white/5 pb-8">
           <div>
              <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
           </div>
           <div className="flex gap-8">
              <div>
                 <span className="text-[10px] text-muted-foreground uppercase block mb-1">Value</span>
                 <span className="text-xl font-bold">{formatKSh(Number(data?.currentValue || 0))}</span>
              </div>
              <div>
                 <span className="text-[10px] text-muted-foreground uppercase block mb-1">Profit</span>
                 <span className="text-xl font-bold text-primary">+{formatKSh(Number(data?.netProfit || 0))}</span>
              </div>
           </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2">
           {tabs.map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase transition-all ${
                   activeTab === tab ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                 {tab}
              </button>
           ))}
        </div>

        {/* Assets List */}
        {activeTab === "Assets" && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
              {activePools.map((pool: any) => (
                 <div key={pool.id} className="bg-card border border-white/5 p-8 rounded-2xl">
                    <div className="flex justify-between items-start mb-6">
                       <span className="text-[10px] text-muted-foreground uppercase">{pool.category}</span>
                       <span className="text-[10px] text-primary font-bold uppercase py-0.5 px-2 bg-primary/5 rounded">Rank #4</span>
                    </div>
                    <h3 className="text-lg font-bold mb-4">{pool.name}</h3>
                    <div className="flex items-baseline gap-2 mb-6">
                       <span className="text-xl font-bold">{formatKSh(Number(pool.current_value))}</span>
                       <span className="text-[10px] text-green-500 font-bold">+{((pool.current_value - pool.staked_amount) / pool.staked_amount * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex gap-2">
                       <button className="flex-1 py-3 bg-muted border border-white/5 rounded-xl text-[10px] font-bold uppercase hover:bg-white/5 transition-colors">Manage</button>
                       <button className="p-3 bg-muted border border-white/5 rounded-xl hover:bg-white/5 transition-colors"><ArrowUpRight size={14} /></button>
                    </div>
                 </div>
              ))}
              <div className="border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 hover:bg-white/5 transition-colors cursor-pointer group">
                 <Plus size={20} className="text-muted-foreground group-hover:text-primary mb-2" />
                 <span className="text-[10px] font-bold text-muted-foreground uppercase">New Pool</span>
              </div>
           </div>
        )}

        {/* Performance Stats */}
        {activeTab === "Performance" && (
           <div className="bg-card border border-white/5 rounded-2xl overflow-hidden animate-in fade-in duration-200">
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b border-white/5 bg-muted/30 text-[10px] text-muted-foreground uppercase">
                       <th className="p-6 font-bold">Pool Name</th>
                       <th className="p-6 font-bold">Invested</th>
                       <th className="p-6 font-bold">Current</th>
                       <th className="p-6 font-bold">Total Gain</th>
                    </tr>
                 </thead>
                 <tbody className="text-sm">
                    {activePools.map((pool: any) => (
                       <tr key={pool.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-6 font-semibold">{pool.name}</td>
                          <td className="p-6">{formatKSh(Number(pool.staked_amount))}</td>
                          <td className="p-6">{formatKSh(Number(pool.current_value))}</td>
                          <td className="p-6 text-green-500 font-bold">+{formatKSh(pool.current_value - pool.staked_amount)}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        )}

        {/* Investment History */}
        {activeTab === "History" && (
           <div className="bg-card border border-white/5 rounded-2xl overflow-hidden animate-in fade-in duration-200">
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b border-white/5 bg-muted/30 text-[10px] text-muted-foreground uppercase">
                       <th className="p-6 font-bold">Action</th>
                       <th className="p-6 font-bold">Amount</th>
                       <th className="p-6 font-bold">Date</th>
                       <th className="p-6 font-bold">Status</th>
                    </tr>
                 </thead>
                 <tbody className="text-sm">
                    {investmentHistory.map((tx: any) => (
                       <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-6 font-semibold">{tx.action}</td>
                          <td className="p-6 font-bold">{formatKSh(Number(tx.amount))}</td>
                          <td className="p-6 text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</td>
                          <td className="p-6">
                             <div className={`flex items-center gap-1.5 font-bold ${
                                tx.status === 'Completed' || tx.status === 'Approved' ? 'text-green-500' : 'text-amber-500'
                             }`}>
                                {tx.status}
                             </div>
                          </td>
                       </tr>
                    ))}
                    {investmentHistory.length === 0 && (
                       <tr>
                          <td colSpan={4} className="p-12 text-center text-muted-foreground italic opacity-40">No investment history found.</td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>
        )}

        {/* Peer Comparison */}
        {activeTab === "Peers" && (
           <div className="max-w-md bg-card border border-white/5 rounded-2xl p-10 animate-in fade-in duration-200">
              <div className="space-y-8">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] text-muted-foreground uppercase">My Ranking</span>
                    <span className="text-lg font-bold text-primary">#{rank} / {totalUsers}</span>
                 </div>
                 <div className="h-1.5 bg-muted/20 rounded-full relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full bg-primary" style={{ width: `${percentile}%` }} />
                 </div>
                 <div className="grid grid-cols-2 gap-10">
                    <div>
                       <span className="text-[10px] text-muted-foreground uppercase block mb-1">Percentile</span>
                       <span className="text-xl font-bold text-green-500">Top {100 - percentile}%</span>
                    </div>
                    <div>
                       <span className="text-[10px] text-muted-foreground uppercase block mb-1">Status</span>
                       <span className="text-xl font-bold">{percentile > 80 ? 'Elite' : 'Active'}</span>
                    </div>
                 </div>
              </div>
           </div>
        )}

      </div>
    </DashboardLayout>
  );
}
