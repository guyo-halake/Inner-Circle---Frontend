"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { formatKSh } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";
import { Counter } from "./counter";
import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";

export function ICWalletCard() {
  const { user, token } = useAuthStore();
  const [wallet, setWallet] = useState<any>(null);
  
  const isAdmin = user?.role === "Admin" || user?.role === "Developer";

  useEffect(() => {
    const fetchWallet = async () => {
      if (!isAdmin || !token) return;
      try {
        const response = await fetch(`${API_URL}/api/admin/wallet`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setWallet(data);
      } catch (err) {
        console.error("Failed to load IC-Wallet", err);
      }
    };
    fetchWallet();
  }, [isAdmin, token]);

  if (!isAdmin || !wallet) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        <ShieldCheck size={16} />
        <span className="text-sm font-medium">Platform Wallet</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Current balance</p>
          <p className="text-3xl font-semibold font-numbers">
            <Counter to={Number(wallet.balance)} format={(v) => formatKSh(v)} />
          </p>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            Add funds
          </button>
          <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors">
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
