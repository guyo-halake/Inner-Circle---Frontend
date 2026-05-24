"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { useSystemSettings } from "@/components/system-settings-provider";

export function Footer() {
  const { settings } = useSystemSettings();
  const supportEmail = settings?.support_email || "support@innercircle.com";

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
              A private investment platform designed around absolute performance, transparency, and elite security.
            </p>
          </div>

          {/* Middle Column: Quick Links */}
          <div className="flex flex-col md:items-center">
            <div className="flex flex-col gap-3 text-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Quick Links
              </h4>
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
