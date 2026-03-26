"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  TrendingUp, 
  ArrowRightLeft, 
  Download, 
  Upload, 
  FileText, 
  Settings 
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Portfolio", href: "/portfolio", icon: Briefcase },
  { name: "Performance", href: "/performance", icon: TrendingUp },
  { name: "Transactions", href: "/transactions", icon: ArrowRightLeft },
  { name: "Deposit", href: "/deposit", icon: Download },
  { name: "Withdraw", href: "/withdraw", icon: Upload },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-background flex flex-col fixed left-0 top-16 bottom-0 z-40">
      <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t text-xs text-muted-foreground text-center">
        &copy; 2026 InnerCircle
      </div>
    </aside>
  );
}
