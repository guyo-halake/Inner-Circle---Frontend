interface SummaryCardProps {
  label: string;
  value: string;
  subtext?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function SummaryCard({ label, value, subtext, trend }: SummaryCardProps) {
  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold font-numbers tracking-tight">
            {value}
          </p>
          {subtext && (
            <p className="text-xs text-muted-foreground mt-1">
              {subtext}
            </p>
          )}
        </div>
        {trend && (
          <div className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend.positive ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
          }`}>
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}
