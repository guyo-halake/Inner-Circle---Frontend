"use client";

import { useState, useEffect } from "react";
import { formatKSh } from "@/lib/utils";
import { motion } from "framer-motion";

export function ROICalculator() {
  const [investment, setInvestment] = useState(1000000); // Default to 1M KSh
  const [duration, setDuration] = useState(12); // Default to 12 months
  const [expectedValue, setExpectedValue] = useState(0);

  const monthlyRate = 0.05; // 5% simple monthly return (30% per 6 months)
  const dailyRate = monthlyRate / 30; // ~0.1667% daily return

  useEffect(() => {
    // Linear simple interest calculation: Principal * (1 + (Duration * Monthly Rate))
    const total = investment * (1 + (duration * monthlyRate));
    setExpectedValue(total);
  }, [investment, duration]);

  const profit = expectedValue - investment;
  const monthlyProfit = investment * monthlyRate;
  const dailyProfit = investment * dailyRate;

  const profitPercent = expectedValue > 0 ? (profit / expectedValue) * 100 : 0;
  const principalPercent = expectedValue > 0 ? (investment / expectedValue) * 100 : 100;

  const presets = [100000, 500000, 1000000, 5000000, 10000000, 50000000];

  return (
    <div className="py-24 bg-background" id="roi-calculator">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-12 items-stretch bg-card p-8 md:p-10 rounded-3xl border border-border/60 shadow-lg relative overflow-hidden"
        >
          <div className="flex-1 w-full flex flex-col justify-between space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-3 tracking-tight">Capital Growth Simulator</h2>
              <p className="text-muted-foreground text-sm">Simulate performance growth over your preferred horizon with simple interest allocations.</p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-semibold gap-4">
                  <span className="text-muted-foreground">Allocation Amount</span>
                  
                  {/* Interactive Custom Input Field */}
                  <div className="flex items-center gap-1.5 border border-input rounded-xl px-3 py-1.5 bg-background shadow-sm hover:border-primary/50 transition-colors">
                    <span className="text-muted-foreground font-bold text-xs">KSh</span>
                    <input
                      type="text"
                      value={investment === 0 ? "" : investment.toLocaleString("en-US")}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setInvestment(Number(val) || 0);
                      }}
                      placeholder="0"
                      className="text-primary font-bold text-right w-28 focus:outline-none font-numbers bg-transparent text-sm"
                    />
                  </div>
                </div>
                
                {/* Scrollable range slider starting from 0 to 100M KSh with high precision (step=1) */}
                <input 
                  type="range" 
                  min="0" 
                  max="100000000" 
                  step="1"
                  value={investment}
                  onChange={(e) => setInvestment(Number(e.target.value))}
                  className="w-full transition-all cursor-pointer accent-primary h-1.5 bg-muted rounded-full"
                />
                
                {/* Modern Preset buttons */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setInvestment(preset)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        investment === preset
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background hover:bg-muted text-muted-foreground hover:text-primary border-border"
                      }`}
                    >
                      {preset >= 1000000 ? `${preset / 1000000}M` : `${preset / 1000}K`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-muted-foreground">Allocation Horizon</span>
                  <span className="text-primary font-bold text-lg font-numbers">{duration} Months</span>
                </div>
                <div className="flex gap-4">
                  {[6, 12, 24].map((m) => (
                    <button
                      key={m}
                      onClick={() => setDuration(m)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                        duration === m 
                          ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                          : "bg-background hover:bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full flex flex-col justify-between p-8 bg-primary/[0.02] dark:bg-primary/[0.01] rounded-2xl border border-primary/5">
            <div className="text-center space-y-2 mb-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Projected Horizon Value</p>
              <h3 className="text-4xl md:text-5xl font-bold text-primary font-numbers tracking-tight">
                {formatKSh(expectedValue)}
              </h3>
              <p className="text-[10px] text-muted-foreground italic">Based on 30% return every 6 months (5% monthly / 0.167% daily)</p>
            </div>

            {/* Split Progress Bar */}
            <div className="my-6">
              <div className="w-full h-3 rounded-full bg-muted overflow-hidden flex">
                <div 
                  style={{ width: `${principalPercent}%` }} 
                  className="h-full bg-primary transition-all duration-300"
                />
                <div 
                  style={{ width: `${profitPercent}%` }} 
                  className="h-full bg-emerald-500 transition-all duration-300"
                />
              </div>
              <div className="flex justify-between text-xs mt-3 text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span>Principal ({principalPercent.toFixed(0)}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Yield ({profitPercent.toFixed(0)}%)</span>
                </div>
              </div>
            </div>

            <div className="w-full space-y-4 pt-6 border-t border-primary/5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Principal Contribution</span>
                <span className="font-numbers font-bold text-primary">{formatKSh(investment)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-emerald-600 dark:text-emerald-500 font-bold">Estimated Yield ({duration} mo)</span>
                <span className="text-emerald-600 dark:text-emerald-500 font-numbers font-bold">+{formatKSh(profit)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Absolute Return</span>
                <span className="text-primary font-numbers font-bold">+{((profit / investment) * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-dashed border-primary/5 text-xs">
                <span className="text-muted-foreground">Est. Monthly Return (5.0%)</span>
                <span className="text-primary font-numbers font-semibold">+{formatKSh(monthlyProfit)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Est. Daily Return (0.17%)</span>
                <span className="text-primary font-numbers font-semibold">+{formatKSh(dailyProfit)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
