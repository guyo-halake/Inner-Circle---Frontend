import { Landmark } from "lucide-react";
import { Counter } from "./counter";
import { formatKSh } from "@/lib/utils";

interface SummaryCardProps {
  label: string;
  value: number | string;
  subtext?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function SummaryCard({ label, value, subtext, trend }: SummaryCardProps) {
  const isNumeric = typeof value === "number";

  return (
    <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:bg-card/60 transition-all duration-300 before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-br before:from-white/20 before:to-transparent before:content-[''] before:rounded-2xl before:-z-10">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
        <Landmark size={48} className="text-primary" />
      </div>
      
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">
        {label}
      </p>
      
      <div className="flex items-end justify-between relative z-10">
        <div>
          <div className="text-2xl font-black font-numbers tracking-tight text-foreground/90">
            {isNumeric ? (
              <Counter to={value as number} format={(v) => formatKSh(v)} />
            ) : (
              value
            )}
          </div>
          {subtext && (
            <p className="text-[10px] font-bold text-muted-foreground mt-2 flex items-center gap-2 uppercase tracking-tighter opacity-60">
              <span className="w-1 h-1 bg-primary/40 rounded-full" />
              {subtext}
            </p>
          )}
        </div>
        {trend && (
          <div className={`text-[10px] font-black px-3 py-1 rounded-full border ${
            trend.positive 
              ? "bg-green-500/10 text-green-500 border-green-500/20" 
              : "bg-red-500/10 text-red-500 border-red-500/20"
          }`}>
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}
