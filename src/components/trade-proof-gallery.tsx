"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";
import { formatKSh } from "@/lib/utils";
import { 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  TrendingDown, 
  ImageIcon, 
  Clock 
} from "lucide-react";

export function TradeProofGallery() {
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProofs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/portfolio/proofs`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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

  if (loading) return <div className="text-[10px] uppercase font-black tracking-widest opacity-30 italic">Loading trade logs...</div>;

  return (
    <div className="space-y-6">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-2">
        <Clock size={12} />
        Recent Trade Proofs
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {proofs.map((proof) => (
          <div key={proof.id} className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-5 shadow-sm hover:border-primary/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${proof.result === 'Profit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {proof.result === 'Profit' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </div>
                <div>
                  <p className="text-xs font-bold">{proof.asset}</p>
                  <p className="text-[9px] font-black uppercase tracking-tighter opacity-50">
                    {new Date(proof.created_at).toLocaleDateString()} at {new Date(proof.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
              <p className={`text-sm font-black ${proof.result === 'Profit' ? 'text-green-500' : 'text-red-500'}`}>
                {proof.result === 'Profit' ? '+' : '-'}{formatKSh(proof.amount)}
              </p>
            </div>
            
            {proof.image_url && (
              <div className="mt-4 rounded-xl overflow-hidden border border-border/40 aspect-video bg-muted/20 relative group-hover:border-primary/20 transition-all">
                 <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <ImageIcon size={40} />
                 </div>
                 {/* In a real app, img tag here points to proof.image_url */}
              </div>
            )}
            
            {proof.note && (
              <p className="mt-3 text-[11px] text-muted-foreground font-medium italic border-l-2 border-primary/20 pl-3">
                "{proof.note}"
              </p>
            )}
          </div>
        ))}
        
        {proofs.length === 0 && (
          <div className="col-span-2 py-20 text-center opacity-30 italic text-xs font-bold">
            No trades posted by the team yet today.
          </div>
        )}
      </div>
    </div>
  );
}
