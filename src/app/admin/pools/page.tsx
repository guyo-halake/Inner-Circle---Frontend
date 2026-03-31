"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  Plus, 
  TrendingUp, 
  ShieldAlert, 
  Trash2, 
  Edit3, 
  BarChart, 
  History,
  DollarSign,
  Activity
} from "lucide-react";
import { formatKSh } from "@/lib/utils";

export default function AdminPoolsPage() {
  const { token } = useAuthStore();
  const [pools, setPools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Forex",
    description: "",
    initial_yield: "0",
    risk_level: "Moderate"
  });

  const fetchPools = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/pools`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setPools(data);
    } catch (err) {
      console.error("Failed to load pools", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/admin/pools`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setShowModal(false);
        fetchPools();
      }
    } catch (err) {
      console.error("Failed to create pool", err);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Pool Architect</h1>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-40 mt-1">
             Manage institutional capital allocation pools
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl flex items-center gap-2 text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity shadow-xl shadow-primary/20"
        >
          <Plus size={16} /> Forge New Pool
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 group">
         {pools.map((pool) => (
           <div key={pool.id} className="border border-white/5 bg-card/20 backdrop-blur-3xl p-8 hover:bg-card/40 transition-all group/card relative overflow-hidden flex flex-col justify-between h-[320px]">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/card:scale-110 group-hover/card:rotate-6 transition-all">
                 <Activity size={100} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                         <BarChart size={20} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{pool.category}</span>
                   </div>
                   <div className={`text-[9px] font-black px-2.5 py-1 rounded-full border ${
                      pool.risk_level === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      pool.risk_level === 'Moderate' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                      'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                   }`}>
                      {pool.risk_level} RISK
                   </div>
                </div>

                <h3 className="text-xl font-black tracking-tight mb-2 uppercase italic">{pool.name}</h3>
                <p className="text-[11px] text-muted-foreground font-medium mb-6 line-clamp-2 leading-relaxed opacity-60">
                   {pool.description || "Institutional yield allocation vehicle."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                 <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 block mb-1">Total Staked</span>
                    <span className="text-lg font-black font-numbers tracking-tighter">{formatKSh(pool.total_staked)}</span>
                 </div>
                 <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 block mb-1">Current Yield</span>
                    <span className="text-lg font-black font-numbers tracking-tighter text-primary">+{pool.current_yield}%</span>
                 </div>
              </div>

              <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                 <button className="p-2 hover:text-primary transition-colors"><Edit3 size={16} /></button>
                 <button className="p-2 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
           </div>
         ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card/90 border border-white/10 w-full max-w-lg rounded-3xl p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
             <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 italic">Configure New Asset Pool</h2>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Pool Identity</label>
                   <input 
                      type="text" 
                      placeholder="e.g. BTC Aggressive Alpha"
                      className="w-full bg-background/50 border border-white/10 rounded-2xl p-4 text-sm focus:border-primary transition-colors outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                   />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Asset Category</label>
                      <select 
                        className="w-full bg-background/50 border border-white/10 rounded-2xl p-4 text-sm focus:border-primary transition-colors outline-none"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      >
                         <option>Stocks</option>
                         <option>MMF</option>
                         <option>Forex</option>
                         <option>Crypto</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Risk Tier</label>
                      <select 
                        className="w-full bg-background/50 border border-white/10 rounded-2xl p-4 text-sm focus:border-primary transition-colors outline-none"
                        value={formData.risk_level}
                        onChange={(e) => setFormData({...formData, risk_level: e.target.value})}
                      >
                         <option>Conservative</option>
                         <option>Moderate</option>
                         <option>High</option>
                      </select>
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Objective / Notes</label>
                   <textarea 
                      className="w-full bg-background/50 border border-white/10 rounded-2xl p-4 text-sm focus:border-primary transition-colors outline-none h-24"
                      placeholder="Strategic goals for this liquidity pool..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                   />
                </div>
                <div className="flex gap-4 pt-4">
                   <button 
                     type="button" 
                     onClick={() => setShowModal(false)}
                     className="flex-1 py-4 text-[11px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                   >
                      Abort
                   </button>
                   <button 
                     type="submit"
                     className="flex-1 bg-primary text-primary-foreground py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 transition-opacity"
                   >
                      Validate Pool
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
