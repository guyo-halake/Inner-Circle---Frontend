"use client";

import { Info, ShieldAlert } from "lucide-react";
import { formatKSh } from "@/lib/utils";

export function TaxCard({ netProfit }: { netProfit: number }) {
  const whtEstimate = netProfit * 0.15; // 15% Withholding Tax

  return (
    <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
        <ShieldAlert size={80} className="text-primary" />
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Info size={16} className="text-primary" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Tax Estimation</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Est. Withholding Tax (WHT)</p>
          <p className="text-xl font-bold font-numbers text-orange-500">{formatKSh(whtEstimate)}</p>
        </div>
        
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-1">Effective Yield (Net of Tax)</p>
          <p className="text-xl font-bold font-numbers text-green-500">
            {formatKSh(netProfit - whtEstimate)}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-[10px] text-muted-foreground/60 italic">
        <p>*Auto-calculated based on KRA 15% compliance</p>
      </div>
    </div>
  );
}
