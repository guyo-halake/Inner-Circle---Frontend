"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Search, Filter, Download, FileText } from "lucide-react";
import { API_URL } from "@/lib/api";
import { formatKSh } from "@/lib/utils";
import { Skeleton } from "@/components/skeleton";

export default function TransactionsPage() {
  const [filter, setFilter] = useState("All");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${API_URL}/api/transactions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

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
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y font-numbers">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-6 py-4 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                    </tr>
                  ))
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground italic text-sm">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-accent/50 transition-colors group">
                      <td className="px-6 py-4 font-sans text-sm">
                        {new Date(tx.createdAt).toLocaleDateString("en-KE", { 
                          day: "numeric", 
                          month: "short", 
                          year: "numeric" 
                        })}
                      </td>
                      <td className="px-6 py-4 font-sans font-medium text-sm">{tx.type}</td>
                      <td className={`px-6 py-4 font-bold text-sm ${tx.type === "Deposit" ? "text-green-500" : "text-foreground"}`}>
                        {tx.type === "Deposit" ? "+" : "-"}{formatKSh(tx.amount)}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {tx.mpesaCheckoutId ? `MP-${tx.mpesaCheckoutId.slice(-6)}` : `TX-${tx.id}`}
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          tx.status === "Completed" || tx.status === "Approved" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                          tx.status === "Pending" ? "bg-orange-500/10 text-orange-600 dark:text-orange-400" :
                          "bg-red-500/10 text-red-600 dark:text-red-400"
                        }`}>
                          {tx.status}
                        </span>
                        <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-lg transition-all text-muted-foreground" title="View Details">
                          <FileText className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
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
