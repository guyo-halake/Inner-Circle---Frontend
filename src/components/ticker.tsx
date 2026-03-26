"use client";

import { useEffect, useState } from "react";

const returns = [
  { pair: "USD/KES", change: "+0.002%", time: "just now" },
  { pair: "EUR/KES", change: "+0.0015%", time: "2m ago" },
  { pair: "GOLD/KES", change: "+0.0041%", time: "5m ago" },
  { pair: "BTC/KES", change: "+0.012%", time: "8m ago" },
  { pair: "GBP/KES", change: "-0.0012%", time: "10m ago" },
];

export function Ticker() {
  return (
    <div className="bg-primary/10 border-b border-primary/20 py-1.5 overflow-hidden whitespace-nowrap">
      <div className="flex animate-marquee gap-12 items-center">
        {[...returns, ...returns].map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-[10px] md:text-xs font-medium">
            <span className="text-muted-foreground uppercase">{item.pair}</span>
            <span className={item.change.startsWith('+') ? "text-green-500" : "text-red-500"}>
              {item.change}
            </span>
            <span className="text-[10px] text-muted-foreground/50 italic">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
