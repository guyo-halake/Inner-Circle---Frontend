import { TrendingUp, UserCheck, CalendarDays, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatKSh } from "@/lib/utils";

const activities = [
  { type: "Market Update", amount: 0, timestamp: "2 hours ago", icon: TrendingUp, desc: "Portfolio Rebalancing" },
  { type: "Deposit", amount: 500000.00, timestamp: "5 hours ago", icon: ArrowDownRight, desc: "Account Credit" },
  { type: "Withdrawal Request", amount: 120000.00, timestamp: "Yesterday, 14:20", icon: ArrowUpRight, desc: "In Progress" },
  { type: "Profit Earned", amount: 34212.50, timestamp: "24 Mar, 2026", icon: TrendingUp, desc: "Yield Distribution" },
];

export function ActivityFeed() {
  return (
    <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-xl h-full">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-muted-foreground flex items-center gap-3">
           <CalendarDays size={14} className="text-primary" />
           Recent Activity
        </h3>
      </div>
      <div className="space-y-6">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-4 group transition-all">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-muted/60 border border-border/50 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
              <activity.icon size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-grow flex justify-between items-center pr-2">
              <div>
                <p className="text-[11px] font-extrabold text-foreground group-hover:text-primary transition-colors">{activity.type}</p>
                <p className="text-[10px] text-muted-foreground italic font-medium">{activity.desc}</p>
              </div>
              <div className="text-right flex flex-col items-end">
                {activity.amount > 0 && <p className="text-[11px] font-bold font-numbers tracking-tight">{formatKSh(activity.amount)}</p>}
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">{activity.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
