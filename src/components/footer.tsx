"use client";

import Link from "next/link";
import { Phone, MapPin, Mail } from "lucide-react";
import { useSystemSettings } from "@/components/system-settings-provider";

export function Footer() {
  const { settings } = useSystemSettings();
  const supportEmail = settings?.support_email || "support@innercircle.com";

  return (
    <footer className="border-t py-12 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="text-xl font-bold tracking-tight">
              InnerCircle
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              A private investment platform designed around clarity, trust, and control.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-12 gap-y-6">
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Support</h4>
              <Link href="/terms" className="text-sm hover:text-primary transition-colors">Terms</Link>
              <Link href="/privacy" className="text-sm hover:text-primary transition-colors">Privacy</Link>
              <Link href="/support" className="text-sm hover:text-primary transition-colors">Help Center</Link>
            </div>
            <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Contact</h4>
              <a href={`mailto:${supportEmail}`} className="text-sm hover:text-primary transition-colors font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" /> {supportEmail}
              </a>
              <a href="tel:+254114339025" className="text-sm hover:text-primary transition-colors font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" /> +254 114 339025
              </a>
              <a href="tel:+254111270277" className="text-sm hover:text-primary transition-colors font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" /> +254 111270277
              </a>
              <span className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4" /> Nairobi, Kenya
              </span>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t text-center md:text-left">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} InnerCircle. All rights reserved. Developed by P3L Developers, Matta.
            <span className="block mt-1">Investing involves risk. Past performance is not indicative of future results.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
