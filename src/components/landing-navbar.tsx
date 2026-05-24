"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { motion } from "framer-motion";

export function LandingNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-36 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="hover:opacity-90 transition-all flex items-center">
            <img 
              src="/WhatsApp_Image_2026-05-23_at_13.40.38-removebg-preview.png" 
              alt="InnerCircle Logo" 
              className="h-28 w-auto object-contain py-1" 
            />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="#performance" 
              className="text-sm font-semibold text-muted-foreground hover:text-primary hover:underline underline-offset-4 decoration-2 transition-all"
            >
              Performance
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-sm font-semibold text-muted-foreground hover:text-primary hover:underline underline-offset-4 decoration-2 transition-all"
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
              className="text-sm font-semibold text-muted-foreground hover:text-primary hover:underline underline-offset-4 decoration-2 transition-all"
            >
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link 
            href="/login" 
            className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-muted"
          >
            Login
          </Link>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/signup"
              className="bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:opacity-95 transition-opacity"
            >
              Create account
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
