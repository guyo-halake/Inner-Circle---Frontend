"use client";

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

  const pockets = [
    { 
      name: "Pocket Hold", 
      type: "POCKET_HOLD", 
      description: "Uninvested Capital", 
      icon: Wallet, 
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    { 
      name: "The Allocation", 
      type: "POCKET_ALLOCATION", 
      description: "Active Investment", 
      icon: Landmark, 
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    { 
      name: "The Yield", 
      type: "POCKET_YIELD", 
      description: "Profit Distribution", 
      icon: TrendingUp, 
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {pockets.map((pocket) => (
        <div key={pocket.type} className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:bg-card/60 transition-all duration-300 before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-br before:from-white/20 before:to-transparent before:content-[''] before:rounded-2xl before:-z-10">
          <div className="flex items-start justify-between mb-6">
            <div className={`p-3 rounded-xl ${pocket.bg} ${pocket.color}`}>
              <pocket.icon size={20} />
            </div>
            {pocket.type === "POCKET_HOLD" ? (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-[9px] uppercase font-black tracking-widest hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                 <Coins size={10} /> Stake Capital
              </button>
            ) : (
              <button className="text-[10px] uppercase font-black tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                 Manage <ArrowRight size={10} />
              </button>
            )}
          </div>
          
          <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{pocket.name}</h4>
            <div className="text-2xl font-black font-numbers tracking-tight">
               <Counter to={getBalance(pocket.type)} format={(v) => formatKSh(v)} />
            </div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter italic">{pocket.description}</p>
          </div>

          <div className="absolute -bottom-2 -right-2 opacity-5 scale-150 rotate-12 group-hover:scale-[1.7] transition-transform">
             <pocket.icon size={80} />
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
