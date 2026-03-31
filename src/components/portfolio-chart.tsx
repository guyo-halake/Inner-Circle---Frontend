import { useState, useEffect } from "react";
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
import { API_URL } from "@/lib/api";
import { formatCompactKSh } from "@/lib/utils";

const timeFilters = ["1D", "1W", "1M", "3M", "ALL"];

export function PortfolioChart() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("1M");
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [viewMode, setViewMode] = useState<"line" | "bar" | "table">("line");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/api/portfolio/history`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await response.json();
        
        // Format dates for display
        const formattedData = data.map((item: any) => ({
          ...item,
          name: new Date(item.date).toLocaleDateString("en-KE", { day: "numeric", month: "short" }),
          benchmark: item.value * 0.98 // Mocking benchmark for now based on value
        }));
        
        setHistory(formattedData);
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const data = history.length > 0 ? history : [
    { name: "N/A", value: 0, benchmark: 0 }
  ];

  return (
    <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl relative overflow-hidden before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-br before:from-white/20 before:to-transparent before:content-[''] before:rounded-2xl before:-z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h3 className="text-xl font-black mb-1 flex items-center gap-3">
            Portfolio Growth
            <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full border border-green-500/10 uppercase font-black tracking-widest">Real-time</span>
          </h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Historical performance analysis</p>
          
          <div className="flex items-center gap-3 mt-4">
             <button 
               onClick={() => setShowBenchmark(!showBenchmark)}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border ${
                 showBenchmark ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted border-transparent text-muted-foreground"
               }`}
             >
               Benchmark NSE Index
             </button>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex bg-muted/50 p-1 rounded-xl border">
            {timeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${
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
        {loading ? (
          <div className="h-full flex items-center justify-center text-[10px] uppercase font-black opacity-20 italic">Loading performance history...</div>
        ) : (
          <>
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
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: "bold" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: "bold" }} dx={-10} tickFormatter={(v) => `KSh ${v >= 1000 ? v/1000 + 'k' : v}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "rgba(0,0,0,0.9)", borderRadius: "12px", border: "none", backdropFilter: "blur(10px)" }}
                    itemStyle={{ color: "white", fontWeight: "black", fontSize: 11, textTransform: "uppercase" }}
                    formatter={(v: any) => [`KSh ${Number(v).toLocaleString()}`, "Amount"]}
                  />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  {showBenchmark && <Area type="monotone" dataKey="benchmark" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorBenchmark)" />}
                </AreaChart>
              </ResponsiveContainer>
            )}

            {viewMode === "bar" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: "bold" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: "bold" }} dx={-10} tickFormatter={(v) => `${v >= 1000 ? v/1000 + 'k' : v}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "rgba(0,0,0,0.9)", borderRadius: "12px", border: "none" }}
                    itemStyle={{ color: "white", fontWeight: "black", fontSize: 11 }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  {showBenchmark && <Bar dataKey="benchmark" fill="hsl(var(--muted-foreground))" opacity={0.3} radius={[4, 4, 0, 0]} />}
                </BarChart>
              </ResponsiveContainer>
            )}

            {viewMode === "table" && (
              <div className="overflow-x-auto h-full px-2">
                <table className="w-full text-left text-[11px]">
                  <thead className="text-[9px] uppercase font-black tracking-[0.2em] text-muted-foreground border-b border-border/50">
                    <tr>
                        <th className="py-4 px-4">Period</th>
                        <th className="py-4 px-4 text-right">Portfolio Value</th>
                        <th className="py-4 px-4 text-right">Growth %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {data.map((row, i) => (
                      <tr key={i} className="hover:bg-primary/5 transition-colors group">
                          <td className="py-4 px-4 font-bold text-foreground/70 uppercase tracking-tighter">{row.name}</td>
                          <td className="py-4 px-4 text-right font-black font-numbers text-primary">KSh {row.value.toLocaleString()}</td>
                          <td className="py-4 px-4 text-right font-black font-numbers text-green-500">
                             {i > 0 ? (((row.value - data[i-1].value) / data[i-1].value) * 100).toFixed(1) + '%' : '0.0%'}
                          </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
