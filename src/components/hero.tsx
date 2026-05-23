"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="pt-32 pb-16 md:pt-48 md:pb-32 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
        >
          Private investment access with <span className="text-primary/50">transparent performance</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
        >
          Monitor your capital, track growth, and manage withdrawals from a single, high-performance dashboard designed for the modern elite.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link
            href="/login"
            className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-3 rounded-xl text-lg font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 text-center"
          >
            Invest with us
          </Link>
          
          <Link
            href="#how-it-works"
            className="w-full sm:w-auto border-2 border-primary/10 bg-background/50 backdrop-blur-sm px-8 py-3 rounded-xl text-lg font-bold hover:bg-muted transition-all text-center"
          >
            How it works
          </Link>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.1)_0%,transparent_70%)]" />
      </div>
    </section>
  );
}
