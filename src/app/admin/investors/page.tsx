"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import { API_URL } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  Users, 
  Search, 
  Trash2, 
  Eye, 
  Mail, 
  Phone, 
  MessageSquare,
  Globe, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  UserCheck, 
  ArrowLeft,
  X,
  ShieldAlert,
  UserX,
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Send
} from "lucide-react";
import { formatKSh } from "@/lib/utils";
import { toast } from "sonner";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Filler,
  Legend
);

interface Investor {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  country: string | null;
  isVerified: number;
  createdAt: string;
  totalInvestment: number;
}

export default function AdminInvestorsPage() {
  const { token, user } = useAuthStore();
  const router = useRouter();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Verified" | "Pending">("All");
  
  // Modal states
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Investor | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingVerification, setUpdatingVerification] = useState(false);

  const [investorDetail, setInvestorDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    if (!selectedInvestor || !token) {
      setInvestorDetail(null);
      return;
    }

    const loadDetail = async () => {
      try {
        setLoadingDetail(true);
        const response = await fetch(`${API_URL}/api/admin/investors/${selectedInvestor.id}/detail`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("auth-storage");
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to load investor details");
        }
        const data = await response.json();
        setInvestorDetail(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load investor details");
      } finally {
        setLoadingDetail(false);
      }
    };

    loadDetail();
  }, [selectedInvestor, token]);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedInvestor) return;
    if (!emailSubject.trim() || !emailBody.trim()) {
      toast.error("Subject and message body are required");
      return;
    }

    try {
      setSendingEmail(true);
      const response = await fetch(`${API_URL}/api/admin/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          to: selectedInvestor.email,
          subject: emailSubject,
          body: emailBody,
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send email");
      }
      toast.success("Email sent to investor successfully");
      setEmailSubject("");
      setEmailBody("");
    } catch (err: any) {
      toast.error(err.message || "Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

  const getWalletBalance = (type: string) => {
    if (!investorDetail?.wallets) return 0;
    const wallet = investorDetail.wallets.find((w: any) => w.type === type);
    return wallet ? Number(wallet.balance) : 0;
  };

  const fetchInvestors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/admin/investors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("auth-storage");
          window.location.href = "/login";
          return;
        }
        throw new Error("Failed to load investors");
      }
      const data = await response.json();
      setInvestors(data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load investors registry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      const role = user.role?.toLowerCase();
      if (role !== "admin" && role !== "developer") {
        router.replace("/dashboard");
      }
    }
  }, [user, router]);

  useEffect(() => {
    if (token) {
      fetchInvestors();
    }
  }, [token]);

  const handleDeleteInvestor = async (id: number) => {
    try {
      setDeleting(true);
      const response = await fetch(`${API_URL}/api/admin/investors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        toast.success("Investor registry and associated accounts cleared.");
        setShowDeleteConfirm(null);
        if (selectedInvestor?.id === id) {
          setSelectedInvestor(null);
        }
        fetchInvestors();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete investor");
      }
    } catch (err: any) {
      toast.error(err.message || "Error occurred while deleting investor");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleVerification = async (investor: Investor) => {
    const nextState = investor.isVerified === 0;
    try {
      setUpdatingVerification(true);
      const response = await fetch(`${API_URL}/api/admin/investors/${investor.id}/verification`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isVerified: nextState })
      });

      if (response.ok) {
        toast.success(`Investor ${nextState ? "verified" : "unverified"} successfully.`);
        // Update local state
        const updated = { ...investor, isVerified: nextState ? 1 : 0 };
        setInvestors(prev => prev.map(inv => inv.id === investor.id ? updated : inv));
        if (selectedInvestor?.id === investor.id) {
          setSelectedInvestor(updated);
        }
      } else {
        throw new Error("Failed to update verification status");
      }
    } catch (err: any) {
      toast.error(err.message || "Error toggling verification");
    } finally {
      setUpdatingVerification(false);
    }
  };

  const filteredInvestors = investors.filter(investor => {
    const matchSearch = 
      investor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (investor.phone && investor.phone.includes(searchQuery)) ||
      (investor.country && investor.country.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchFilter = 
      statusFilter === "All" ? true :
      statusFilter === "Verified" ? investor.isVerified === 1 :
      investor.isVerified === 0;

    return matchSearch && matchFilter;
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getAvatarGradient = (id: number) => {
    const gradients = [
      "from-blue-500 to-indigo-500",
      "from-emerald-500 to-teal-500",
      "from-purple-500 to-pink-500",
      "from-amber-500 to-orange-500",
      "from-cyan-500 to-blue-500",
    ];
    return gradients[id % gradients.length];
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 font-sans antialiased text-foreground">
        
        {selectedInvestor ? (
          /* --- DETAILED SUB-PAGE VIEW --- */
          <div className="space-y-6 animate-fadeIn">
            <div>
              <button
                onClick={() => setSelectedInvestor(null)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 font-semibold cursor-pointer"
              >
                <ArrowLeft size={13} /> Back to Investor Registry
              </button>
            </div>

            {loadingDetail ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <Loader2 className="animate-spin text-primary h-8 w-8" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Profile Card, Wallets & Contact Form */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* Profile Card */}
                  <section className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getAvatarGradient(selectedInvestor.id)} flex items-center justify-center font-black text-xl text-white mb-4 shadow-xl shadow-black/20`}>
                      {getInitials(selectedInvestor.fullName)}
                    </div>
                    <h2 className="text-lg font-sora font-semibold text-foreground mb-1">{selectedInvestor.fullName}</h2>
                    <p className="text-xs text-muted-foreground font-mono mb-4">{selectedInvestor.email}</p>
                    
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${Number(selectedInvestor.isVerified) === 1 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                      {Number(selectedInvestor.isVerified) === 1 ? 'Verified' : 'Unverified'}
                    </span>

                    <div className="w-full mt-6 space-y-3 text-left">
                      <div className="p-3 bg-muted/20 rounded-xl border border-border/40">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">Phone</p>
                        <p className="text-xs font-mono font-semibold text-foreground">{selectedInvestor.phone || 'N/A'}</p>
                      </div>
                      <div className="p-3 bg-muted/20 rounded-xl border border-border/40">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">Country</p>
                        <p className="text-xs font-semibold text-foreground">{selectedInvestor.country || 'N/A'}</p>
                      </div>
                      <div className="p-3 bg-muted/20 rounded-xl border border-border/40">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">Joined Date</p>
                        <p className="text-xs font-semibold text-foreground">{new Date(selectedInvestor.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="p-3 bg-muted/20 rounded-xl border border-border/40 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">Verification Status</p>
                          <p className="text-xs font-semibold text-foreground">
                            {selectedInvestor.isVerified === 1 ? "Verified Account" : "Pending Verification"}
                          </p>
                        </div>
                        <button
                          onClick={() => handleToggleVerification(selectedInvestor)}
                          disabled={updatingVerification}
                          className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline disabled:opacity-60 cursor-pointer"
                        >
                          {selectedInvestor.isVerified === 1 ? "Revoke" : "Verify"}
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Wallet Balances Card */}
                  <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Account Wallets</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3.5 bg-muted/20 border border-border/40 rounded-xl">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Pocket Hold</p>
                          <p className="text-xs text-muted-foreground/80 mt-0.5 font-medium">Unallocated Capital</p>
                        </div>
                        <p className="text-sm font-numbers font-bold text-foreground">{formatKSh(getWalletBalance('POCKET_HOLD'))}</p>
                      </div>
                      <div className="flex items-center justify-between p-3.5 bg-muted/20 border border-border/40 rounded-xl">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Pocket Allocation</p>
                          <p className="text-xs text-muted-foreground/80 mt-0.5 font-medium">Staked Portfolio</p>
                        </div>
                        <p className="text-sm font-numbers font-bold text-foreground">{formatKSh(getWalletBalance('POCKET_ALLOCATION'))}</p>
                      </div>
                      <div className="flex items-center justify-between p-3.5 bg-muted/20 border border-border/40 rounded-xl">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Pocket Yield</p>
                          <p className="text-xs text-muted-foreground/80 mt-0.5 font-medium">Earnings & Gains</p>
                        </div>
                        <p className="text-sm font-numbers font-bold text-emerald-500">{formatKSh(getWalletBalance('POCKET_YIELD'))}</p>
                      </div>
                    </div>
                  </section>

                  {/* Contact Email Form */}
                  <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact Investor</h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Send a message from the hedge fund admin email.</p>
                    </div>
                    <form onSubmit={handleSendEmail} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Subject</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Account Update"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          className="w-full bg-muted/20 border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Message Body</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Write your email details here..."
                          value={emailBody}
                          onChange={(e) => setEmailBody(e.target.value)}
                          className="w-full bg-muted/20 border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={sendingEmail}
                        className="w-full rounded-xl bg-primary text-primary-foreground font-bold py-2.5 text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
                      >
                        {sendingEmail ? (
                          <>
                            <Loader2 className="animate-spin" size={13} />
                            Sending Email...
                          </>
                        ) : (
                          <>
                            <Send size={13} />
                            Send Email
                          </>
                        )}
                      </button>
                    </form>
                  </section>

                </div>

                {/* Right Column: Growth Graph & Transaction History */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Portfolio Growth Graph (Chart.js) */}
                  <section className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Portfolio Growth</h3>
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Performance value log over time.</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Current Value</p>
                        <p className="font-numbers text-sm font-bold text-foreground">
                          {formatKSh(getWalletBalance('POCKET_HOLD') + getWalletBalance('POCKET_ALLOCATION') + getWalletBalance('POCKET_YIELD'))}
                        </p>
                      </div>
                    </div>
                    
                    <div className="h-64 relative w-full">
                      {investorDetail?.growthHistory && investorDetail.growthHistory.length > 0 ? (
                        <Line
                          data={{
                            labels: investorDetail.growthHistory.map((h: any) => 
                              new Date(h.date).toLocaleDateString("en-KE", { day: "numeric", month: "short" })
                            ),
                            datasets: [
                              {
                                fill: true,
                                label: 'Portfolio Value',
                                data: investorDetail.growthHistory.map((h: any) => h.value),
                                borderColor: 'rgb(244, 244, 245)', // Zinc border color
                                backgroundColor: 'rgba(244, 244, 245, 0.03)',
                                tension: 0.35,
                                borderWidth: 1.5,
                                pointRadius: 2.5,
                                pointBackgroundColor: 'rgb(244, 244, 245)',
                                pointBorderColor: 'transparent',
                                pointHoverRadius: 5,
                              },
                            ],
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { display: false },
                              tooltip: {
                                backgroundColor: 'rgba(9, 9, 11, 0.95)',
                                titleFont: { size: 10, weight: 'bold' },
                                bodyFont: { size: 11 },
                                padding: 10,
                                cornerRadius: 8,
                                displayColors: false,
                                borderWidth: 1,
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                              },
                            },
                            scales: {
                              x: {
                                grid: { display: false },
                                ticks: {
                                  color: 'rgba(255, 255, 255, 0.3)',
                                  font: { size: 9 },
                                },
                              },
                              y: {
                                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                                ticks: {
                                  color: 'rgba(255, 255, 255, 0.3)',
                                  font: { size: 9 },
                                  callback: (val: any) => `KSh ${val.toLocaleString()}`,
                                },
                              },
                            },
                          }}
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center border border-dashed border-border/50 rounded-xl text-xs text-muted-foreground/60">
                          No performance log data available.
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Financial History */}
                  <section className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-6">Financial History</h3>
                    
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                      {!investorDetail?.transactions || investorDetail.transactions.length === 0 ? (
                        <div className="p-8 text-center text-xs text-muted-foreground/60 border border-dashed border-border/60 rounded-xl font-medium">
                          No financial history available for this investor.
                        </div>
                      ) : (
                        investorDetail.transactions.map((tx: any) => (
                          <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border/40 bg-muted/5 rounded-xl hover:bg-muted/10 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'Deposit' ? 'bg-emerald-500/10 text-emerald-500' : tx.type === 'Withdrawal' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                {tx.type === 'Deposit' ? <ArrowDownLeft size={14} /> : tx.type === 'Withdrawal' ? <ArrowUpRight size={14} /> : <Activity size={14} />}
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-foreground">{tx.type}</p>
                                <p className="text-[10px] text-muted-foreground font-medium">{new Date(tx.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-numbers text-sm font-bold ${tx.type === 'Deposit' ? 'text-emerald-500' : tx.type === 'Withdrawal' ? 'text-orange-500' : 'text-blue-500'}`}>
                                {tx.type === 'Withdrawal' ? '-' : '+'}{formatKSh(Number(tx.amount))}
                              </p>
                              <span className={`text-[9px] uppercase tracking-widest font-bold ${tx.status === 'Approved' || tx.status === 'Completed' ? 'text-emerald-500' : tx.status === 'Rejected' ? 'text-destructive' : 'text-orange-500'}`}>
                                {tx.status}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </section>

                </div>

              </div>
            )}
          </div>
        ) : (
          /* --- DIRECTORY VIEW --- */
          <>
            {/* Back Link */}
            <div>
              <Link 
                href="/admin" 
                className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 font-semibold"
              >
                <ArrowLeft size={13} /> Back to Admin Console
              </Link>
            </div>

            {/* Header Block */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-2">
                  <Users className="text-primary" size={30} /> Investor Registry
                </h1>
                <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-40 mt-1">
                  Onboarded cap-table members and verification desk
                </p>
              </div>
              <div className="flex gap-3 text-xs font-black font-numbers bg-card border border-white/5 p-3 rounded-2xl">
                <div className="text-center px-4 border-r border-white/5">
                  <span className="block text-muted-foreground/50 text-[9px] uppercase tracking-wider">Total</span>
                  <span className="text-lg text-foreground">{investors.length}</span>
                </div>
                <div className="text-center px-4 border-r border-white/5">
                  <span className="block text-emerald-500/60 text-[9px] uppercase tracking-wider">Verified</span>
                  <span className="text-lg text-emerald-500">{investors.filter(i => i.isVerified === 1).length}</span>
                </div>
                <div className="text-center px-4">
                  <span className="block text-amber-500/60 text-[9px] uppercase tracking-wider">Pending</span>
                  <span className="text-lg text-amber-500">{investors.filter(i => i.isVerified === 0).length}</span>
                </div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="text"
                  placeholder="Search by name, email, phone or country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-card/40 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm focus:border-primary transition-colors outline-none text-foreground placeholder:text-muted-foreground/50"
                />
              </div>

              <div className="flex rounded-2xl border border-white/5 p-0.5 bg-card/20 text-xs font-black uppercase tracking-wider">
                {(["All", "Verified", "Pending"] as const).map((filterOpt) => (
                  <button
                    key={filterOpt}
                    onClick={() => setStatusFilter(filterOpt)}
                    className={`px-4 py-2.5 rounded-xl cursor-pointer transition-all ${
                      statusFilter === filterOpt
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {filterOpt}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Registry Table */}
            {loading ? (
              <div className="border border-white/5 bg-card/10 backdrop-blur-3xl rounded-3xl p-24 text-center text-sm text-muted-foreground font-semibold flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                Pulling register credentials from node database...
              </div>
            ) : filteredInvestors.length === 0 ? (
              <div className="border border-white/5 bg-card/10 backdrop-blur-3xl rounded-3xl p-20 text-center text-sm text-muted-foreground/60 flex flex-col items-center gap-4">
                <UserX size={44} className="text-muted-foreground/30 animate-pulse" />
                <div>
                  <p className="font-black text-lg text-foreground uppercase tracking-tight italic">No Investors Found</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm">No registry items matched the search queries or status filters selection.</p>
                </div>
              </div>
            ) : (
              <div className="border border-white/5 bg-card/10 backdrop-blur-3xl rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-medium">
                    <thead>
                      <tr className="border-b border-white/5 text-[9px] uppercase tracking-widest text-muted-foreground/60 bg-card/20 font-black">
                        <th className="py-4 px-6">Investor</th>
                        <th className="py-4 px-6">Contact Info</th>
                        <th className="py-4 px-6">Verification</th>
                        <th className="py-4 px-6 text-right">Total Invested</th>
                        <th className="py-4 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredInvestors.map((investor) => (
                        <tr 
                          key={investor.id} 
                          className="hover:bg-white/[0.02] transition-colors group"
                        >
                          {/* Name & Avatar */}
                          <td className="py-4.5 px-6 flex items-center gap-3.5">
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getAvatarGradient(investor.id)} flex items-center justify-center font-black text-xs text-white shrink-0 shadow-lg shadow-black/20`}>
                              {getInitials(investor.fullName)}
                            </div>
                            <div>
                              <span className="block font-black text-sm text-foreground uppercase tracking-tight italic group-hover:text-primary transition-colors">
                                {investor.fullName}
                              </span>
                              <span className="text-[10px] text-muted-foreground/60 font-semibold uppercase flex items-center gap-1">
                                <Globe size={10} /> {investor.country || "Kenya"}
                              </span>
                            </div>
                          </td>

                          {/* Contact Info */}
                          <td className="py-4.5 px-6">
                            <span className="block font-mono text-[11px] text-foreground/80">{investor.email}</span>
                            {investor.phone ? (
                              <span className="block font-mono text-[10px] text-muted-foreground/75 mt-0.5">{investor.phone}</span>
                            ) : (
                              <span className="block text-[10px] text-muted-foreground/40 italic mt-0.5">No phone linked</span>
                            )}
                          </td>

                          {/* Verification Status */}
                          <td className="py-4.5 px-6">
                            {investor.isVerified === 1 ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[8px] font-black uppercase bg-emerald-500/5 text-emerald-500 border border-emerald-500/10">
                                <CheckCircle2 size={10} /> Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[8px] font-black uppercase bg-amber-500/5 text-amber-500 border border-amber-500/10 animate-pulse">
                                <XCircle size={10} /> Pending
                              </span>
                            )}
                          </td>

                          {/* Total Invested */}
                          <td className="py-4.5 px-6 text-right font-numbers font-black text-sm text-foreground">
                            {formatKSh(Number(investor.totalInvestment))}
                          </td>

                          {/* Actions */}
                          <td className="py-4.5 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedInvestor(investor)}
                                title="View Profile Desk"
                                className="p-2.5 rounded-xl border border-white/5 bg-card/40 hover:bg-primary/10 hover:border-primary/20 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                              >
                                <Eye size={13} />
                              </button>
                              
                              {investor.phone && (
                                <a
                                  href={`https://wa.me/${investor.phone.replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  title="Chat on WhatsApp"
                                  className="p-2.5 rounded-xl border border-white/5 bg-card/40 hover:bg-emerald-500/10 hover:border-emerald-500/20 text-muted-foreground hover:text-emerald-500 transition-all"
                                >
                                  <MessageSquare size={13} />
                                </a>
                              )}

                              <a
                                href={`mailto:${investor.email}`}
                                title="Send Email"
                                className="p-2.5 rounded-xl border border-white/5 bg-card/40 hover:bg-blue-500/10 hover:border-blue-500/20 text-muted-foreground hover:text-blue-500 transition-all"
                              >
                                <Mail size={13} />
                              </a>

                              <button
                                onClick={() => setShowDeleteConfirm(investor)}
                                title="Delete Investor"
                                className="p-2.5 rounded-xl border border-white/5 bg-card/40 hover:bg-red-500/10 hover:border-red-500/20 text-muted-foreground hover:text-red-500 transition-all cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Modal: Confirm Deletion */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <div className="bg-card border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl relative text-center space-y-6 animate-in zoom-in-95 duration-150">
              
              <div className="mx-auto w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                <ShieldAlert size={22} />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black uppercase tracking-tight italic text-foreground">
                  Purge Investor Registry?
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  This action is permanent! You are deleting <strong className="text-foreground">{showDeleteConfirm.fullName}</strong>. All investments, wallets, transactions and logs will be permanently erased.
                </p>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  disabled={deleting}
                  className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-white/5 rounded-2xl text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Abort
                </button>
                <button
                  onClick={() => handleDeleteInvestor(showDeleteConfirm.id)}
                  disabled={deleting}
                  className="flex-1 bg-red-500 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="animate-spin" size={12} />
                      Purging...
                    </>
                  ) : (
                    "Purge Records"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
