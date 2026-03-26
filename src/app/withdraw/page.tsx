"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { formatKSh } from "@/lib/utils";
import { 
  ArrowRight, 
  ShieldCheck, 
  Info,
  CheckCircle2,
  Wallet,
  Landmark,
  ShieldAlert
} from "lucide-react";

export default function WithdrawPage() {
  const [method, setMethod] = useState<"mpesa" | "bank">("mpesa");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleWithdraw = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  const currentInvested = 1824512.50;
  const withdrawable = currentInvested * 0.95; // 5% liquidity reserve simulation

  if (success) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto flex flex-col items-center justify-center min-vh-[60vh] text-center animate-in zoom-in-95 duration-500 mt-20">
           <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center mb-6">
              <CheckCircle2 size={40} className="text-orange-500" />
           </div>
           <h1 className="text-3xl font-black mb-2 tracking-tighter text-foreground">Withdrawal Logged</h1>
           <p className="text-muted-foreground mb-8 font-medium">Your request for <strong>{formatKSh(Number(amount))}</strong> has been queued for institutional processing. Funds will be disbursed within 24 hours.</p>
           <button 
             onClick={() => setSuccess(false)}
             className="px-8 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
           >
              Return Home
           </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
           <div className="space-y-1">
             <h1 className="text-4xl font-black mb-2 tracking-tighter">Liquidate Capital</h1>
             <p className="text-muted-foreground font-medium italic">Withdraw earnings or capital to your linked account.</p>
           </div>
           <div className="px-5 py-3 bg-muted/30 border border-border/50 rounded-2xl flex items-center gap-4">
              <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                 <Wallet size={16} />
              </div>
              <div className="flex flex-col">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Withdrawable Balance</p>
                 <p className="font-numbers font-black text-lg">{formatKSh(withdrawable)}</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-8">
             {/* Method Selection */}
             <div className="flex gap-4 p-1 bg-muted/30 border border-border/50 rounded-2xl w-fit">
                <button 
                  onClick={() => setMethod("mpesa")}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase transition-all ${method === "mpesa" ? "bg-background shadow-lg text-primary" : "text-muted-foreground"}`}
                >
                  <Smartphone size={16} />
                  M-Pesa 
                </button>
                <button 
                  onClick={() => setMethod("bank")}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase transition-all ${method === "bank" ? "bg-background shadow-lg text-primary" : "text-muted-foreground"}`}
                >
                  <Landmark size={16} />
                  KCB / Equity
                </button>
             </div>

             <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Withdrawal Amount</label>
                    <button 
                      onClick={() => setAmount(withdrawable.toString())}
                      className="text-[10px] text-primary hover:underline font-black uppercase tracking-widest"
                    >
                      Withdraw Max
                    </button>
                  </div>
                  <input 
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-background/50 border border-border/50 rounded-xl px-5 py-4 text-3xl font-black font-numbers focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="p-4 bg-muted/30 border border-border/50 rounded-xl space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recipient Details</span>
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase font-black tracking-widest border border-primary/20">Saved Linked Info</span>
                   </div>
                   {method === "mpesa" ? (
                     <p className="font-black text-sm tracking-widest">254-712-***-901 (K. Omondi)</p>
                   ) : (
                     <p className="font-black text-sm tracking-widest">KCB Bank - 1184-****-**21 (InnerCircle Pool)</p>
                   )}
                </div>

                <button 
                  disabled={!amount || loading || Number(amount) > withdrawable}
                  onClick={handleWithdraw}
                  className="w-full bg-primary text-primary-foreground py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Log Withdrawal <ArrowRight size={18} /></>}
                </button>
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <ShieldAlert size={60} className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform text-primary" />
                <h4 className="text-xs font-black uppercase tracking-widest mb-4">Payout Reserve Policy</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-bold mb-4 italic">
                  Instant liquidations are available up to KSh 250,000. Larger amounts are subject to institutional clearing times.
                </p>
                <div className="flex items-center gap-2 text-[10px] text-primary font-black uppercase tracking-tighter">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                   Secured by Portfolio Backing
                </div>
             </div>

             <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-xl">
                <h4 className="text-xs font-black uppercase tracking-widest mb-4">Disbursement breakdown</h4>
                <div className="space-y-3">
                   <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-bold">Gross Amount</span>
                      <span className="font-numbers font-black">{amount ? formatKSh(Number(amount)) : "KSh 0.00"}</span>
                   </div>
                   <div className="flex justify-between text-xs text-orange-500">
                      <span className="font-bold underline italic">Fund Management Fee</span>
                      <span className="font-numbers font-black">- KSh 120.00</span>
                   </div>
                   <div className="pt-3 border-t border-border/50 flex justify-between font-black">
                      <span className="text-xs uppercase tracking-widest">Net Disbursed</span>
                      <span className="text-primary font-numbers">
                         {amount ? formatKSh(Number(amount) - 120) : "KSh 0.00"}
                      </span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Smartphone({ size }: { size: number }) {
   return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
        <path d="M12 18h.01" />
      </svg>
   )
}
