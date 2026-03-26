"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { formatKSh } from "@/lib/utils";
import { 
  Smartphone, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Info,
  CheckCircle2
} from "lucide-react";

import { API_URL } from "@/lib/api";

export default function DepositPage() {
  const [method, setMethod] = useState<"mpesa" | "bank">("mpesa");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDeposit = async () => {
    if (!amount || !phone) return alert("Enter amount and phone");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/payments/stk-push`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({ amount, phoneNumber: phone })
      });
      if (response.ok) {
        setSuccess(true);
      }
    } catch (err) {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center animate-in zoom-in-95 duration-500">
           <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <CheckCircle2 size={40} className="text-green-500" />
           </div>
           <h1 className="text-3xl font-black mb-2 tracking-tighter">Request Sent</h1>
           <p className="text-muted-foreground mb-8">Please check your phone for the M-Pesa prompt and enter your PIN to complete the deposit of <strong>{formatKSh(Number(amount))}</strong>.</p>
           <button 
             onClick={() => setSuccess(false)}
             className="px-8 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
           >
              Done
           </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tighter">Add Capital</h1>
          <p className="text-muted-foreground font-medium italic">Increase your institutional weight by funding your account.</p>
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
                  M-Pesa STK
                </button>
                <button 
                  onClick={() => setMethod("bank")}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase transition-all ${method === "bank" ? "bg-background shadow-lg text-primary" : "text-muted-foreground"}`}
                >
                  <Building2 size={16} />
                  Bank Transfer
                </button>
             </div>

             {method === "mpesa" ? (
               <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-xl space-y-6 animate-in slide-in-from-left-4 duration-500">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount (KSh)</label>
                    <input 
                      type="number"
                      placeholder="e.g. 50,000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-background/50 border border-border/50 rounded-xl px-5 py-4 text-2xl font-black font-numbers focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">M-Pesa Number</label>
                    <input 
                      type="tel"
                      placeholder="2547XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-background/50 border border-border/50 rounded-xl px-5 py-3 text-lg font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <button 
                    disabled={!amount || loading}
                    onClick={handleDeposit}
                    className="w-full bg-primary text-primary-foreground py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Initiate Deposit <ArrowRight size={18} /></>}
                  </button>
               </div>
             ) : (
               <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-xl space-y-6 animate-in slide-in-from-right-4 duration-500">
                  <div className="p-6 bg-muted/30 border border-border/50 rounded-2xl space-y-4">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Bank Name</p>
                        <p className="font-black text-lg">Equity Bank (InnerCircle Trust)</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Account Number</p>
                        <p className="font-black text-lg tracking-widest">0982-1234-5678-90</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Account Name</p>
                        <p className="font-black text-lg">INNERCIRCLE INVESTMENTS LTD</p>
                     </div>
                  </div>
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex gap-3">
                     <Info size={20} className="text-primary shrink-0 mt-0.5" />
                     <p className="text-xs text-muted-foreground leading-relaxed font-bold">
                        Please include your Investor ID as the reference for faster processing. Transfers take 1-4 hours to reflect.
                     </p>
                  </div>
               </div>
             )}
          </div>

          <div className="space-y-6">
             <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <ShieldCheck size={60} className="absolute -bottom-4 -right-4 opacity-5 group-hover:rotate-12 transition-transform text-primary" />
                <h4 className="text-xs font-black uppercase tracking-widest mb-4">Security Notice</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-bold mb-4 italic">
                  All transactions are encrypted and audited through our custodial partnership with major Kenyan banks.
                </p>
                <div className="flex items-center gap-2 text-[10px] text-green-500 font-black uppercase tracking-tighter">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   EAT Compliance Verified
                </div>
             </div>

             <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-xl">
                <h4 className="text-xs font-black uppercase tracking-widest mb-4">Summary</h4>
                <div className="space-y-3">
                   <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-bold">Base Deposit</span>
                      <span className="font-numbers font-black">{amount ? formatKSh(Number(amount)) : "KSh 0.00"}</span>
                   </div>
                   <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-bold italic">Transaction Fee</span>
                      <span className="font-numbers font-black text-muted-foreground">KSh 0.00</span>
                   </div>
                   <div className="pt-3 border-t border-border/50 flex justify-between font-black">
                      <span className="text-xs uppercase tracking-widest">Total Weight</span>
                      <span className="text-primary font-numbers">{amount ? formatKSh(Number(amount)) : "KSh 0.00"}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
