"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { FileDown, CalendarDays, ArrowUpRight, ShieldCheck } from "lucide-react";

const reports = [
   { id: 1, type: "Performance summary", period: "March 2026", size: "1.2 MB" },
   { id: 2, type: "Returns history", period: "February 2026", size: "840 KB" },
   { id: 3, type: "KRA tax statement", period: "FY 2025/26", size: "2.5 MB" },
];

export default function ReportsPage() {
  return (
    <DashboardLayout>
         <div className="mx-auto flex max-w-5xl flex-col gap-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
               <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                     Download monthly statements and tax-ready documents.
                  </p>
               </div>
               <button className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium hover:bg-muted/40">
                  <CalendarDays size={16} />
                  Select date range
               </button>
        </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
               <section className="lg:col-span-2 rounded-2xl border bg-card p-6">
                  <h2 className="mb-4 text-sm font-semibold">Available reports</h2>
                  <div className="overflow-hidden rounded-xl border">
                     <table className="w-full text-left text-sm">
                        <thead className="bg-muted/30 text-muted-foreground">
                           <tr>
                              <th className="p-3 font-medium">Report</th>
                              <th className="p-3 font-medium">Period</th>
                              <th className="p-3 font-medium">Size</th>
                              <th className="p-3 font-medium text-right">Action</th>
                           </tr>
                        </thead>
                        <tbody>
                           {reports.map((report) => (
                              <tr key={report.id} className="border-t">
                                 <td className="p-3 font-medium">{report.type}</td>
                                 <td className="p-3 text-muted-foreground">{report.period}</td>
                                 <td className="p-3 text-muted-foreground">{report.size}</td>
                                 <td className="p-3 text-right">
                                    <button className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted/40">
                                       <FileDown size={14} />
                                       Download
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </section>

               <aside className="space-y-4">
                  <div className="rounded-2xl border bg-card p-5">
                     <h3 className="text-sm font-semibold">Benchmark snapshot</h3>
                     <p className="mt-2 text-sm text-muted-foreground">
                        Compare your portfolio performance against selected market benchmarks.
                     </p>
                     <button className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                        Generate benchmark report
                        <ArrowUpRight size={15} />
                     </button>
                  </div>

                  <div className="rounded-2xl border bg-card p-5">
                     <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-emerald-600" />
                        <h3 className="text-sm font-semibold">Verification</h3>
                     </div>
                     <p className="mt-2 text-sm text-muted-foreground">
                        Statements are prepared for KRA filing and audit support.
                     </p>
                  </div>
               </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
