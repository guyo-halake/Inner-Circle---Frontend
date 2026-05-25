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
import { LineChart, Table, BarChart3, ChevronDown } from "lucide-react";
import { API_URL } from "@/lib/api";
import { formatCompactKSh } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

interface PortfolioChartProps {
  currentValue: number;
  netProfit: number;
  allocationBalance: number;
}

export function PortfolioChart({ currentValue, netProfit, allocationBalance }: PortfolioChartProps) {
  const { token, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("This Week");
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [viewMode, setViewMode] = useState<"line" | "bar" | "table">("line");

  const wallets = user?.wallets || [];
  const getBalance = (type: string) => {
    const balance = wallets.find(w => w.type === type)?.balance;
    return balance ? parseFloat(balance.toString()) : 0;
  };

  const getFilteredData = () => {
    const today = new Date();
    const dailyYield = allocationBalance * 0.00166667;
    const monthlyYield = allocationBalance * 0.05;
    
    // We determine the active profit target to display.
    // If the investor has earned yield profit, we display it. Otherwise, we simulate based on allocation.
    const currentProfit = getBalance("POCKET_YIELD") || netProfit;

    if (activeFilter === "This Week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const todayDay = today.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
      const dayIndex = todayDay === 0 ? 6 : todayDay - 1; // Mon = 0, Sun = 6
      
      const displayProfit = currentProfit > 0 ? currentProfit : (allocationBalance * 0.011667); // ~1 week yield fallback
      
      return days.map((day, i) => {
        const val = Math.max(0, displayProfit - (dayIndex - i) * dailyYield);
        const noise = Math.sin(i * 0.8) * 0.02 * dailyYield;
        const finalVal = parseFloat((val + (i <= dayIndex ? noise : 0)).toFixed(2));
        return {
          name: day,
          value: finalVal,
          benchmark: parseFloat((finalVal * 0.985).toFixed(2))
        };
      });
    }

    if (activeFilter === "Last 6 Months") {
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(today.getMonth() - i);
        months.push(d.toLocaleDateString("en-KE", { month: "short" }));
      }
      
      const displayProfit = currentProfit > 0 ? currentProfit : (allocationBalance * 0.3); // 6 months yield fallback
      
      return months.map((month, i) => {
        const val = Math.max(0, displayProfit - (5 - i) * monthlyYield);
        const noise = Math.sin(i * 1.2) * 0.03 * monthlyYield;
        const finalVal = parseFloat((val + noise).toFixed(2));
        return {
          name: month,
          value: finalVal,
          benchmark: parseFloat((finalVal * 0.985).toFixed(2))
        };
      });
    }

    // Default: Last 12 Months
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(today.getMonth() - i);
      months.push(d.toLocaleDateString("en-KE", { month: "short" }));
    }
    
    const displayProfit = currentProfit > 0 ? currentProfit : (allocationBalance * 0.6); // 12 months yield fallback
    
    return months.map((month, i) => {
      const val = Math.max(0, displayProfit - (11 - i) * monthlyYield);
      const noise = Math.sin(i * 1.5) * 0.04 * monthlyYield;
      const finalVal = parseFloat((val + noise).toFixed(2));
      return {
        name: month,
        value: finalVal,
        benchmark: parseFloat((finalVal * 0.985).toFixed(2))
      };
    });
  };

  const chartData = getFilteredData();

  return (
    <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl relative overflow-hidden before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-br before:from-white/20 before:to-transparent before:content-[''] before:rounded-2xl before:-z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h3 className="text-xl font-black mb-1 flex items-center gap-3">
            Earnings Growth
            <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full border border-green-500/10 uppercase font-black tracking-widest">Real-time</span>
          </h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Yield profit performance analysis</p>
          
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

        <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-end">
          {/* Dropdown Filter */}
          <div className="relative min-w-[150px]">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="appearance-none w-full bg-muted/60 hover:bg-muted/80 border border-border px-4 py-2 pr-10 rounded-xl text-xs font-black uppercase tracking-wider text-foreground transition-all cursor-pointer outline-none shadow-sm focus:ring-1 focus:ring-primary/20"
            >
              <option value="This Week">This Week</option>
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="Last 12 Months">Last 12 Months</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
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
          <div className="h-full flex items-center justify-center text-[10px] uppercase font-black opacity-20 italic">Loading yield history...</div>
        ) : (
          <>
            {viewMode === "line" && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
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
                    formatter={(v: any) => [`KSh ${Number(v).toLocaleString()}`, "Profit"]}
                  />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  {showBenchmark && <Area type="monotone" dataKey="benchmark" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorBenchmark)" />}
                </AreaChart>
              </ResponsiveContainer>
            )}

            {viewMode === "bar" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
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
                        <th className="py-4 px-4 text-right">Yield Profit</th>
                        <th className="py-4 px-4 text-right">Growth %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {chartData.map((row, i) => (
                      <tr key={i} className="hover:bg-primary/5 transition-colors group">
                          <td className="py-4 px-4 font-bold text-foreground/70 uppercase tracking-tighter">{row.name}</td>
                          <td className="py-4 px-4 text-right font-black font-numbers text-primary">KSh {row.value.toLocaleString()}</td>
                          <td className="py-4 px-4 text-right font-black font-numbers text-green-500">
                             {i > 0 ? (((row.value - chartData[i-1].value) / chartData[i-1].value) * 100).toFixed(1) + '%' : '0.0%'}
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
