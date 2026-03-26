"use client";

import { Landmark } from "lucide-react";

interface SummaryCardProps {
  label: string;
  value: string;
  subtext?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function SummaryCard({ label, value, subtext, trend }: SummaryCardProps) {
  return (
    <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:bg-card/60 transition-all duration-300">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
        <Landmark size={48} className="text-primary" />
      </div>
      
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
        {label}
      </p>
      
      <div className="flex items-end justify-between relative z-10">
        <div>
          <p className="text-2xl font-extrabold font-numbers tracking-tight text-foreground/90">
            {value}
          </p>
          {subtext && (
            <p className="text-[11px] font-medium text-muted-foreground mt-1.5 flex items-center gap-1.5 italic">
              <span className="w-1 h-1 bg-primary/40 rounded-full" />
              {subtext}
            </p>
          )}
        </div>
        {trend && (
          <div className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
            trend.positive 
              ? "bg-green-500/10 text-green-600 border-green-500/20" 
              : "bg-red-500/10 text-red-600 border-red-500/20"
          }`}>
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}
