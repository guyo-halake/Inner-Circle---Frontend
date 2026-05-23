"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  TrendingUp, 
  ArrowRightLeft, 
  Download, 
  Upload, 
  FileText, 
  Settings,
  ShieldCheck,
  Terminal,
  History,
  Wallet,
  Users
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const navItems = [
  // Investor items
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["Investor"] },
  { name: "Portfolio", href: "/portfolio", icon: Briefcase, roles: ["Investor"] },
  { name: "Deposit", href: "/deposit", icon: Download, roles: ["Investor"] },
  { name: "Withdraw", href: "/withdraw", icon: Upload, roles: ["Investor"] },
  { name: "Transaction History", href: "/transactions", icon: History, roles: ["Investor"] },
  { name: "Reports", href: "/reports", icon: FileText, roles: ["Investor"] },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["Investor"] },

  // Admin / Developer items
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["Admin", "Developer"] },
  { name: "Investors", href: "/admin/investors", icon: Users, roles: ["Admin", "Developer"] },
  { name: "Deposits & Withdrawals", href: "/admin?tab=funds", icon: Wallet, roles: ["Admin", "Developer"] },
  { name: "Transaction History", href: "/admin?tab=history", icon: History, roles: ["Admin", "Developer"] },
  { name: "Pools Manager", href: "/admin/pools", icon: Briefcase, roles: ["Admin", "Developer"] },
  { name: "Yield Distributor", href: "/admin/distribute", icon: TrendingUp, roles: ["Admin", "Developer"] },
  { name: "Developer Settings", href: "/admin?tab=settings", icon: Terminal, roles: ["Admin", "Developer"] },
];


export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  
  const role = user?.role || "Investor";

  const filteredItems = navItems.filter((item: any) => 
    !item.roles || item.roles.includes(role)
  );

  const isActive = (itemHref: string) => {
    if (itemHref.includes("?")) {
      const [path, query] = itemHref.split("?");
      if (pathname !== path) return false;
      const params = new URLSearchParams(query);
      for (const [key, value] of params.entries()) {
        if (searchParams.get(key) !== value) return false;
      }
      return true;
    }
    if (itemHref === "/admin" && searchParams.get("tab")) {
      return false;
    }
    return pathname === itemHref;
  };

  return (
    <aside className="w-64 border-r bg-background flex flex-col fixed left-0 top-16 bottom-0 z-40">
      <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const active = isActive(item.href);
          const isComingSoon = item.name === "Pools Manager" || item.name === "Yield Distributor";

          const handleClick = (e: React.MouseEvent) => {
            if (isComingSoon) {
              e.preventDefault();
              toast.info(`${item.name} page is coming soon!`);
            }
          };

          return (
            <Link
              key={item.href}
              href={isComingSoon ? "#" : item.href}
              onClick={handleClick}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                active
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
      <div className="p-4 border-t text-[10px] text-muted-foreground text-center leading-relaxed">
        &copy; 2026 InnerCircle.<br />Developed by P3L Developers, Matta.
      </div>
    </aside>
  );
}
