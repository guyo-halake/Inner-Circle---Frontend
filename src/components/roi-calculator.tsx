"use client";

import { useState, useEffect } from "react";
import { formatKSh } from "@/lib/utils";

export function ROICalculator() {
  const [investment, setInvestment] = useState(1000000); // 1M KSh
  const [duration, setDuration] = useState(12); // 12 months
  const [expectedValue, setExpectedValue] = useState(0);

  const monthlyReturn = 0.035; // 3.5% monthly return

  useEffect(() => {
    // A simple compound interest formula for estimation
    const total = investment * Math.pow(1 + monthlyReturn, duration);
    setExpectedValue(total);
  }, [investment, duration]);

  const profit = expectedValue - investment;

  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-12 items-center bg-card p-10 rounded-2xl border shadow-sm">
          <div className="flex-1 w-full space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">Project returns</h2>
              <p className="text-muted-foreground italic">Use our ROI calculator to see how your portfolio could grow.</p>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span>Investment Amount</span>
                  <span className="text-primary font-bold text-lg">{formatKSh(investment)}</span>
                </div>
                <input 
                  type="range" 
                  min="100000" 
                  max="50000000" 
                  step="100000"
                  value={investment}
                  onChange={(e) => setInvestment(Number(e.target.value))}
                  className="w-full transition-all cursor-pointer accent-primary h-1 bg-muted rounded-full"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span>Investment Duration</span>
                  <span className="text-primary font-bold text-lg">{duration} months</span>
                </div>
                <div className="flex gap-4">
                  {[6, 12, 24].map((m) => (
                    <button
                      key={m}
                      onClick={() => setDuration(m)}
                      className={`flex-1 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                        duration === m 
                          ? "bg-primary text-primary-foreground border-primary" 
                          : "bg-background hover:bg-muted"
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full flex flex-col items-center justify-center p-8 bg-primary/5 rounded-xl border border-primary/10">
            <div className="text-center space-y-2 mb-8">
              <p className="text-sm uppercase tracking-widest text-muted-foreground font-medium">Expected Value</p>
              <h3 className="text-4xl md:text-5xl font-bold text-primary font-numbers">
                {formatKSh(expectedValue)}
              </h3>
            </div>

            <div className="w-full space-y-6 pt-6 border-t border-primary/10">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Investment</span>
                <span className="font-numbers font-medium">{formatKSh(investment)}</span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span className="text-sm text-green-500">Estimated Profit</span>
                <span className="text-green-500 font-numbers">+{formatKSh(profit)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">ROI Percentage</span>
                <span className="text-primary font-numbers font-bold">+{( (profit/investment) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
