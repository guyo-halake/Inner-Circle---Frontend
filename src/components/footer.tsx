"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { useSystemSettings } from "@/components/system-settings-provider";

export function Footer() {
  const { settings } = useSystemSettings();
  const supportEmail = "innercirclehedgefund@gmail.com";

  return (
    <footer className="border-t py-16 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Left Column: Logo & Tagline */}
          <div className="flex flex-col items-start gap-4">
            <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-90 transition-opacity">
              InnerCircle
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              A private capital management group of experienced market professionals, focusing on absolute returns and transparent performance.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a 
                href="https://www.instagram.com/innercirclehf?igsh=MTBzejZkZjR2OGsxYw==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a 
                href="https://x.com/innercircle26?s=11" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="X (formerly Twitter)"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </a>
              <a 
                href="https://www.facebook.com/share/1HygY6aCbY/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Middle Column: Quick Links */}
          <div className="flex flex-col md:items-center">
            <div className="flex flex-col gap-3 text-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Quick Links
              </h4>
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Use
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/compliance" className="text-muted-foreground hover:text-primary transition-colors">
                Compliance
              </Link>
              <Link href="/more" className="text-muted-foreground hover:text-primary transition-colors">
                More...
              </Link>
            </div>
          </div>

          {/* Right Column: Contacts & Support */}
          <div className="flex flex-col md:items-end">
            <div className="flex flex-col gap-3 text-sm md:items-start">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Support & Contact
              </h4>
              <a href={`mailto:${supportEmail}`} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4" /> {supportEmail}
              </a>
              <a href="tel:+254114339025" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <Phone className="w-4 h-4" /> +254 114339025
              </a>
              <a href="tel:+254111270277" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <Phone className="w-4 h-4" /> +254 111270277
              </a>
              <span className="text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Nairobi, Kenya
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Row: Centered Copyrights */}
        <div className="pt-8 border-t text-center">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 InnerCircle. All rights reserved. Developed by P3L Developers, Matta.
          </p>
        </div>
      </div>
    </footer>
  );
}
