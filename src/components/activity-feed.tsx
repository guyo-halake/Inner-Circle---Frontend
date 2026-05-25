"use client";

import { TrendingUp, CalendarDays, ArrowDownRight, ArrowUpRight, Wallet, Coins } from "lucide-react";
import { formatKSh, formatRelativeTime } from "@/lib/utils";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export function ActivityFeed() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${API_URL}/api/payments/transactions`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) setActivities(await res.json());
      } catch (err) {
        console.error("Transactions sync failed");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 30000); // Sync every 30s
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Deposit': return ArrowDownRight;
      case 'Withdrawal': return ArrowUpRight;
      case 'Allocation': return Wallet;
      case 'Profit': return TrendingUp;
      default: return Coins;
    }
  };

  return (
    <div className="bg-card/30 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 shadow-xl h-full font-sans">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 flex items-center gap-3 italic">
           <CalendarDays size={14} className="text-primary" />
           Recent Activity
        </h3>
      </div>

      {loading ? (
        <div className="space-y-6 opacity-20">
            {[1,2,3,4].map(i => <div key={i} className="h-10 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-6">
          {activities.map((activity, index) => {
            const Icon = getIcon(activity.type);
            const isApproved = activity.status === 'Approved';
            const isPending = activity.status === 'Pending';
            return (
              <div key={index} className="flex items-center gap-4 group transition-all">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-muted/40 border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                  <Icon size={16} className="text-muted-foreground/60 group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-grow flex justify-between items-center">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">{activity.type}</p>
                    <p className={`text-[9px] font-bold uppercase tracking-widest italic ${isApproved ? 'text-emerald-500/80' : isPending ? 'text-amber-500/80' : 'text-red-500/80'}`}>
                      {activity.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold font-mono tracking-tighter">{formatKSh(Number(activity.amount))}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 italic">{formatRelativeTime(activity.createdAt)}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {activities.length === 0 && (
            <div className="py-12 text-center opacity-20 italic uppercase tracking-[0.2em] text-[9px]">
               No recent activity...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
