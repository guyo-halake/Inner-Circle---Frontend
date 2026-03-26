"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { 
  FileDown, 
  CalendarDays, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck,
  Zap
} from "lucide-react";
import { formatKSh } from "@/lib/utils";

const reports = [
  { id: 1, type: "Performance Audit", month: "March 2026", size: "1.2 MB" },
  { id: 2, type: "Historical Returns", month: "Feb 2026", size: "840 KB" },
  { id: 3, type: "KRA Tax Statement", month: "FY 2025/26", size: "2.5 MB" },
];

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black mb-2 tracking-tighter">Financial Reports</h1>
            <p className="text-muted-foreground font-medium italic">High-fidelity audit logs and performance statements.</p>
          </div>
          <button className="flex items-center gap-3 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all">
             <CalendarDays size={16} />
             Select Date Range
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-xl">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-10 flex items-center gap-3">
                 <FileDown size={14} className="text-primary" />
                 Ready to Download
              </h3>
              
              <div className="space-y-6">
                 {reports.map((report) => (
                    <div key={report.id} className="group flex items-center justify-between p-5 rounded-2xl bg-muted/20 border border-border/40 hover:bg-muted/40 transition-all border-dashed hover:border-solid hover:border-primary/30">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-background rounded-xl text-muted-foreground group-hover:text-primary transition-colors">
                             <FileDown size={20} />
                          </div>
                          <div>
                             <p className="text-xs font-black uppercase tracking-widest">{report.type}</p>
                             <p className="text-[10px] text-muted-foreground font-medium">{report.month} • {report.size}</p>
                          </div>
                       </div>
                       <button className="p-2 border border-border/50 rounded-lg hover:bg-primary/10 hover:border-primary/30 transition-all">
                          <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                       </button>
                    </div>
                 ))}
              </div>
           </div>

           <div className="space-y-8 h-full">
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 shadow-xl relative group overflow-hidden">
                 <Zap size={60} className="absolute -bottom-4 -right-4 opacity-5 group-hover:rotate-12 transition-transform text-primary" />
                 <h4 className="text-xs font-black uppercase tracking-widest mb-4">Benchmark Report</h4>
                 <p className="text-xs text-muted-foreground leading-relaxed font-bold italic mb-6">
                    See how your capital performs compared to regional indices like the NSE 20 and Global Forex benchmarks.
                 </p>
                 <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                    Generate Benchmark Analyst <ArrowRight size={12} />
                 </button>
              </div>

              <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-xl flex flex-col justify-center items-center text-center">
                 <ShieldCheck size={40} className="text-green-500 mb-4" />
                 <h4 className="text-xs font-black uppercase tracking-widest mb-2">Verified Statements</h4>
                 <p className="text-[10px] text-muted-foreground font-bold max-w-[140px] leading-relaxed">
                    All reports are digitally signed and KRA-compliance ready.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
