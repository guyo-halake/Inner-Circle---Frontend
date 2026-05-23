"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { formatKSh } from "@/lib/utils";
import { API_URL } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  CheckCircle2,
  Wallet,
  Landmark,
  Loader2,
  Smartphone,
  ArrowLeft,
  Calendar,
  Clock
} from "lucide-react";
import Link from "next/link";

type WalletItem = {
  type: string;
  balance: string | number;
};

export default function WithdrawPage() {
  const { token } = useAuthStore();
  const [step, setStep] = useState<"input" | "confirm" | "success">("input");
  const [method, setMethod] = useState<"mpesa" | "bank">("mpesa");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTransition, setLoadingTransition] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [wallets, setWallets] = useState<WalletItem[]>([]);

  useEffect(() => {
    const fetchUserWallets = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setWallets(data.wallets || []);
          
          if (data.mpesaNumber) {
            setPhone(data.mpesaNumber);
          } else if (data.phone) {
            setPhone(data.phone);
          }

          if (data.bankName) setBankName(data.bankName);
          if (data.bankAccountNumber) setAccountNumber(data.bankAccountNumber);
          if (data.bankAccountName) setAccountName(data.bankAccountName);
        }
      } catch (err) {
        console.error("Failed to fetch wallets:", err);
      } finally {
        setFetching(false);
      }
    };
    if (token) {
      fetchUserWallets();
    }
  }, [token]);

  const holdBalance = wallets.find(w => w.type === "POCKET_HOLD")?.balance 
    ? Number(wallets.find(w => w.type === "POCKET_HOLD")?.balance)
    : 0;

  const yieldBalance = wallets.find(w => w.type === "POCKET_YIELD")?.balance 
    ? Number(wallets.find(w => w.type === "POCKET_YIELD")?.balance)
    : 0;

  const withdrawable = holdBalance;

  const handleContinue = () => {
    if (!amount || Number(amount) <= 0) {
      return alert("Please enter a valid withdrawal amount.");
    }
    if (Number(amount) > withdrawable) {
      return alert("Insufficient funds in Pocket Hold.");
    }
    if (method === "mpesa" && !phone) {
      return alert("Please enter your M-Pesa phone number.");
    }
    if (method === "bank" && (!bankName || !accountNumber || !accountName)) {
      return alert("Please fill in bank details.");
    }

    setLoadingTransition(true);
    setTimeout(() => {
      setLoadingTransition(false);
      setStep("confirm");
    }, 700);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const methodDetails = method === "mpesa" 
        ? { phoneNumber: phone }
        : { bankName, accountNumber, accountName };

      const response = await fetch(`${API_URL}/api/payments/withdrawal-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          method: method === "mpesa" ? "M-Pesa" : "Bank",
          methodDetails,
        }),
      });

      if (response.ok) {
        setStep("success");
      } else {
        const errData = await response.json();
        alert(errData.error || "Failed to submit withdrawal request.");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  // 1. Success Screen
  if (step === "success") {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center animate-in zoom-in-95 duration-500">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
            <CheckCircle2 size={24} className="text-emerald-500" />
          </div>
          <h1 className="text-xl font-black mb-2 tracking-tighter text-foreground">Withdrawal Requested</h1>
          <p className="text-muted-foreground text-xs mb-6 leading-relaxed max-w-xs font-medium">
            Withdrawal request received, a confirmation message will be sent to you as soon as the request is approved.
          </p>
          <Link
            href="/dashboard"
            className="w-full py-3 bg-foreground text-background hover:opacity-90 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-98 transition-all text-center"
          >
            Go to Dashboard
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // 2. Confirmation Screen
  if (step === "confirm") {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto flex flex-col gap-5 font-sans mt-6">
          <button
            onClick={() => setStep("input")}
            className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all cursor-pointer w-fit"
          >
            <ArrowLeft size={10} /> Back to edit
          </button>

          <div>
            <h1 className="text-lg font-black tracking-tight text-foreground">Confirm Payout</h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">Please verify payout destination details before proceeding.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex justify-between items-center py-1.5 border-b border-border/40">
              <span className="text-[11px] text-muted-foreground font-medium">Withdrawal Amount</span>
              <span className="font-numbers font-black text-sm text-foreground">{formatKSh(Number(amount))}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-border/40">
              <span className="text-[11px] text-muted-foreground font-medium">Withdraw To</span>
              <span className="text-[10px] font-black text-foreground uppercase tracking-wider">
                {method === "mpesa" ? "M-Pesa" : "Bank Transfer"}
              </span>
            </div>

            {method === "mpesa" ? (
              <div className="flex justify-between items-center py-1.5">
                <span className="text-[11px] text-muted-foreground font-medium">Phone Number</span>
                <span className="text-xs font-bold text-foreground font-mono">{phone}</span>
              </div>
            ) : (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-muted-foreground font-medium">Bank Name</span>
                  <span className="font-bold text-foreground">{bankName}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-muted-foreground font-medium">Account Number</span>
                  <span className="font-bold text-foreground font-mono">{accountNumber}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-muted-foreground font-medium">Holder Name</span>
                  <span className="font-bold text-foreground">{accountName}</span>
                </div>
              </div>
            )}
          </div>

          <button
            disabled={loading}
            onClick={handleConfirm}
            className="w-full py-3 bg-foreground text-background hover:opacity-90 disabled:opacity-50 text-center rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            ) : (
              <>Confirm Withdrawal</>
            )}
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // 3. Input Screen (Default)
  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto flex flex-col gap-6 font-sans">
        
        {/* Title Bar */}
        <div>
          <h1 className="text-lg font-black tracking-tight text-foreground">Liquidate Capital</h1>
          <p className="text-[10px] text-muted-foreground mt-0.5">Withdraw uninvested funds to your linked accounts.</p>
        </div>

        {/* Real Numbers Pockets Cards (Pocket Hold and Pocket Yield) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="px-3 py-2 bg-muted/40 border border-border/60 rounded-xl flex items-center gap-2">
            <Wallet size={12} className="text-primary shrink-0" />
            <div className="flex flex-col">
              <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Pocket Hold</p>
              {fetching ? (
                <Loader2 size={8} className="animate-spin text-muted-foreground mt-0.5" />
              ) : (
                <p className="font-numbers font-black text-xs text-foreground">{formatKSh(holdBalance)}</p>
              )}
            </div>
          </div>

          <div className="px-3 py-2 bg-muted/40 border border-border/60 rounded-xl flex items-center gap-2">
            <Wallet size={12} className="text-primary shrink-0" />
            <div className="flex flex-col">
              <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Pocket Yield</p>
              {fetching ? (
                <Loader2 size={8} className="animate-spin text-muted-foreground mt-0.5" />
              ) : (
                <p className="font-numbers font-black text-xs text-foreground">{formatKSh(yieldBalance)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Minimalist Tab Selectors */}
        <div className="flex gap-1.5 p-1 bg-muted/30 border border-border/60 rounded-xl w-full">
          <button 
            type="button"
            onClick={() => setMethod("mpesa")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              method === "mpesa" 
                ? "bg-foreground text-background shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Smartphone size={11} />
            M-Pesa
          </button>
          <button 
            type="button"
            onClick={() => setMethod("bank")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              method === "bank" 
                ? "bg-foreground text-background shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Landmark size={11} />
            Bank
          </button>
        </div>

        {/* Input Form Card */}
        <div className="bg-card border border-border/80 rounded-xl p-5 shadow-md space-y-4">
          
          {method === "mpesa" ? (
            <div className="space-y-4">
              {/* Phone number field comes first */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">M-Pesa Phone Number</label>
                <input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-muted/10 border border-border rounded-lg px-3.5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-border transition-all"
                />
              </div>

              {/* Amount field comes second */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Withdrawal Amount (KSh)</label>
                  <button 
                    type="button"
                    onClick={() => setAmount(withdrawable.toString())}
                    className="text-[8px] text-primary hover:underline font-black uppercase tracking-widest cursor-pointer"
                  >
                    Withdraw Max
                  </button>
                </div>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-muted/10 border border-border rounded-lg px-3.5 py-2.5 text-xs font-bold font-numbers focus:outline-none focus:ring-1 focus:ring-border transition-all text-foreground"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Bank Details come first */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Bank Name</label>
                  <input 
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-muted/10 border border-border rounded-lg px-3.5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-border transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Account Number</label>
                  <input 
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full bg-muted/10 border border-border rounded-lg px-3.5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-border transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Account Holder Name</label>
                <input 
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full bg-muted/10 border border-border rounded-lg px-3.5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-border transition-all"
                />
              </div>

              {/* Amount field comes last */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Withdrawal Amount (KSh)</label>
                  <button 
                    type="button"
                    onClick={() => setAmount(withdrawable.toString())}
                    className="text-[8px] text-primary hover:underline font-black uppercase tracking-widest cursor-pointer"
                  >
                    Withdraw Max
                  </button>
                </div>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-muted/10 border border-border rounded-lg px-3.5 py-2.5 text-xs font-bold font-numbers focus:outline-none focus:ring-1 focus:ring-border transition-all text-foreground"
                />
              </div>
            </div>
          )}

          {/* Continue Button */}
          <button 
            type="button"
            disabled={loadingTransition || !amount || Number(amount) <= 0}
            onClick={handleContinue}
            className="w-full py-3 bg-foreground text-background hover:opacity-90 disabled:opacity-50 text-center rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loadingTransition ? (
              <div className="w-3.5 h-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            ) : (
              <>Continue</>
            )}
          </button>

        </div>
      </div>
    </DashboardLayout>
  );
}
