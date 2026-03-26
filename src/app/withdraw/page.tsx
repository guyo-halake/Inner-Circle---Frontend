"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Info, Wallet } from "lucide-react";

export default function WithdrawPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState("");
  const availableBalance = 1824512.50;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(amount) > availableBalance) {
      alert("Insufficient balance.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Withdrawal request submitted successfully. It will be processed within 48 hours.");
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Request Withdrawal</h1>
          <p className="text-muted-foreground">Withdraw funds from your portfolio.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="bg-card border rounded-xl p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-muted p-6 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center border shadow-sm">
                      <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available Balance</p>
                      <p className="text-2xl font-bold font-numbers">KSh {availableBalance.toLocaleString()}</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setAmount(availableBalance.toString())}
                    className="text-sm font-bold text-primary hover:underline"
                  >
                    Withdraw All
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount to Withdraw</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">KSh</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-background border rounded-lg text-lg font-bold font-numbers focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                      max={availableBalance}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Withdrawal Method</label>
                  <select className="w-full px-4 py-3 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" required>
                    <option value="">Select a method</option>
                    <option value="mpesa">M-Pesa</option>
                    <option value="wire">Bank Wire Transfer (KCB / Equity)</option>
                    <option value="crypto">USDT (Tether)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Request Withdrawal"}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <Info className="w-5 h-5 text-primary mt-0.5" />
                <h4 className="font-bold">Important Information</h4>
              </div>
              <ul className="text-sm space-y-4 text-muted-foreground list-disc pl-4">
                <li>Withdrawal requests are processed within 24-48 hours.</li>
                <li>Minimum withdrawal amount is $100.00.</li>
                <li>Please ensure your bank/wallet details are up-to-date in Settings.</li>
                <li>Processing fees may apply depending on the withdrawal method.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
