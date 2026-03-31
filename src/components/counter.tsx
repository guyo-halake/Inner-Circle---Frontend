"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue, useTransform, motion } from "framer-motion";

interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  format?: (value: number) => string;
  className?: string;
}

export function Counter({ from = 0, to, duration = 2, format = (v) => v.toString(), className }: CounterProps) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => format(latest));

  useEffect(() => {
    const controls = animate(count, to, { duration: duration, ease: "easeOut" });
    return () => controls.stop();
  }, [count, to, duration]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
