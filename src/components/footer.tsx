import Link from "next/link";

export function Footer() {
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
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-12 gap-y-6">
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Support</h4>
              <Link href="/terms" className="text-sm hover:text-primary transition-colors">Terms</Link>
              <Link href="/privacy" className="text-sm hover:text-primary transition-colors">Privacy</Link>
              <Link href="/support" className="text-sm hover:text-primary transition-colors">Help Center</Link>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Contact</h4>
              <a href="mailto:support@innercircle.com" className="text-sm hover:text-primary transition-colors font-medium">
                support@innercircle.com
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t text-center md:text-left">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} InnerCircle. All rights reserved. 
            Investing involves risk. Past performance is not indicative of future results.
          </p>
        </div>
      </div>
    </footer>
  );
}
