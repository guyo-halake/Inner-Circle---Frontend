"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  Terminal, 
  Upload, 
  CheckCircle2, 
  TrendingUp, 
  FileJson, 
  MessageSquare,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { formatKSh } from "@/lib/utils";

export default function YieldDistributorPage() {
  const { token } = useAuthStore();
  const [pools, setPools] = useState<any[]>([]);
  const [selectedPoolId, setSelectedPoolId] = useState("");
  const [csvData, setCsvData] = useState("");
  const [logText, setLogText] = useState("");
  const [detectedProfit, setDetectedProfit] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState({ success: false, message: "" });

  useEffect(() => {
    const fetchPools = async () => {
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

  const handleParseLogs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/parse-logs`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ text: logText })
      });
      const data = await response.json();
      if (data.detectedProfit) setDetectedProfit(data.detectedProfit);
    } catch (err) {
      console.error("Parsing failed", err);
    }
  };

  const handleDistribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvData && !detectedProfit) return;
    
    setProcessing(true);
    setStatus({ success: false, message: "" });
    
    try {
      // If we used the log parser, we create a mock CSV for the same endpoint or build a specialized one
      // For now, assume CSV data if provided, otherwise create a one-line CSV from log profit
      const payload = csvData ? csvData : `Symbol,Profit\nLogParsed,${detectedProfit}`;
      
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
    } catch (err) {
      setStatus({ success: false, message: "Network error during distribution." });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">Yield Distributed</h1>
        <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-40 mt-1">
           Execute proportional yield distribution cycles across liquidity pools
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
           <div className="bg-card/30 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 relative overflow-hidden h-full">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <FileJson size={20} />
                 </div>
                 <h2 className="text-lg font-black uppercase tracking-tighter">CSV Ingestion (MT5 Terminal)</h2>
              </div>
              <textarea 
                 placeholder="Symbol,Type,Volume,Price,Profit\nGOLD,buy,1.0,2030.50,1450.00"
                 className="w-full bg-background/50 border border-white/5 rounded-2xl p-6 text-[10px] font-numbers h-64 focus:border-primary/40 transition-colors outline-none leading-relaxed"
                 value={csvData}
                 onChange={(e) => setCsvData(e.target.value)}
              />
              <p className="text-[9px] font-bold text-muted-foreground uppercase mt-4 opacity-50">
                 Upload or paste the raw CSV export from the trading terminal (MetaTrader 5)
              </p>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-card/30 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 relative overflow-hidden h-full">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <MessageSquare size={20} />
                 </div>
                 <h2 className="text-lg font-black uppercase tracking-tighter">Text Log Parser (WhatsApp/Telegram)</h2>
              </div>
              <textarea 
                 placeholder="Paste a trade signal or manual profit log here..."
                 className="w-full bg-background/50 border border-white/5 rounded-2xl p-6 text-[10px] h-32 focus:border-primary/40 transition-colors outline-none italic leading-relaxed"
                 value={logText}
                 onChange={(e) => setLogText(e.target.value)}
              />
              <button 
                onClick={handleParseLogs}
                className="mt-4 w-full py-3 border border-blue-500/20 text-blue-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500/5 transition-colors"
              >
                 Attempt Log Extraction
              </button>

              {detectedProfit !== null && (
                <div className="mt-6 flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">Extracted Profit</span>
                      <span className="text-xl font-numbers font-black">{formatKSh(detectedProfit)}</span>
                   </div>
                   <CheckCircle2 className="text-emerald-500" size={24} />
                </div>
              )}
           </div>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-3xl p-10 mt-10">
         <form onSubmit={handleDistribute} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Target Yield Pool</label>
                  <select 
                    className="w-full bg-background border border-primary/20 rounded-2xl p-5 text-sm font-black uppercase outline-none focus:border-primary transition-all"
                    value={selectedPoolId}
                    onChange={(e) => setSelectedPoolId(e.target.value)}
                    required
                  >
                     {pools.map(pool => (
                        <option key={pool.id} value={pool.id}>{pool.name} ({pool.category})</option>
                     ))}
                  </select>
               </div>
               <button 
                  type="submit"
                  disabled={processing || (!csvData && detectedProfit === null)}
                  className="w-full bg-primary text-primary-foreground py-5 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale transition-all hover:scale-[1.02] active:scale-95"
               >
                  {processing ? <Loader2 className="animate-spin" /> : <TrendingUp size={18} />}
                  Execute Proportional Distribution Cycle
               </button>
            </div>

            {status.message && (
               <div className={`p-6 rounded-2xl flex items-center gap-4 border ${status.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                  {status.success ? <CheckCircle2 /> : <AlertTriangle />}
                  <span className="text-[11px] font-black uppercase tracking-widest">{status.message}</span>
               </div>
            )}
         </form>
      </div>
    </div>
  );
}
