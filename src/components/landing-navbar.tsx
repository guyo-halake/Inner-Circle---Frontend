"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-background/80 backdrop-blur-lg border-b border-border/40 py-2 shadow-sm" 
        : "bg-transparent py-4"
    }`}>
      <div className={`container mx-auto px-4 flex items-center justify-between transition-all duration-300 ${
        scrolled ? "h-16" : "h-24"
      }`}>
        <div className="flex items-center gap-8">
          <Link href="/" className="hover:opacity-90 transition-all flex items-center">
            <img 
              src="/WhatsApp_Image_2026-05-23_at_13.40.38-removebg-preview.png" 
              alt="InnerCircle Logo" 
              className={`w-auto object-contain transition-all duration-300 ${
                scrolled ? "h-16" : "h-24"
              }`} 
            />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="#performance" 
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-all relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300"
            >
              Performance
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-all relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300"
            >
              How it works
            </Link>
            <Link 
              href="#contact" 
              onClick={() => {
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('open-contact'));
                }, 100);
              }}
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-all relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300"
            >
              Contact
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          <div className="hidden md:flex items-center gap-3">
            <Link 
              href="/login" 
              className="text-sm font-semibold text-muted-foreground hover:text-primary border border-transparent hover:border-border bg-transparent hover:bg-muted/40 transition-all px-4 py-2 rounded-xl"
            >
              Login
            </Link>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/signup"
                className="bg-primary text-primary-foreground border border-primary hover:bg-transparent hover:text-primary px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all duration-300"
              >
                Create account
              </Link>
            </motion.div>
          </div>
          
          {/* Mobile hamburger menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-input bg-background/50 hover:bg-accent transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-b bg-background/95 backdrop-blur-md overflow-hidden"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-5 text-sm font-medium">
              <Link 
                href="#performance" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-muted-foreground hover:text-primary transition-colors"
              >
                Performance
              </Link>
              <Link 
                href="#how-it-works" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-muted-foreground hover:text-primary transition-colors"
              >
                How it works
              </Link>
              <Link 
                href="#contact" 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('open-contact'));
                  }, 100);
                }}
                className="py-2 text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </Link>
              <hr className="border-border my-1" />
              <div className="flex flex-col gap-3">
                <Link 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-muted-foreground hover:text-primary transition-colors hover:bg-muted rounded-xl border border-border"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-primary text-primary-foreground py-2.5 rounded-xl text-center font-bold shadow-sm"
                >
                  Create account
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
