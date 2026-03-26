"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function PayoutCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 14, mins: 22, secs: 31 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-primary text-primary-foreground p-8 rounded-xl shadow-xl flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-sm font-medium opacity-80 uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Next Payout
          </h3>
          <p className="text-xs opacity-60 mt-1">Expected: 30 Mar, 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-3xl font-bold font-numbers">{timeLeft.days}</p>
          <p className="text-[10px] uppercase font-medium opacity-60">Days</p>
        </div>
        <div>
          <p className="text-3xl font-bold font-numbers">{timeLeft.hours}</p>
          <p className="text-[10px] uppercase font-medium opacity-60">Hours</p>
        </div>
        <div>
          <p className="text-3xl font-bold font-numbers">{timeLeft.mins}</p>
          <p className="text-[10px] uppercase font-medium opacity-60">Mins</p>
        </div>
        <div>
          <p className="text-3xl font-bold font-numbers">{timeLeft.secs}</p>
          <p className="text-[10px] uppercase font-medium opacity-60">Secs</p>
        </div>
      </div>

      <button className="mt-10 w-full bg-white text-black py-2.5 rounded-lg text-sm font-bold hover:bg-white/90 transition-colors shadow-lg">
        Set Alert
      </button>
    </div>
  );
}
