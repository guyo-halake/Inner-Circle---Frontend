"use client";

import { useState } from "react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { LineChart, Table, BarChart3, TrendingUp } from "lucide-react";

const data = [
  { name: "1 Jan", value: 12000, benchmark: 11800 },
  { name: "5 Jan", value: 12500, benchmark: 11900 },
  { name: "10 Jan", value: 12200, benchmark: 12050 },
  { name: "15 Jan", value: 13000, benchmark: 12100 },
  { name: "20 Jan", value: 13500, benchmark: 12150 },
  { name: "25 Jan", value: 13200, benchmark: 12200 },
  { name: "30 Jan", value: 14500, benchmark: 12300 },
];

const timeFilters = ["1D", "1W", "1M", "3M", "ALL"];

export function PortfolioChart() {
  const [activeFilter, setActiveFilter] = useState("1M");
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [viewMode, setViewMode] = useState<"line" | "bar" | "table">("line");

  return (
    <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
            Portfolio Growth
            <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full border border-green-500/10 uppercase tracking-widest">Real-time</span>
          </h3>
          <p className="text-xs text-muted-foreground">Historical performance analysis</p>
          
          <div className="flex items-center gap-3 mt-4">
             <button 
               onClick={() => setShowBenchmark(!showBenchmark)}
               className={`flex items-center gap-2 px-3 py-1 rounded-md text-[9px] font-bold uppercase transition-all border ${
                 showBenchmark ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted border-transparent text-muted-foreground"
               }`}
             >
               Benchmark NSE Index
             </button>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex bg-muted/50 p-1.5 rounded-xl border">
            {timeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                  activeFilter === filter
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex bg-muted/30 p-1 rounded-xl border border-border/50">
            <button onClick={() => setViewMode("line")} className={`p-2 rounded-lg transition-all ${viewMode === "line" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}><LineChart size={14} /></button>
            <button onClick={() => setViewMode("bar")} className={`p-2 rounded-lg transition-all ${viewMode === "bar" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}><BarChart3 size={14} /></button>
            <button onClick={() => setViewMode("table")} className={`p-2 rounded-lg transition-all ${viewMode === "table" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}><Table size={14} /></button>
          </div>
        </div>
      </div>

      <div className="h-[350px] w-full mt-4">
        {viewMode === "line" && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.05}/>
                  <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} dx={-10} tickFormatter={(v) => `KSh ${v/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: "black", borderRadius: "12px", border: "none" }}
                itemStyle={{ color: "white", fontWeight: "bold", fontSize: 12 }}
                formatter={(v: any) => [`KSh ${Number(v).toLocaleString()}`, "Amount"]}
              />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
              {showBenchmark && <Area type="monotone" dataKey="benchmark" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorBenchmark)" />}
            </AreaChart>
          </ResponsiveContainer>
        )}

        {viewMode === "bar" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} dx={-10} tickFormatter={(v) => `${v/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: "black", borderRadius: "12px", border: "none" }}
                itemStyle={{ color: "white", fontWeight: "bold", fontSize: 12 }}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              {showBenchmark && <Bar dataKey="benchmark" fill="hsl(var(--muted-foreground))" opacity={0.3} radius={[4, 4, 0, 0]} />}
            </BarChart>
          </ResponsiveContainer>
        )}

        {viewMode === "table" && (
          <div className="overflow-x-auto h-full">
             <table className="w-full text-left text-xs">
               <thead className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/50">
                 <tr>
                    <th className="py-3 px-4 font-bold">Timeframe</th>
                    <th className="py-3 px-4 font-bold">Portfolio Value</th>
                    <th className="py-3 px-4 font-bold">Index Value</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border/20">
                 {data.map((row) => (
                   <tr key={row.name} className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 px-4 font-medium">{row.name}</td>
                      <td className="py-3 px-4 font-bold font-numbers">KSh {row.value.toLocaleString()}</td>
                      <td className="py-3 px-4 text-muted-foreground font-numbers">KSh {row.benchmark.toLocaleString()}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
}
