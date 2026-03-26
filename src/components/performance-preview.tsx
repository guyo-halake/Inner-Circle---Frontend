"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { formatCompactKSh } from "@/lib/utils";

const data = [
  { name: "Jan", value: 100 },
  { name: "Feb", value: 108 },
  { name: "Mar", value: 115 },
  { name: "Apr", value: 112 },
  { name: "May", value: 125 },
  { name: "Jun", value: 132 },
  { name: "Jul", value: 145 },
  { name: "Aug", value: 152 },
];

export function PerformancePreview() {
  return (
    <section id="performance" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-card p-8 rounded-xl border shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Performance</h2>
            <p className="text-muted-foreground">Historical growth of the trading pool</p>
          </div>

          <div className="h-[300px] w-full mb-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-t pt-8">
            <div>
              <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Total Return</p>
              <p className="text-3xl font-bold font-numbers text-primary">+52.4%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Pool Size</p>
              <p className="text-3xl font-bold font-numbers text-primary">{formatCompactKSh(420000000)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Active Investors</p>
              <p className="text-3xl font-bold font-numbers text-primary">1,240</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
