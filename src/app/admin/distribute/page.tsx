"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import { API_URL } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  CheckCircle2, 
  TrendingUp, 
  FileJson, 
  Coins,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { formatKSh } from "@/lib/utils";

export default function YieldDistributorPage() {
  const { token, user } = useAuthStore();
  const router = useRouter();
  const [pools, setPools] = useState<any[]>([]);
  const [selectedPoolId, setSelectedPoolId] = useState("");
  const [mode, setMode] = useState<"csv" | "manual">("manual");
  const [csvData, setCsvData] = useState("");
  const [manualProfit, setManualProfit] = useState("");
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState({ success: false, message: "" });

  useEffect(() => {
    if (user) {
      const role = user.role?.toLowerCase();
      if (role !== "admin" && role !== "developer") {
        router.replace("/dashboard");
      }
    }
  }, [user, router]);

  useEffect(() => {
    const fetchPools = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${API_URL}/api/admin/pools`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setPools(data);
        if (data.length > 0) setSelectedPoolId(data[0].id.toString());
      } catch (err) {
        console.error("Failed to load pools", err);
      }
    };
    fetchPools();
  }, [token]);

  const handleDistribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "csv" && !csvData.trim()) return;
    if (mode === "manual" && !manualProfit) return;
    
    setProcessing(true);
    setStatus({ success: false, message: "" });
    
    try {
      const payload = mode === "csv" 
        ? csvData 
        : `Symbol,Profit\nManualProfit,${manualProfit}`;
      
      const response = await fetch(`${API_URL}/api/admin/import-trades`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ csvData: payload, poolId: selectedPoolId })
      });
      const data = await response.json();
      setStatus({ success: response.ok, message: data.message || data.error });
      if (response.ok) {
        setCsvData("");
        setManualProfit("");
      }
    } catch (err) {
      setStatus({ success: false, message: "Network error during distribution." });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="mb-2">
          <Link href="/admin" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-semibold">
            &larr; Back to Admin Console
          </Link>
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Yield Distributor</h1>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-40 mt-1">
             Distribute profit returns proportionally to users in a target pool
          </p>
        </div>

        <div className="bg-card/30 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 space-y-6">
           <form onSubmit={handleDistribute} className="space-y-6">
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Target Yield Pool</label>
                 <select 
                   className="w-full bg-background border border-primary/20 rounded-2xl p-4 text-sm font-black uppercase outline-none focus:border-primary transition-all"
                   value={selectedPoolId}
                   onChange={(e) => setSelectedPoolId(e.target.value)}
                   required
                 >
                    {pools.map(pool => (
                       <option key={pool.id} value={pool.id}>{pool.name} ({pool.category})</option>
                    ))}
                 </select>
              </div>

              {/* Mode Toggle */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Distribution Method</label>
                <div className="flex gap-2 bg-background/50 border border-white/5 rounded-2xl p-1">
                  <button
                    type="button"
                    onClick={() => setMode("manual")}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      mode === "manual" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Coins size={14} />
                    Manual Profit Entry
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("csv")}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      mode === "csv" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <FileJson size={14} />
                    MT5 CSV Log Paste
                  </button>
                </div>
              </div>

              {/* Input Area */}
              {mode === "csv" ? (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">MT5 CSV Data</label>
                  <textarea 
                     placeholder="Symbol,Type,Volume,Price,Profit&#10;GOLD,buy,1.0,2030.50,1450.00"
                     className="w-full bg-background/50 border border-white/5 rounded-2xl p-5 text-[10px] font-mono h-48 focus:border-primary/40 transition-colors outline-none leading-relaxed"
                     value={csvData}
                     onChange={(e) => setCsvData(e.target.value)}
                     required
                  />
                  <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1 opacity-50">
                     Paste raw CSV columns containing Symbol and Profit fields.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Total Profit (KSh)</label>
                  <input 
                     type="number"
                     placeholder="e.g. 50000"
                     className="w-full bg-background/50 border border-white/5 rounded-2xl p-4 text-sm font-black focus:border-primary/40 transition-colors outline-none"
                     value={manualProfit}
                     onChange={(e) => setManualProfit(e.target.value)}
                     required
                  />
                  <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1 opacity-50">
                     Enter the total profit to distribute proportionally to members based on stakes.
                  </p>
                </div>
              )}

              <button 
                 type="submit"
                 disabled={processing}
                 className="w-full bg-primary text-primary-foreground py-5 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
              >
                 {processing ? <Loader2 className="animate-spin" /> : <TrendingUp size={18} />}
                 Distribute Yield Returns
              </button>

              {status.message && (
                 <div className={`p-5 rounded-2xl flex items-center gap-4 border ${status.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                    {status.success ? <CheckCircle2 /> : <AlertTriangle />}
                    <span className="text-[11px] font-black uppercase tracking-widest">{status.message}</span>
                 </div>
              )}
           </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
