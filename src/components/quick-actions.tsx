import Link from "next/link";
import { Download, Upload, FileText } from "lucide-react";

const actions = [
  { name: "Deposit", href: "/deposit", icon: Download, color: "bg-primary text-primary-foreground" },
  { name: "Withdraw", href: "/withdraw", icon: Upload, color: "bg-secondary text-secondary-foreground border" },
  { name: "Reports", href: "/reports", icon: FileText, color: "bg-secondary text-secondary-foreground border" },
];

export function QuickActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      {actions.map((action) => (
        <Link
          key={action.name}
          href={action.href}
          className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 ${action.color}`}
        >
          <action.icon className="w-4 h-4" />
          {action.name}
        </Link>
      ))}
    </div>
  );
}
