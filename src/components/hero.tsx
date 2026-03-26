"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";

export function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsEligible(true);
    }
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setStep(1);
    setIsEligible(null);
  };

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
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-3 rounded-xl text-lg font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
          >
            Check Eligibility
          </button>
          
          <Link
            href="/signup"
            className="w-full sm:w-auto border-2 border-primary/10 bg-background/50 backdrop-blur-sm px-8 py-3 rounded-xl text-lg font-bold hover:bg-muted transition-all"
          >
            Create account
          </Link>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.1)_0%,transparent_70%)]" />
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetModal}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-card border rounded-3xl shadow-2xl p-10 overflow-hidden"
            >
              <button 
                onClick={resetModal}
                className="absolute top-6 right-6 p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {isEligible === null ? (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary/50">Step {step} of 3</span>
                    <h2 className="text-2xl font-bold">
                      {step === 1 && "Confirm your location"}
                      {step === 2 && "Investment capacity"}
                      {step === 3 && "Previous experience"}
                    </h2>
                  </div>

                  <div className="min-h-[120px] flex items-center">
                    {step === 1 && (
                      <p className="text-muted-foreground">Are you a resident of Kenya or have valid investments within the East African region?</p>
                    )}
                    {step === 2 && (
                      <p className="text-muted-foreground">Do you have an initial capital of at least KSh 1,000,000 available for a long-term strategy?</p>
                    )}
                    {step === 3 && (
                      <p className="text-muted-foreground">Do you understand that high-return private investments carry market risks and have lock-up periods?</p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={handleNext}
                      className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:opacity-90 transition-opacity"
                    >
                      Yes, I Confirm
                    </button>
                    <button 
                      onClick={resetModal}
                      className="flex-1 border py-4 rounded-xl font-medium hover:bg-muted transition-colors"
                    >
                      No
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-8 py-4">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold">You are Eligible</h2>
                    <p className="text-muted-foreground">Based on your answers, you meet the criteria for our private investment pool.</p>
                  </div>

                  <Link 
                    href="/signup" 
                    className="block w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:opacity-90 transition-opacity"
                  >
                    Continue to Registration
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
