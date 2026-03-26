"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Search, Filter, Download } from "lucide-react";

import { formatKSh } from "@/lib/utils";

const transactions = [
  { id: "TX123456", date: "26 Mar, 2026", type: "Deposit", amount: 500000.00, status: "Approved", method: "M-Pesa" },
  { id: "TX123457", date: "24 Mar, 2026", type: "Withdrawal", amount: 120000.00, status: "Pending", method: "Bank Wire" },
  { id: "TX123458", date: "20 Mar, 2026", type: "Deposit", amount: 1000000.00, status: "Approved", method: "M-Pesa" },
  { id: "TX123459", date: "15 Mar, 2026", type: "Withdrawal", amount: 50000.00, status: "Rejected", method: "USDT" },
  { id: "TX123460", date: "10 Mar, 2026", type: "Deposit", amount: 200000.00, status: "Approved", method: "M-Pesa" },
  { id: "TX123461", date: "05 Mar, 2026", type: "Withdrawal", amount: 150000.00, status: "Approved", method: "Bank Wire" },
];

export default function TransactionsPage() {
  const [filter, setFilter] = useState("All");

  const filteredTransactions = transactions.filter(tx => 
    filter === "All" || tx.type === filter
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">Monitor and track all your financial movements.</p>
          </div>
          <button className="flex items-center gap-2 bg-secondary border px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="bg-card border rounded-xl shadow-sm">
          <div className="p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex bg-muted p-1 rounded-lg">
              {["All", "Deposit", "Withdrawal"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    filter === f
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}s
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Method</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y font-numbers">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4 font-sans text-sm">{tx.date}</td>
                    <td className="px-6 py-4 font-sans font-medium text-sm">{tx.type}</td>
                    <td className="px-6 py-4 font-sans text-sm text-muted-foreground">{tx.method}</td>
                    <td className={`px-6 py-4 font-bold text-sm ${tx.type === "Deposit" ? "text-green-500" : "text-foreground"}`}>
                      {tx.type === "Deposit" ? "+" : "-"}{formatKSh(tx.amount)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{tx.id}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.status === "Approved" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                        tx.status === "Pending" ? "bg-orange-500/10 text-orange-600 dark:text-orange-400" :
                        "bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t flex justify-between items-center text-sm text-muted-foreground">
            <p>Showing {filteredTransactions.length} of {transactions.length} transactions</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded-md hover:bg-accent disabled:opacity-50" disabled>Previous</button>
              <button className="px-3 py-1 border rounded-md hover:bg-accent">Next</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
