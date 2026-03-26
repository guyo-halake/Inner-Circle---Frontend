"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Upload, Info } from "lucide-react";

export default function DepositPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Deposit submitted successfully. Status is now pending.");
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Deposit Funds</h1>
          <p className="text-muted-foreground">Add capital to your trading account.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="bg-card border rounded-xl p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount to Deposit</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">KSh</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-3 bg-background border rounded-lg text-lg font-bold font-numbers focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Method</label>
                  <select className="w-full px-4 py-3 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" required>
                    <option value="">Select a method</option>
                    <option value="mpesa">M-Pesa (Direct STK Push)</option>
                    <option value="wire">Bank Wire Transfer (KCB / Equity)</option>
                    <option value="crypto">USDT (Tether)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Proof of Payment (Optional)</label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-10 flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground/50">JPG, PNG or PDF (max 5MB)</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Submit Deposit"}
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
                <li>Deposits are usually processed within 24-48 hours.</li>
                <li>Minimum deposit amount is $1,000.00.</li>
                <li>Please ensure the sender name matches your account name.</li>
                <li>For crypto deposits, ensure you use the correct network to avoid loss of funds.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
