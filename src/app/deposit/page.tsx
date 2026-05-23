"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { formatKSh } from "@/lib/utils";
import { API_URL } from "@/lib/api";
import { 
  Copy, 
  Check, 
  Upload, 
  Clipboard, 
  CheckCircle2,
  QrCode,
  Smartphone,
  Calendar,
  Clock,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useSystemSettings } from "@/components/system-settings-provider";

export default function DepositPage() {
  const { token } = useAuthStore();
  const { settings } = useSystemSettings();
  
  const paybill = settings?.paybill_number || "880100";
  const account = settings?.account_number || "339025";

  const [step, setStep] = useState<"input" | "confirm" | "success">("input");
  const [amount, setAmount] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [mode, setMode] = useState<"none" | "upload" | "paste">("none");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [smsMessage, setSmsMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedPaybill, setCopiedPaybill] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [dateTime, setDateTime] = useState({ date: "", time: "" });

  const copyToClipboard = (text: string, type: "paybill" | "account") => {
    navigator.clipboard.writeText(text);
    if (type === "paybill") {
      setCopiedPaybill(true);
      setTimeout(() => setCopiedPaybill(false), 2000);
    } else {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleContinue = () => {
    if (!amount || Number(amount) <= 0) {
      return alert("Please enter a valid deposit amount.");
    }
    const now = new Date();
    setDateTime({
      date: now.toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" }),
      time: now.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })
    });
    setStep("confirm");
  };

  const handleUpload = async (selectedFile: File): Promise<string> => {
    const formData = new FormData();
    formData.append("proof", selectedFile);

    const response = await fetch(`${API_URL}/api/payments/upload-proof`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Screenshot upload failed");
    }

    const data = await response.json();
    return data.fileUrl;
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      let screenshotUrl = "";
      if (mode === "upload" && file) {
        screenshotUrl = await handleUpload(file);
      }

      const methodDetails = {
        referenceCode,
        smsMessage: mode === "paste" ? smsMessage : "",
        screenshotUrl,
      };

      const response = await fetch(`${API_URL}/api/payments/deposit-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          method: "Manual",
          methodDetails,
        }),
      });

      if (response.ok) {
        setStep("success");
      } else {
        const errData = await response.json();
        alert(errData.error || "Failed to submit deposit request.");
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
        <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
            <CheckCircle2 size={32} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-black mb-3 tracking-tighter text-foreground">Deposit Sent</h1>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed max-w-sm font-medium">
            System will reflect after few minutes. We will send a notification once done.
          </p>
          <Link
            href="/dashboard"
            className="w-full py-4 bg-foreground text-background hover:opacity-90 rounded-xl text-xs font-black uppercase tracking-widest active:scale-98 transition-all text-center"
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
        <div className="max-w-md mx-auto flex flex-col gap-6 font-sans mt-10">
          <button
            onClick={() => setStep("input")}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all cursor-pointer w-fit"
          >
            <ArrowLeft size={12} /> Back to edit
          </button>

          <div className="text-center md:text-left">
            <h1 className="text-2xl font-black tracking-tight text-foreground">Confirm Deposit</h1>
            <p className="text-xs text-muted-foreground mt-1">Please review the details before finalizing your request.</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border/40">
              <span className="text-xs text-muted-foreground font-medium">Deposit Amount</span>
              <span className="font-numbers font-black text-lg text-foreground">{formatKSh(Number(amount))}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-border/40">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                <Calendar size={13} className="text-muted-foreground" /> Date
              </span>
              <span className="text-xs font-bold text-foreground">{dateTime.date}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                <Clock size={13} className="text-muted-foreground" /> Time
              </span>
              <span className="text-xs font-bold text-foreground">{dateTime.time}</span>
            </div>
          </div>

          <button
            disabled={loading}
            onClick={handleConfirm}
            className="w-full py-4 bg-foreground text-background hover:opacity-90 disabled:opacity-50 text-center rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            ) : (
              <>Confirm Deposit</>
            )}
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // 3. Input Screen (Default)
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto flex flex-col gap-8 font-sans">
        
        {/* Title */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-black tracking-tight text-foreground">Add Capital</h1>
          <p className="text-xs text-muted-foreground mt-1">Fund your account via M-Pesa. Admin confirms transactions manually.</p>
        </div>

        {/* Highlighted Payment Instructions & QR Code Side-by-Side */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row gap-6 items-center justify-between">
          
          {/* Left Side: Highlighted Paybills */}
          <div className="flex-1 w-full space-y-4">
            <div className="flex items-center gap-2">
              <Smartphone size={16} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">M-Pesa Payment Details</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-muted/40 border border-border/60 rounded-xl">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">Paybill Number</p>
                  <p className="font-numbers font-black text-2xl text-foreground tracking-tight">{paybill}</p>
                </div>
                <button 
                  onClick={() => copyToClipboard(paybill, "paybill")}
                  className="p-2.5 hover:bg-muted/80 rounded-lg text-muted-foreground hover:text-foreground transition-all shrink-0 cursor-pointer"
                >
                  {copiedPaybill ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/40 border border-border/60 rounded-xl">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">Account Number</p>
                  <p className="font-numbers font-black text-2xl text-foreground tracking-tight">{account}</p>
                </div>
                <button 
                  onClick={() => copyToClipboard(account, "account")}
                  className="p-2.5 hover:bg-muted/80 rounded-lg text-muted-foreground hover:text-foreground transition-all shrink-0 cursor-pointer"
                >
                  {copiedAccount ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: QR Code */}
          <div className="flex flex-col items-center justify-center p-4 bg-muted/20 border border-border/40 rounded-xl shrink-0 w-full md:w-[190px]">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border bg-black/40 flex items-center justify-center">
              <img 
                src="/qr_code.png" 
                alt="Payment QR Code" 
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-3 flex items-center gap-1.5">
              <QrCode size={11} className="text-primary" />
              Scan Here to Deposit
            </p>
          </div>

        </div>

        {/* Main Form Fields */}
        <div className="space-y-6">
          
          {/* Amount field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">Amount Paid (KSh)</label>
            <input 
              type="number"
              placeholder="e.g. 50,000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-muted/20 border border-border rounded-xl px-5 py-4 text-2xl font-black font-numbers focus:outline-none focus:ring-1 focus:ring-border transition-all text-foreground"
            />
          </div>

          {/* Minimalist selection buttons for proof method (completely optional) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">Verification Proof (Optional)</label>
              {mode !== "none" && (
                <button
                  type="button"
                  onClick={() => {
                    setMode("none");
                    setFile(null);
                    setFilePreview(null);
                    setSmsMessage("");
                  }}
                  className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Clear Proof
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode("upload")}
                className={`py-3 px-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  mode === "upload" 
                    ? "bg-foreground text-background border-foreground" 
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <Upload size={13} />
                Upload Screenshot
              </button>

              <button
                type="button"
                onClick={() => setMode("paste")}
                className={`py-3 px-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  mode === "paste" 
                    ? "bg-foreground text-background border-foreground" 
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <Clipboard size={13} />
                Paste Payment Message
              </button>
            </div>
          </div>

          {/* Verification input fields based on selection */}
          {mode !== "none" && (
            <div className="bg-card/30 border border-border/40 rounded-xl p-5 space-y-4 animate-in fade-in duration-300">
              
              {mode === "upload" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Screenshot Image</label>
                  <div className="border border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center relative hover:bg-muted/10 transition-all cursor-pointer">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {filePreview ? (
                      <div className="space-y-3 w-full flex flex-col items-center">
                        <img 
                          src={filePreview} 
                          alt="Screenshot Preview" 
                          className="max-h-[140px] rounded-lg border object-contain shadow-sm"
                        />
                        <p className="text-[9px] font-bold text-foreground truncate max-w-xs">{file?.name}</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <Upload size={16} className="text-muted-foreground mx-auto" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Choose receipt screenshot</p>
                        <p className="text-[8px] text-muted-foreground">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {mode === "paste" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment SMS Message</label>
                  <textarea
                    rows={4}
                    placeholder="Paste the transactional SMS received here..."
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-mono focus:outline-none transition-all text-foreground leading-relaxed"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Transaction Reference Code</label>
                <input 
                  type="text"
                  placeholder="e.g. QND5X9Y2P0"
                  value={referenceCode}
                  onChange={(e) => setReferenceCode(e.target.value.toUpperCase())}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-mono font-bold tracking-widest uppercase focus:outline-none text-foreground"
                />
              </div>

            </div>
          )}

          {/* Bottom Actions: Skip & Continue */}
          <div className="flex items-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="flex-1 py-4 border border-border text-center rounded-xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all active:scale-98"
            >
              Skip
            </Link>

            <button
              onClick={handleContinue}
              className="flex-1 py-4 bg-foreground text-background hover:opacity-90 text-center rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              Continue
            </button>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
