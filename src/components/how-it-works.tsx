"use client";

import { motion } from "framer-motion";
import { 
  ArrowRightLeft, 
  Clock, 
  ShieldCheck, 
  LineChart, 
  DollarSign 
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Deposit funds",
    description: "Initiate your capital allocation securely via bank transfer, M-Pesa, or card.",
    icon: ArrowRightLeft,
  },
  {
    number: "02",
    title: "Wait for approval",
    description: "Our administrative desk reviews and verifies the transaction for regulatory compliance.",
    icon: Clock,
  },
  {
    number: "03",
    title: "Managed by experts",
    description: "Capital is allocated across Stocks, Forex, and Money Market Funds (MMF) using proven, low-risk models.",
    icon: ShieldCheck,
  },
  {
    number: "04",
    title: "Track your money",
    description: "Monitor your wallet balances, daily performance metrics, and yields directly from your dashboard.",
    icon: LineChart,
  },
  {
    number: "05",
    title: "Withdraw",
    description: "Request capital redemptions or yield payouts with instant-liquidation processing.",
    icon: DollarSign,
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-background relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Investment Workflow</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Our structured operations ensure institutional security, professional oversight, and absolute liquidity.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6 relative"
        >
          {/* Connector line for large screens */}
          <div className="hidden md:block absolute top-[52px] left-[10%] right-[10%] h-0.5 bg-muted -z-10" />

          {steps.map((step, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border hover:shadow-md hover:border-primary/20 transition-all group"
            >
              {/* Step circle */}
              <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mb-6 relative group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <step.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-300" />
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center border border-background">
                  {step.number}
                </span>
              </div>

              <h3 className="text-lg font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
