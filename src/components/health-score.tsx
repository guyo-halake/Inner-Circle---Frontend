"use client";

import { motion } from "framer-motion";

interface HealthScoreProps {
  score: number;
}

export function HealthScore({ score }: HealthScoreProps) {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-card border rounded-xl p-8 shadow-sm flex flex-col items-center justify-center gap-6">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Portfolio Health</h3>
      
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/20"
          />
          <motion.circle
            cx="64"
            cy="64"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-primary"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-3xl font-bold font-numbers">{score}</span>
          <span className="text-[10px] text-muted-foreground uppercase font-medium">Stable</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">Your strategy is 82% diversified. Add bonds to improve stability.</p>
      </div>
    </div>
  );
}
