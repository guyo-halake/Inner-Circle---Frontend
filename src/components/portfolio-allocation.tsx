"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
  { name: "Forex", value: 45, color: "hsl(var(--primary))" },
  { name: "Stocks", value: 30, color: "hsl(var(--muted-foreground))" },
  { name: "Funds", value: 25, color: "hsl(var(--muted))" },
];

export function PortfolioAllocation() {
  return (
    <div className="bg-card border rounded-xl p-8 shadow-sm">
      <h3 className="text-xl font-bold mb-8">Portfolio Allocation</h3>
      <div className="h-[250px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                borderColor: "hsl(var(--border))",
                borderRadius: "8px"
              }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number) => [`${value}%`, "Allocation"]}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold font-numbers">100%</span>
          <span className="text-xs text-muted-foreground uppercase">Total</span>
        </div>
      </div>
      <div className="mt-8 space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-medium">{item.name}</span>
            </div>
            <span className="font-numbers">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
