"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function LandingNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <img 
              src="/WhatsApp_Image_2026-05-23_at_13.40.38-removebg-preview.png" 
              alt="InnerCircle Logo" 
              className="h-10 w-auto object-contain" 
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#performance" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Performance
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How it works
            </Link>
            <Link href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Create account
          </Link>
        </div>
      </div>
    </header>
  );
}
