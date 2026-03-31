"use client";

import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine, History, PieChart } from "lucide-react";

const actions = [
  { name: "Deposit Funds", href: "/transactions?tab=Deposit", icon: ArrowDownToLine },
  { name: "Withdraw Funds", href: "/transactions?tab=Withdraw", icon: ArrowUpFromLine },
  { name: "View History", href: "/transactions?tab=History", icon: History },
  { name: "Portfolio", href: "/portfolio", icon: PieChart },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.name}
          href={action.href}
          className="inline-flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <span>{action.name}</span>
          <action.icon size={16} className="text-muted-foreground" />
        </Link>
      ))}
    </div>
  );
}
