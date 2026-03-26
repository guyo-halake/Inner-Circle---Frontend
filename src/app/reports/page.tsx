"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { FileText, Download, ChevronRight, X } from "lucide-react";
import { formatKSh } from "@/lib/utils";

const reports = [
  { month: "February 2026", opening: 1724512.50, closing: 1824512.50, change: 100000.00, return: "+5.8%" },
  { month: "January 2026", opening: 1542000.00, closing: 1724512.50, change: 182512.50, return: "+11.8%" },
  { month: "December 2025", opening: 1285000.00, closing: 1542000.00, change: 257000.00, return: "+20.0%" },
  { month: "November 2025", opening: 1050000.00, closing: 1285000.00, change: 235000.00, return: "+22.4%" },
  { month: "October 2025", opening: 920000.00, closing: 1050000.00, change: 130000.00, return: "+14.1%" },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<typeof reports[0] | null>(null);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Investment Reports</h1>
          <p className="text-muted-foreground">Download and view your monthly performance statements.</p>
        </div>

        <div className="bg-card border rounded-xl shadow-sm">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="font-bold">Monthly Statements</h3>
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Select to view details</span>
          </div>

          <div className="divide-y">
            {reports.map((report) => (
              <div 
                key={report.month} 
                className="p-6 flex items-center justify-between hover:bg-accent/50 transition-colors cursor-pointer group"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold">{report.month}</p>
                    <p className="text-xs text-muted-foreground">Statement of Account</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-bold font-numbers">+{formatKSh(report.change)}</p>
                    <p className="text-xs text-green-500 font-medium">{report.return}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-muted/30">
              <h3 className="text-xl font-bold">{selectedReport.month} Report</h3>
              <button onClick={() => setSelectedReport(null)} className="p-1 hover:bg-accent rounded-md transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Opening Balance</p>
                  <p className="text-xl font-bold font-numbers">{formatKSh(selectedReport.opening)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Closing Balance</p>
                  <p className="text-xl font-bold font-numbers">{formatKSh(selectedReport.closing)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Net Change</p>
                  <p className="text-xl font-bold font-numbers text-green-500">+{formatKSh(selectedReport.change)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Return Percentage</p>
                  <p className="text-xl font-bold font-numbers text-green-500">{selectedReport.return}</p>
                </div>
              </div>

              <div className="pt-8 border-t space-y-4">
                <button className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
                  <Download className="w-4 h-4" />
                  Download as PDF
                </button>
                <button className="w-full flex items-center justify-center gap-3 bg-secondary border py-3 rounded-lg font-bold hover:bg-accent transition-colors">
                  <FileText className="w-4 h-4" />
                  View Detailed Trades
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
