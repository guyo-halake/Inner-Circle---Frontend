"use client";

export function ReturnsHeatmap() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Generate mock performance data for the heatmap
  const getDailyReturn = () => {
    const random = Math.random();
    if (random > 0.6) return "bg-green-500/60"; // Profit
    if (random > 0.4) return "bg-green-500/20"; // Small Profit
    if (random > 0.3) return "bg-red-500/40"; // Loss
    return "bg-muted"; // Neutral
  };

  return (
    <div className="bg-card border rounded-xl p-8 shadow-sm overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold">Daily Returns Heatmap</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-red-500/40 rounded-sm" />
            <span>Loss</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-muted rounded-sm" />
            <span>Stable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500/60 rounded-sm" />
            <span>Profit</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[auto_1fr] gap-4">
            <div className="flex flex-col justify-between py-1 text-[10px] text-muted-foreground font-medium uppercase">
              {days.filter(d => d % 5 === 0 || d === 1).map(d => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-12 gap-2">
              {months.map((month) => (
                <div key={month} className="flex flex-col gap-1">
                  <span className="text-[10px] text-center text-muted-foreground font-bold mb-1">{month}</span>
                  {Array.from({ length: 31 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-3 w-full rounded-sm transition-transform hover:scale-125 hover:z-10 cursor-help ${getDailyReturn()}`}
                      title={`${month} ${i+1}: +0.2%`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
