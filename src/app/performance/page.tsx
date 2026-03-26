"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { PortfolioChart } from "@/components/portfolio-chart";
import { SummaryCard } from "@/components/summary-card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LineChart, Line, Legend } from "recharts";
import { ReturnsHeatmap } from "@/components/returns-heatmap";
import { Download, TrendingUp } from "lucide-react";
import { usePortfolioData } from "@/hooks/use-portfolio-data";
import { formatKSh } from "@/lib/utils";

const monthlyPerformance = [
  { month: "Jan", return: 4.2 },
  { month: "Feb", return: 2.8 },
  { month: "Mar", return: -1.5 },
  { month: "Apr", return: 5.1 },
  { month: "May", return: 3.4 },
  { month: "Jun", return: 4.8 },
  { month: "Jul", return: 2.1 },
  { month: "Aug", return: -0.8 },
  { month: "Sep", return: 3.2 },
  { month: "Oct", return: 4.5 },
  { month: "Nov", return: 2.9 },
  { month: "Dec", return: 5.4 },
];

export default function PerformancePage() {
  const { data: portfolio } = usePortfolioData();

  const totalReturnPercent = portfolio?.totalInvestment !== 0 
    ? ((Number(portfolio?.netProfit || 0) / Number(portfolio?.totalInvestment || 1)) * 100).toFixed(1) + "%"
    : "0.0%";

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Performance</h1>
            <p className="text-muted-foreground">Comprehensive analytics and historical growth metrics.</p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4" />
            Export Performance PDF
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard label="Cumulative Return" value={totalReturnPercent} />
          <SummaryCard label="Net Profit" value={formatKSh(Number(portfolio?.netProfit || 0))} />
          <SummaryCard label="Highest Monthly Gain" value="+5.4%" subtext="December 2025" />
          <SummaryCard label="Max Drawdown" value="-3.2%" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex bg-muted p-1 rounded-xl w-full md:w-auto">
            {["1D", "1W", "1M", "1Y", "ALL"].map((range) => (
              <button 
                key={range}
                className={`flex-1 md:flex-none px-6 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  range === "1Y" ? "bg-background shadow-sm" : "hover:text-primary"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 p-2 border rounded-xl w-full md:w-auto">
            <input type="date" className="bg-transparent text-sm focus:outline-none flex-1" />
            <span className="text-sm text-muted-foreground">to</span>
            <input type="date" className="bg-transparent text-sm focus:outline-none flex-1" />
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity">
              Apply
            </button>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <h3 className="text-xl font-bold">Portfolio Growth vs Benchmarks</h3>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-primary" defaultChecked />
                <span className="text-xs font-medium">InnerCircle Pool</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-secondary" />
                <span className="text-xs font-medium text-muted-foreground">NSE 20 Index</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-secondary" />
                <span className="text-xs font-medium text-muted-foreground">91-Day T-Bill</span>
              </label>
            </div>
          </div>
          <PortfolioChart />
        </div>

        <ReturnsHeatmap />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-card border rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-8">Monthly Performance Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b">
                  <tr>
                    <th className="pb-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Month</th>
                    <th className="pb-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Return %</th>
                    <th className="pb-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-numbers">
                  {monthlyPerformance.map((item) => (
                    <tr key={item.month} className="hover:bg-accent/50 transition-colors">
                      <td className="py-4 font-sans font-medium">{item.month} 2025</td>
                      <td className={`py-4 font-medium ${item.return >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {item.return >= 0 ? `+${item.return}%` : `${item.return}%`}
                      </td>
                      <td className="py-4 font-sans">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.return >= 0 ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
                        }`}>
                          {item.return >= 0 ? "Profit" : "Loss"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-1 bg-card border rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-8">Monthly Return Chart</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyPerformance}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                    formatter={(value: any) => [`${value}%`, "Return"]}
                  />
                  <Bar dataKey="return">
                    {monthlyPerformance.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.return >= 0 ? "hsl(var(--primary))" : "hsl(var(--destructive))"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
