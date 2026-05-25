"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { formatCompactKSh } from "@/lib/utils";
import { useTheme } from "next-themes";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export function PerformancePreview() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Start with historical growth factors (Jan to Jul)
  const historicalData = [1.0, 1.08, 1.15, 1.12, 1.25, 1.32, 1.45];
  
  // State for live-ticking August growth factor
  const [liveGrowthFactor, setLiveGrowthFactor] = useState(1.524);
  const [poolSize, setPoolSize] = useState(420000000);
  const [lastDirection, setLastDirection] = useState<"up" | "down" | "flat">("flat");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate micro-fluctuations in trading performance (mostly upward bias)
      const changePercent = (Math.random() - 0.42) * 0.0015; // bias upward slightly
      
      setLiveGrowthFactor((prev) => {
        const next = prev * (1 + changePercent);
        setLastDirection(next > prev ? "up" : next < prev ? "down" : "flat");
        return next;
      });

      setPoolSize((prev) => prev * (1 + changePercent));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Format tick numbers with absolute precision
  const formatLiveNumber = (num: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const isDark = mounted && resolvedTheme === "dark";
  const lineColor = isDark ? "rgb(16, 185, 129)" : "rgb(23, 23, 23)"; // Glowing emerald in dark, elegant black in light
  const areaColor = isDark ? "rgba(16, 185, 129, 0.08)" : "rgba(23, 23, 23, 0.04)";
  const gridColor = isDark ? "#262626" : "#f5f5f5";
  const tooltipBg = isDark ? "rgba(10, 10, 10, 0.98)" : "rgba(255, 255, 255, 0.98)";
  const tooltipText = isDark ? "#fafafa" : "#0a0a0a";
  const tooltipBorder = isDark ? "#262626" : "#e5e5e5";

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Live Feed"],
    datasets: [
      {
        label: "Performance Index",
        data: [...historicalData, liveGrowthFactor],
        borderColor: lineColor,
        backgroundColor: areaColor,
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: (context: any) => (context.dataIndex === 7 ? 6 : 0),
        pointHoverRadius: 6,
        pointBackgroundColor: lineColor,
        pointBorderColor: isDark ? "#0a0a0a" : "#ffffff",
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: tooltipBg,
        titleColor: tooltipText,
        bodyColor: tooltipText,
        borderColor: tooltipBorder,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        titleFont: {
          family: "var(--font-sora)",
          weight: "bold" as const,
        },
        bodyFont: {
          family: "var(--font-inter)",
        },
        callbacks: {
          label: (context: any) => {
            if (context.dataIndex === 7) {
              return `Live Index: ${context.parsed.y.toFixed(4)}x`;
            }
            return `Index: ${context.parsed.y.toFixed(2)}x`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: isDark ? "#a3a3a3" : "#737373",
          font: {
            family: "var(--font-inter)",
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: gridColor,
        },
        border: {
          display: false,
        },
        ticks: {
          color: isDark ? "#a3a3a3" : "#737373",
          font: {
            family: "var(--font-inter)",
            size: 11,
          },
        },
      },
    },
  };

  return (
    <section id="performance" className="py-24 bg-muted/40 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="relative z-10 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-3xl font-bold tracking-tight">Performance</h2>
                <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Live</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                Historical growth and live performance trajectory of the collective pool.
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground self-start md:self-auto">
              <span className="w-2.5 h-2.5 bg-[rgb(23,23,23)] rounded-full" />
              <span>Pool Growth Index</span>
            </div>
          </div>

          {/* Chart Container */}
          <div className="h-[320px] w-full mb-12 relative">
            <Line data={chartData} options={chartOptions} />
          </div>

          {/* Core Analytics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t pt-8">
            <div className="col-span-1">
              <p className="text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Active Investors</p>
              <p className="text-2xl font-bold font-numbers text-primary">10+</p>
            </div>
            <div className="col-span-1">
              <p className="text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Avg Monthly</p>
              <p className="text-2xl font-bold font-numbers text-emerald-600">+4.36%</p>
            </div>
            <div className="col-span-1">
              <p className="text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Sharpe Ratio</p>
              <p className="text-2xl font-bold font-numbers text-primary">2.45</p>
            </div>
            <div className="col-span-1">
              <p className="text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Max Drawdown</p>
              <p className="text-2xl font-bold font-numbers text-primary">-1.82%</p>
            </div>
          </div>
          
          {/* Real-time Ticker Status */}
          <div className="flex justify-center mt-6 text-[11px] text-muted-foreground gap-2">
            <span>Live Feed Status:</span>
            <span className={`font-medium flex items-center gap-1 ${
              lastDirection === "up" ? "text-emerald-600" : lastDirection === "down" ? "text-rose-500" : "text-muted-foreground"
            }`}>
              {lastDirection === "up" ? "▲ Yield Accrued" : lastDirection === "down" ? "▼ Market Variance" : "● Stable"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
