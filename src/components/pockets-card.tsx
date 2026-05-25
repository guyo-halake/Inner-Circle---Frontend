"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { formatKSh } from "@/lib/utils";
import { Wallet, Landmark, TrendingUp, ArrowRight, Coins } from "lucide-react";
import { Counter } from "./counter";
import { useState } from "react";
import { AllocationModal } from "./allocation-modal";

export function PocketsCard() {
  const { user } = useAuthStore();
  
  const wallets = user?.wallets || [];
  
  const getBalance = (type: string) => {
    const balance = wallets.find(w => w.type === type)?.balance;
    return balance ? parseFloat(balance.toString()) : 0;
  };

  const allocationBalance = getBalance("POCKET_ALLOCATION");
  const dailyReturn = allocationBalance * 0.00166667;

  const pockets = [
    { 
      name: "Available Funds", 
      type: "POCKET_HOLD", 
      description: "Balance ready to be invested", 
      icon: Wallet, 
      color: "text-zinc-400",
      bg: "bg-transparent border border-zinc-800",
      badgeText: "Ready to invest",
      badgeClass: "bg-transparent border-zinc-800 text-zinc-400"
    },
    { 
      name: "Invested Capital", 
      type: "POCKET_ALLOCATION", 
      description: "Capital active in markets", 
      icon: Landmark, 
      color: "text-zinc-400",
      bg: "bg-transparent border border-zinc-800",
      badgeText: "Target: 30% yield per 6 months",
      badgeClass: "bg-transparent border-zinc-800 text-zinc-400"
    },
    { 
      name: "Yield Profit", 
      type: "POCKET_YIELD", 
      description: "Accumulated daily earnings", 
      icon: TrendingUp, 
      color: "text-emerald-500",
      bg: "bg-transparent border border-emerald-900/30",
      badgeText: `+${formatKSh(dailyReturn)} / Day (+0.17%)`,
      badgeClass: "bg-transparent border-emerald-950/20 border-emerald-900/30 text-emerald-400"
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {pockets.map((pocket) => (
        <div 
          key={pocket.type} 
          className="bg-transparent border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 hover:bg-zinc-950/20 transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-5">
            <div className={`p-2.5 rounded-xl border border-zinc-800/30 ${pocket.bg} ${pocket.color}`}>
              <pocket.icon size={18} />
            </div>
            {pocket.type === "POCKET_HOLD" ? (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-foreground text-background px-3 py-1.5 rounded-lg text-[9px] uppercase font-bold tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
              >
                 <Coins size={10} /> Invest Capital
              </button>
            ) : pocket.type === "POCKET_ALLOCATION" ? (
              <Link 
                href="/portfolio" 
                className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer py-1"
              >
                 Details <ArrowRight size={9} />
              </Link>
            ) : (
              <Link 
                href="/withdraw" 
                className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer py-1"
              >
                 Withdraw <ArrowRight size={9} />
              </Link>
            )}
          </div>
          
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">{pocket.name}</h4>
            <div className="text-2xl font-bold font-numbers tracking-tight text-foreground">
               <Counter to={getBalance(pocket.type)} format={(v) => formatKSh(v)} />
            </div>
            <p className="text-[10px] text-muted-foreground/50 mb-3">{pocket.description}</p>
            
            {/* Minimalist Stats Badge */}
            <div className={`flex items-center gap-1.5 mt-4 border px-2.5 py-1 rounded-lg w-fit text-[9px] font-medium tracking-wide ${pocket.badgeClass}`}>
              {pocket.badgeText}
            </div>
          </div>
        </div>
      ))}
      <AllocationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        availableBalance={getBalance("POCKET_HOLD")}
      />
    </div>
  );
}
