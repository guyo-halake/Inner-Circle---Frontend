"use client";

import { useState } from "react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";

const data = [
  { name: "1 Jan", value: 12000 },
  { name: "5 Jan", value: 12500 },
  { name: "10 Jan", value: 12200 },
  { name: "15 Jan", value: 13000 },
  { name: "20 Jan", value: 13500 },
  { name: "25 Jan", value: 13200 },
  { name: "30 Jan", value: 14500 },
];

const timeFilters = ["1D", "1W", "1M", "3M", "ALL"];

export function PortfolioChart() {
  const [activeFilter, setActiveFilter] = useState("1M");

  return (
    <div className="bg-card border rounded-xl p-8 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h3 className="text-xl font-bold mb-1">Portfolio Value</h3>
          <p className="text-sm text-muted-foreground">Real-time growth of your investment</p>
        </div>
        <div className="flex bg-muted p-1 rounded-lg">
          {timeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                activeFilter === filter
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              dx={-15}
              tickFormatter={(value) => `$${value/1000}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                borderColor: "hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
              }}
              itemStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Value"]}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorValue)" 
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
