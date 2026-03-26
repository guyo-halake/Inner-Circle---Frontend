import Link from "next/link";
import { Download, Upload, FileText, RefreshCw } from "lucide-react";

const actions = [
  { name: "Deposit", href: "/deposit", icon: Download },
  { name: "Withdraw", href: "/withdraw", icon: Upload },
  { name: "Reinvest", href: "#", icon: RefreshCw },
  { name: "Reports", href: "/reports", icon: FileText },
];

export function QuickActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-12">
      {actions.map((action) => (
        <Link
          key={action.name}
          href={action.href}
          className="flex-1 group relative flex items-center justify-center p-[1px] rounded-xl overflow-hidden active:scale-[0.98] transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-border/50 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex w-full items-center justify-center gap-3 py-3 rounded-[11px] bg-background border border-border/80 group-hover:border-primary/30 transition-all">
            <action.icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
              {action.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
