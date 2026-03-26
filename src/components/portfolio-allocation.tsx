"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Stocks", value: 35, color: "#3B82F6" },         // Blue
  { name: "MMF (Money Market)", value: 25, color: "#10B981" }, // Green
  { name: "Forex Trading", value: 25, color: "#FACC15" },      // Yellow
  { name: "Crypto Trading", value: 15, color: "#F97316" },      // Orange
];

export function PortfolioAllocation() {
  return (
    <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-xl h-full flex flex-col group">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3 mb-8">
         <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
         Portfolio Breakdown
      </h3>
      
      <div className="flex-grow flex flex-col items-center justify-center -mt-6">
        <div className="relative w-full h-[240px]">
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Total</span>
             <span className="text-xl font-black font-numbers tracking-tight">100%</span>
          </div>
          
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={92}
                paddingAngle={6}
                dataKey="value"
                strokeWidth={0}
                animationBegin={0}
                animationDuration={1500}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "rgba(0,0,0,0.9)", 
                  border: "none", 
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.5)"
                }}
                itemStyle={{ color: "#fff", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full grid grid-cols-2 gap-3 mt-8">
          {data.map((item, index) => (
             <div 
               key={index} 
               className="flex flex-col gap-1 p-3 rounded-xl border border-border/20 bg-muted/20 hover:bg-muted/40 transition-all group/item"
             >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-extrabold text-foreground/80 tracking-tight group-hover/item:text-primary transition-colors">{item.name}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black font-numbers">{item.value}%</span>
                  <div className="w-8 h-[2px] rounded-full bg-border/40 overflow-hidden">
                     <div className="h-full bg-primary/40" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                  </div>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
