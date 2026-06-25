"use client";

import { LandingNavbar } from "@/components/landing-navbar";
import { Footer } from "@/components/footer";
import { Ticker } from "@/components/ticker";
import { motion } from "framer-motion";
import { Shield, TrendingUp, BarChart3, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Ticker />
      <LandingNavbar />
      <main className="flex-grow pt-32 pb-16">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden mb-24">
          <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
            >
              About <span className="text-primary/80">InnerCircle</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              InnerCircle is a premier hedge fund group and a collective of highly trustable traders and investment professionals. 
              Founded in 2024, our group operates on the principles of absolute transparency, rigorous risk management, and consistent absolute returns.
            </motion.p>
          </div>
          
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-20 pointer-events-none overflow-hidden flex items-center justify-center">
            <motion.div 
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.4, 0.3] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"
            />
          </div>
        </section>

        {/* Our Approach Section */}
        <section className="container mx-auto px-4 max-w-6xl mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Philosophy</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                At InnerCircle, we believe in a fundamentally different approach to private capital management. 
                We are a dedicated group of professional traders committed to protecting and growing capital through diverse market conditions. 
                By relying on an elite investment team, we remove the friction and opacity typical of traditional wealth management, offering our partners direct insight into performance.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Since our inception in 2024, we have remained steadfast in our mission to deliver absolute returns without compromising on our core values of trust and accountability.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {/* Feature Cards */}
              <div className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <Shield className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">Trustable Expertise</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Managed by a seasoned investment team dedicated to rigorous market analysis and capital preservation.
                </p>
              </div>

              <div className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <TrendingUp className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">Absolute Returns</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Focused on generating consistent, positive yields regardless of broader market fluctuations.
                </p>
              </div>

              <div className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <BarChart3 className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">Complete Transparency</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Daily yield tracking and clear, unhindered visibility into how your capital is being allocated.
                </p>
              </div>

              <div className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <Users className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">Exclusive Network</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Join a private circle of investors who value privacy, professionalism, and high-tier capital management.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
