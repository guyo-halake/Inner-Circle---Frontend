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
  Settings,
  ShieldCheck,
  Terminal,
  History
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["Investor", "Admin", "Developer"] },
  { name: "Portfolio", href: "/portfolio", icon: Briefcase, roles: ["Investor", "Admin", "Developer"] },
  { name: "Deposit & Withdraw", href: "/transactions", icon: History, roles: ["Investor", "Admin", "Developer"] },
  { name: "Deposit", href: "/transactions?tab=Deposit", icon: Download, roles: ["Investor", "Admin", "Developer"] },
  { name: "Withdraw", href: "/transactions?tab=Withdraw", icon: Upload, roles: ["Investor", "Admin", "Developer"] },
  { name: "Reports", href: "/reports", icon: FileText, roles: ["Investor", "Admin", "Developer"] },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["Investor", "Admin", "Developer"] },
  { name: "Admin", href: "/admin", icon: ShieldCheck, roles: ["Admin", "Developer"] },
  { name: "Developer Settings", href: "/developer-settings", icon: Terminal, roles: ["Developer"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  
  const role = user?.role || "Investor";

  const filteredItems = navItems.filter((item: any) => 
    !item.roles || item.roles.includes(role)
  );

  return (
    <aside className="w-64 border-r bg-background flex flex-col fixed left-0 top-16 bottom-0 z-40">
      <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
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
