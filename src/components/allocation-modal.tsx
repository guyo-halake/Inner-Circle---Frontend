"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  X, 
  Target, 
  ArrowRight, 
  Coins, 
  ShieldCheck,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { formatKSh } from "@/lib/utils";

interface AllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

export function AllocationModal({ isOpen, onClose, availableBalance }: AllocationModalProps) {
  const { token } = useAuthStore();
  const [pools, setPools] = useState<any[]>([]);
  const [selectedPoolId, setSelectedPoolId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const response = await fetch(`${API_URL}/api/portfolio/pools`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setPools(data);
        if (data.length > 0) setSelectedPoolId(data[0].id.toString());
      } catch (err) {
        console.error("Failed to load pools", err);
      }
    };
    if (isOpen) fetchPools();
  }, [isOpen, token]);

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) > availableBalance) {
      setError("Insufficient balance in Pocket Hold");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/portfolio/invest`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          amount: Number(amount), 
          poolId: Number(selectedPoolId) 
        })
      });

      if (response.ok) {
        window.location.reload(); // Refresh to update pocket balances
      } else {
        const data = await response.json();
        setError(data.error || "Allocation failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedPool = pools.find(p => p.id.toString() === selectedPoolId);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
      <div className="bg-card w-full max-w-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                 <Target size={20} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter italic">Capital Stake Allocation</h2>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted-foreground">
              <X size={20} />
           </button>
        </div>

        <form onSubmit={handleAllocate} className="p-10 space-y-8">
           <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Allocation Target</label>
                 <span className="text-[9px] font-bold text-primary uppercase">Risk: {selectedPool?.risk_level || "Moderate"}</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                 {pools.map((pool) => (
                    <div 
                       key={pool.id}
                       onClick={() => setSelectedPoolId(pool.id.toString())}
                       className={`border-2 p-5 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${
                          selectedPoolId === pool.id.toString() 
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" 
                          : "border-white/5 bg-white/5 hover:border-white/10"
                       }`}
                    >
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black uppercase ${
                             pool.category === 'Forex' ? 'bg-blue-500/20 text-blue-500' :
                             pool.category === 'Crypto' ? 'bg-orange-500/20 text-orange-500' :
                             'bg-emerald-500/20 text-emerald-500'
                          }`}>
                             {pool.category.substring(0, 3)}
                          </div>
                          <div>
                             <p className="text-[11px] font-black uppercase tracking-tight">{pool.name}</p>
                             <p className="text-[10px] font-bold text-muted-foreground/60">{pool.current_yield}% Yearly Est.</p>
                          </div>
                       </div>
                       {selectedPoolId === pool.id.toString() && <ShieldCheck className="text-primary" size={20} />}
                    </div>
                 ))}
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Staking Amount</label>
                 <span className="text-[9px] font-bold text-muted-foreground/60">Available: <span className="font-numbers text-foreground">{formatKSh(availableBalance)}</span></span>
              </div>
              <div className="relative">
                 <input 
                    type="number"
                    placeholder="Enter amount to stake..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-2xl font-black font-numbers focus:border-primary transition-all outline-none"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                 />
                 <button 
                  type="button"
                  onClick={() => setAmount(availableBalance.toString())}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 px-3 rounded-lg bg-primary/10 text-primary text-[9px] font-black uppercase hover:bg-primary/20 transition-all"
                 >
                    Max
                 </button>
              </div>
           </div>

           {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500">
                 <AlertCircle size={16} />
                 <span className="text-[11px] font-black uppercase tracking-widest">{error}</span>
              </div>
           )}

           <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <TrendingUp size={18} className="text-emerald-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Est. Daily Accrual</span>
              </div>
              <span className="text-sm font-black font-numbers tracking-tighter text-emerald-500">
                 {formatKSh((Number(amount) * (selectedPool?.current_yield || 0) / 100) / 365)}
              </span>
           </div>

           <button 
              disabled={loading || !amount || Number(amount) <= 0}
              className="w-full bg-primary text-primary-foreground py-5 rounded-2xl text-[12px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
           >
              {loading ? "Processing Ledger..." : "Authorize Allocation"}
              <ArrowRight size={18} />
           </button>
        </form>
      </div>
    </div>
  );
}
