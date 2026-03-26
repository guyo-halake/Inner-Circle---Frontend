"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { formatKSh } from "@/lib/utils";
import { API_URL } from "@/lib/api";
import { 
  Users, 
  Wallet, 
  Zap,
  Plus,
  Edit2,
  Trash2,
  FileSpreadsheet,
  FileUp,
  Image as ImageIcon,
  Type,
  CheckCircle2,
  XCircle,
  Megaphone,
  PlusCircle,
  Upload
} from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"summary" | "investors" | "pools" | "updates" | "settings">("summary");
  const [pools, setPools] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [tradeForm, setTradeForm] = useState({
    asset: "",
    result: "Profit",
    amount: "",
    note: ""
  });

  const handleManualTrade = async () => {
    if (!tradeForm.asset || !tradeForm.amount) return alert("Fill in the fields");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/manual-trade`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify(tradeForm)
      });
      if (response.ok) {
        setTradeForm({ asset: "", result: "Profit", amount: "", note: "" });
        alert("Trade published!");
      }
    } catch (err) {
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
  }, [activeTab]);

  const fetchPools = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/pools`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await response.json();
      setPools(data);
    } catch (err) {}
  };

  const handleFileUpload = async (type: "csv" | "screenshot") => {
    if (!file) return alert("Select a file");
    setLoading(true);

    if (type === "csv") {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const csvData = e.target?.result;
            try {
                const response = await fetch(`${API_URL}/api/admin/import-trades`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json", 
                        Authorization: `Bearer ${localStorage.getItem("token")}` 
                    },
                    body: JSON.stringify({ csvData })
                });
                if (response.ok) alert("Auto-Sync Complete!");
            } catch (err) {
                alert("Import failed");
            } finally {
                setLoading(false);
                setFile(null);
            }
        };
        reader.readAsText(file);
    } else {
        // Handle image screenshot upload in production (S3/Cloudinary etc)
        setTimeout(() => {
          setLoading(false);
          setFile(null);
          alert("Trade proof posted to investors.");
        }, 1500);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto flex flex-col gap-8 font-sans">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-border/50 pb-6">
           <div>
              <h1 className="text-xl font-bold tracking-tight">Admin</h1>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1 italic">Logged in as Admin</p>
           </div>
           <div className="flex gap-1 p-0.5 bg-muted/40 border border-border/50 rounded-lg">
              {["summary", "investors", "pools", "updates", "settings"].map((tab) => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab as any)}
                   className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${activeTab === tab ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                 >
                   {tab}
                 </button>
              ))}
           </div>
        </div>

        {activeTab === "summary" && (
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in duration-500">
              {[
                { label: "Total Money", value: formatKSh(45212500) },
                { label: "Users", value: "842" },
                { label: "Profit this month", value: formatKSh(3245000) },
                { label: "System Status", value: "Working" },
              ].map((stat, i) => (
                <div key={i} className="bg-card/40 backdrop-blur-md border border-border/50 rounded-xl p-5 shadow-sm">
                   <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                   <p className="text-lg font-bold tracking-tight">{stat.value}</p>
                </div>
              ))}
              
              <div className="md:col-span-4 bg-card/40 backdrop-blur-md border border-border/50 rounded-xl p-6 shadow-sm mt-4">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                    <Megaphone size={12} />
                    Send Message to All
                 </h3>
                 <div className="flex gap-4">
                    <input 
                      placeholder="Type message for all investors..."
                      className="flex-grow bg-background/50 border border-border/50 rounded-lg px-4 py-2 text-xs focus:ring-1 focus:ring-primary/40 outline-none"
                    />
                    <button className="bg-primary text-white text-[10px] font-black uppercase px-6 py-2 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95">Send Now</button>
                 </div>
              </div>
           </div>
        )}

        {activeTab === "updates" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500 overflow-hidden">
             
             {/* Automatic Import Tool */}
             <div className="lg:col-span-1 bg-card/40 backdrop-blur-md border border-border/50 rounded-xl p-8 shadow-sm flex flex-col justify-between border-dashed border-2 hover:border-primary/40 group transition-all">
                <div className="text-center py-6">
                   <FileSpreadsheet size={40} className="mx-auto text-muted-foreground group-hover:text-primary mb-4 transition-colors" />
                   <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Import Trade Files</h3>
                   <p className="text-[9px] text-muted-foreground font-bold mt-2 italic">Drop MT5 CSV or Excel here to automatically update all investor earnings.</p>
                </div>
                <div className="space-y-4">
                   <input 
                     type="file" 
                     accept=".csv, .xlsx" 
                     onChange={(e) => setFile(e.target.files?.[0] || null)}
                     className="block w-full text-[9px] text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[9px] file:font-black file:uppercase file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                   />
                   <button 
                     disabled={loading || !file}
                     onClick={() => handleFileUpload("csv")}
                     className="w-full bg-primary text-white py-3 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                   >
                     {loading ? "Automatic Sync..." : <><Upload size={12} /> Sync From File</>}
                   </button>
                </div>
             </div>

             {/* Screenshot Upload Tool */}
             <div className="lg:col-span-1 bg-card/40 backdrop-blur-md border border-border/50 rounded-xl p-8 shadow-sm flex flex-col justify-between border-dashed border-2 hover:border-primary/40 group transition-all">
                <div className="text-center py-6">
                   <ImageIcon size={40} className="mx-auto text-muted-foreground group-hover:text-primary mb-4 transition-colors" />
                   <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Paste Trade Proof</h3>
                   <p className="text-[9px] text-muted-foreground font-bold mt-2 italic">Upload a screenshot of your successful trades for investors to see.</p>
                </div>
                <div className="space-y-4">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="block w-full text-[9px] text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[9px] file:font-black file:uppercase file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                    <button 
                      disabled={loading || !file}
                      onClick={() => handleFileUpload("screenshot")}
                      className="w-full bg-muted border border-border/50 text-foreground py-3 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? "Posting..." : <><CheckCircle2 size={12} /> Post Proof</>}
                    </button>
                </div>
             </div>

             {/* Manual Entry Fallback - Compact row at bottom */}
             <div className="lg:col-span-2 bg-card/40 backdrop-blur-md border border-border/50 rounded-xl p-6 shadow-sm border-dashed border-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                   <Type size={12} />
                   Type in a Trade manually
                </h4>
                <div className="flex flex-col md:flex-row gap-6 items-end">
                   <div className="flex-grow space-y-1">
                      <label className="text-[9px] font-black uppercase text-muted-foreground italic">Asset & Result</label>
                      <input className="w-full bg-background/50 border border-border/60 rounded-lg px-3 py-2 text-xs font-bold" placeholder="Gold Long (+1.2%)" />
                   </div>
                   <div className="w-32 space-y-1">
                      <label className="text-[9px] font-black uppercase text-muted-foreground">KSh Gain</label>
                      <input type="number" className="w-full bg-background/50 border border-border/60 rounded-lg px-3 py-2 text-xs font-bold" placeholder="50,000" value={tradeForm.amount} onChange={(e) => setTradeForm({...tradeForm, amount: e.target.value})} />
                   </div>
                   <button 
                     onClick={handleManualTrade}
                     disabled={loading}
                     className="bg-primary text-white py-3 px-8 rounded-lg text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all"
                   >
                     {loading ? "..." : "Publish Now"}
                   </button>
                </div>
             </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
