import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { formatKSh } from "@/lib/utils";

const activities = [
  {
    type: "Deposit approved",
    amount: 500000.00,
    timestamp: "2 hours ago",
    icon: ArrowDownRight,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/10",
  },
  {
    type: "Withdrawal pending",
    amount: 120000.00,
    timestamp: "Yesterday, 14:20",
    icon: ArrowUpRight,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    type: "Profit credited",
    amount: 34212.50,
    timestamp: "24 Mar, 2026",
    icon: TrendingUp,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    type: "Deposit approved",
    amount: 1000000.00,
    timestamp: "20 Mar, 2026",
    icon: ArrowDownRight,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/10",
  },
];

export function ActivityFeed() {
  return (
    <div className="bg-card border rounded-xl p-8 shadow-sm h-full">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-xl font-bold">Activity Feed</h3>
        <button className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
          View all
        </button>
      </div>
      <div className="space-y-8">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activity.bg}`}>
              <activity.icon className={`w-5 h-5 ${activity.color}`} />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-semibold">{activity.type}</p>
                <p className="text-sm font-bold font-numbers">{formatKSh(activity.amount)}</p>
              </div>
              <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
