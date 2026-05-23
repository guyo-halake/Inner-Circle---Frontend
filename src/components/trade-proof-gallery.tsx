"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";
import { formatKSh } from "@/lib/utils";
import { 
  CheckCircle2, 
  ImageIcon, 
  Clock,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export function TradeProofGallery() {
  const { token } = useAuthStore();
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProofs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/portfolio/proofs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setProofs(data);
      } catch (error) {
        console.error("Failed to load trades", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProofs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          <Clock size={12} className="text-primary" />
          Live Trade Execution Feed
        </h3>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
           <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Live Terminal</span>
        </div>
      </div>
      
      <div className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-br before:from-white/10 before:to-transparent before:content-[''] before:rounded-2xl before:-z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-white/5">
                <th className="py-3 px-6 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Asset / Timestamp</th>
                <th className="py-3 px-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Protocol</th>
                <th className="py-3 px-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Result (KSh)</th>
                <th className="py-3 px-6 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center opacity-20 italic text-[10px] font-black uppercase tracking-widest">
                    Initializing secure feed...
                  </td>
                </tr>
              ) : proofs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center opacity-20 italic text-[10px] font-black uppercase tracking-widest">
                    Awaiting next market execution cycle...
                  </td>
                </tr>
              ) : (
                proofs.map((proof) => (
                  <tr key={proof.id} className="hover:bg-white/5 transition-all group cursor-pointer">
                    <td className="py-2 px-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black tracking-tight text-foreground">{proof.asset}</span>
                        <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">
                          {new Date(proof.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-center">
                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-muted-foreground uppercase">MT5-Bridge</span>
                    </td>
                    <td className="py-2 px-4 text-right">
                      <span className={`text-[10px] font-black font-numbers tracking-tighter ${proof.result === 'Profit' ? 'text-green-400' : 'text-red-400'}`}>
                        {proof.result === 'Profit' ? '+' : '-'}{formatKSh(proof.amount).replace('KSh', '')}
                      </span>
                    </td>
                    <td className="py-2 px-6 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {proof.image_url ? (
                          <div className="w-6 h-4 rounded bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:bg-primary/40 transition-all">
                            <ImageIcon size={8} className="text-primary" />
                          </div>
                        ) : (
                          <CheckCircle2 size={10} className="text-muted-foreground/30" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
