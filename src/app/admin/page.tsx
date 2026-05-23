"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import { formatKSh } from "@/lib/utils";
import { API_URL } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Activity,
  ArrowDownLeft,
  ArrowRightLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Clock3,
  Copy,
  Database,
  FileText,
  FileUp,
  Inbox,
  Info,
  Laptop,
  Loader2,
  Mail,
  RefreshCw,
  Save,
  Send,
  Shield,
  Smartphone,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
  Wrench,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { io } from "socket.io-client";
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

type AdminTab = "overview" | "investors" | "team" | "funds" | "settings";

type Summary = {
  totalAUM: number;
  totalUsers: number;
  monthlyProfit: number;
};

type Investor = {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  country?: string;
  isVerified: 0 | 1;
  createdAt: string;
  balance?: number;
  totalInvestment?: number;
};

type Transaction = {
  id: number;
  userId: number;
  type: "Deposit" | "Withdrawal" | "Profit";
  amount: number;
  status: "Pending" | "Approved" | "Rejected" | "Unsuccessful";
  createdAt: string;
  investorName: string;
  investorEmail: string;
  methodDetails?: string;
};

type Pool = {
  id: number;
  name: string;
  category: "Stocks" | "MMF" | "Forex" | "Crypto";
  description?: string;
  current_yield: number;
  total_staked: number;
  risk_level: string;
};

type TradeProof = {
  id: number;
  asset: string;
  result: "Profit" | "Loss";
  amount: number;
  note?: string;
  created_at: string;
};

type TeamMember = {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  poolName?: string;
  managed_pool_id?: number | null;
  totalGrowth: number;
  createdAt: string;
};

async function fetchAuthed<T>(url: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("auth-storage");
    window.location.href = "/login";
    throw new Error("Session expired. Redirecting...");
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error || "Request failed");
  }
  return payload as T;
}

function AdminContent() {
  const { token, user } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get("tab") as AdminTab;
  const activeTab = tabParam || "overview";

  const setActiveTab = (tab: AdminTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`/admin?${params.toString()}`);
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Core Admin Data
  const [summary, setSummary] = useState<Summary>({ totalAUM: 0, totalUsers: 0, monthlyProfit: 0 });
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [pools, setPools] = useState<Pool[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tradeProofs, setTradeProofs] = useState<TradeProof[]>([]);

  // Developer settings state
  const [settingsState, setSettingsState] = useState({
    maintenance_mode: "false",
    disallow_logins: "false",
    paybill_number: "880100",
    account_number: "339025",
    support_email: "p3lcodes@gmail.com",
    app_version: "1.1.0",
    primary_theme: "zinc",
  });

  // Forms
  const [poolForm, setPoolForm] = useState({
    name: "",
    category: "Forex" as const,
    description: "",
    initial_yield: "",
    risk_level: "Moderate",
  });

  const [tradeForm, setTradeForm] = useState<{
    asset: string;
    result: "Profit" | "Loss";
    amount: string;
    note: string;
  }>({
    asset: "",
    result: "Profit",
    amount: "",
    note: "",
  });

  const [csvData, setCsvData] = useState("");
  const [userRoles, setUserRoles] = useState<string[]>(["Investor", "Admin", "Developer"]);
  const [addUserForm, setAddUserForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "Investor"
  });
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedPoolId, setSelectedPoolId] = useState<string>("");
  const [historySearch, setHistorySearch] = useState("");
  const [historyFilter, setHistoryFilter] = useState<"All" | "Deposit" | "Withdrawal">("All");
  const [simPoolId, setSimPoolId] = useState("");
  const [simProfit, setSimProfit] = useState("");

  // Audio / Real-time alerts
  const [prevPendingCount, setPrevPendingCount] = useState<number | null>(null);

  const refreshAdminData = useCallback(async () => {
    if (!token) return;

    try {
      const [
        summaryData,
        investorData,
        pendingData,
        poolsData,
        proofsData,
        allTxData,
        settingsData,
        teamData,
      ] = await Promise.all([
        fetchAuthed<Summary>(`${API_URL}/api/admin/summary`, token),
        fetchAuthed<Investor[]>(`${API_URL}/api/admin/investors`, token),
        fetchAuthed<Transaction[]>(`${API_URL}/api/admin/transactions/pending`, token),
        fetchAuthed<Pool[]>(`${API_URL}/api/admin/pools`, token),
        fetchAuthed<TradeProof[]>(`${API_URL}/api/portfolio/proofs`, token),
        fetchAuthed<Transaction[]>(`${API_URL}/api/admin/transactions/all`, token),
        fetchAuthed<Record<string, string>>(`${API_URL}/api/admin/settings`, token),
        fetchAuthed<TeamMember[]>(`${API_URL}/api/admin/team`, token),
      ]);

      setSummary(summaryData);
      setInvestors(investorData);
      setPendingTransactions(pendingData);
      setPools(poolsData);
      setTradeProofs(proofsData);
      setAllTransactions(allTxData);
      setSettingsState(settingsData as any);
      setTeamMembers(teamData);
    } catch (err: any) {
      console.error("Refresh error:", err);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const load = async () => {
      try {
        setError(null);
        if (mounted) setLoading(true);
        await refreshAdminData();
        await fetchRoles();
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load admin data");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    // Sockets listener for new transactions & settings
    const socket = io(API_URL);
    socket.on("connect", () => {
      console.log("Admin Socket connected");
    });

    socket.on("systemSettingsUpdate", (updatedKeys) => {
      setSettingsState((prev) => ({ ...prev, ...updatedKeys }));
    });

    // Refresh every 15s fallback
    const interval = setInterval(async () => {
      try {
        await refreshAdminData();
      } catch { }
    }, 15000);

    return () => {
      mounted = false;
      clearInterval(interval);
      socket.disconnect();
    };
  }, [token, refreshAdminData]);

  // Audio Alerts on new pending items
  useEffect(() => {
    if (prevPendingCount !== null && pendingTransactions.length > prevPendingCount) {
      toast.info(`New pending transaction request arrived!`, {
        description: `Total pending: ${pendingTransactions.length}`,
      });
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-500.wav");
      audio.volume = 0.45;
      audio.play().catch(() => { });
    }
    setPrevPendingCount(pendingTransactions.length);
  }, [pendingTransactions.length]);

  // Computations
  const pendingAmount = useMemo(
    () => pendingTransactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0),
    [pendingTransactions]
  );

  const pendingInvestors = useMemo(
    () => investors.filter((investor) => Number(investor.isVerified) === 0),
    [investors]
  );

  const pendingDeposits = useMemo(
    () => pendingTransactions.filter((tx) => tx.type === "Deposit"),
    [pendingTransactions]
  );

  const pendingWithdrawals = useMemo(
    () => pendingTransactions.filter((tx) => tx.type === "Withdrawal"),
    [pendingTransactions]
  );

  const filteredHistoryTransactions = useMemo(() => {
    return allTransactions.filter((tx) => {
      const matchSearch =
        tx.investorName.toLowerCase().includes(historySearch.toLowerCase()) ||
        tx.investorEmail.toLowerCase().includes(historySearch.toLowerCase()) ||
        (tx.status && tx.status.toLowerCase().includes(historySearch.toLowerCase()));

      const matchFilter =
        historyFilter === "All" ? true : tx.type === historyFilter;

      return matchSearch && matchFilter;
    });
  }, [allTransactions, historySearch, historyFilter]);

  const systemLogs = useMemo(() => {
    return allTransactions
      .filter((tx) => tx.status === "Approved")
      .slice(0, 10)
      .map((tx) => {
        const time = new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let message = "";
        if (tx.type === "Deposit") {
          message = `Deposit of ${formatKSh(Number(tx.amount))} approved for ${tx.investorName}`;
        } else if (tx.type === "Withdrawal") {
          message = `Payout of ${formatKSh(Number(tx.amount))} confirmed for ${tx.investorName}`;
        } else {
          message = `Yield of ${formatKSh(Number(tx.amount))} distributed to investor ID ${tx.userId}`;
        }
        return { time, message };
      });
  }, [allTransactions]);

  // Actions
  const onVerifyInvestor = async (id: number, isVerified: boolean) => {
    if (!token) return;
    try {
      setSaving(true);
      await fetchAuthed(`${API_URL}/api/admin/investors/${id}/verification`, token, {
        method: "PUT",
        body: JSON.stringify({ isVerified }),
      });
      toast.success("Investor verification status updated");
      await refreshAdminData();
    } catch (err: any) {
      toast.error(err.message || "Failed to verify investor");
    } finally {
      setSaving(false);
    }
  };

  const onProcessTransaction = async (id: number, status: "Approved" | "Rejected") => {
    if (!token) return;
    try {
      setSaving(true);
      await fetchAuthed(`${API_URL}/api/admin/transactions/${id}`, token, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      toast.success(`Transaction ${status.toLowerCase()} successfully`);
      await refreshAdminData();
    } catch (err: any) {
      toast.error(err.message || "Failed to process transaction");
    } finally {
      setSaving(false);
    }
  };

  const updateDeveloperSetting = async (key: string, value: string) => {
    if (!token) return;
    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/api/admin/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [key]: value }),
      });
      if (response.ok) {
        setSettingsState((prev) => ({ ...prev, [key]: value }));
        toast.success(`System config updated: ${key} = ${value}`);
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to update developer configuration");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update setting");
    } finally {
      setSaving(false);
    }
  };

  const onCreatePool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      setSaving(true);
      await fetchAuthed(`${API_URL}/api/admin/pools`, token, {
        method: "POST",
        body: JSON.stringify({
          ...poolForm,
          initial_yield: Number(poolForm.initial_yield || 0),
        }),
      });
      toast.success("Hedge fund pool created successfully");
      setPoolForm({ name: "", category: "Forex", description: "", initial_yield: "", risk_level: "Moderate" });
      await refreshAdminData();
    } catch (err: any) {
      toast.error(err.message || "Failed to create pool");
    } finally {
      setSaving(false);
    }
  };

  const onAssignPool = async (memberId: number, poolId: number | null) => {
    if (!token) return;
    try {
      await fetchAuthed(`${API_URL}/api/admin/team/${memberId}/pool`, token, {
        method: "PUT",
        body: JSON.stringify({ managed_pool_id: poolId }),
      });
      toast.success("Team member pool updated successfully");
      await refreshAdminData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update team pool");
    }
  };

  const onPublishManualTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      setSaving(true);
      await fetchAuthed(`${API_URL}/api/admin/manual-trade`, token, {
        method: "POST",
        body: JSON.stringify({
          asset: tradeForm.asset,
          result: tradeForm.result,
          amount: Number(tradeForm.amount || 0),
          note: tradeForm.note,
        }),
      });
      toast.success("Trade proof feed published");
      setTradeForm({ asset: "", result: "Profit", amount: "", note: "" });
      await refreshAdminData();
    } catch (err: any) {
      toast.error(err.message || "Failed to publish trade update");
    } finally {
      setSaving(false);
    }
  };

  const fetchRoles = useCallback(async () => {
    if (!token) return;
    try {
      const roles = await fetchAuthed<string[]>(`${API_URL}/api/admin/roles`, token);
      setUserRoles(roles);
      if (roles.length > 0) {
        setAddUserForm(prev => ({ ...prev, role: roles[0] }));
      }
    } catch (err) {
      console.error("Failed to load roles", err);
    }
  }, [token]);

  const onAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    if (addUserForm.password !== addUserForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setSaving(true);
      await fetchAuthed(`${API_URL}/api/admin/users`, token, {
        method: "POST",
        body: JSON.stringify({
          fullName: addUserForm.fullName,
          email: addUserForm.email,
          phone: addUserForm.phone,
          password: addUserForm.password,
          role: addUserForm.role
        })
      });

      toast.success(`User ${addUserForm.fullName} created successfully!`);
      setAddUserForm({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: userRoles[0] || "Investor"
      });
      await refreshAdminData();
    } catch (err: any) {
      toast.error(err.message || "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  const onImportTrades = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedPoolId || !csvData.trim()) return;
    try {
      setSaving(true);
      const res: any = await fetchAuthed(`${API_URL}/api/admin/import-trades`, token, {
        method: "POST",
        body: JSON.stringify({ csvData, poolId: Number(selectedPoolId) }),
      });
      toast.success(res?.message || "MT5 Trades imported and yields distributed!");
      setCsvData("");
      await refreshAdminData();
    } catch (err: any) {
      toast.error(err.message || "Failed to import performance data");
    } finally {
      setSaving(false);
    }
  };

  // Simulated App Update
  const [updatingSim, setUpdatingSim] = useState(false);
  const handleSimulateUpdate = () => {
    setUpdatingSim(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2500)),
      {
        loading: "Ingesting code updates from repo...",
        success: () => {
          setUpdatingSim(false);
          updateDeveloperSetting("app_version", "1.2.0");
          return "System upgraded to v1.2.0 successfully!";
        },
        error: "Compilation failed",
      }
    );
  };

  // Helpers
  const parseDetails = (detailsStr?: string) => {
    if (!detailsStr) return null;
    try {
      return JSON.parse(detailsStr);
    } catch (e) {
      return null;
    }
  };

  // Derived stats for Funds tab
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const approvedDeposits = allTransactions.filter(tx => tx.type === 'Deposit' && tx.status === 'Approved');
  const approvedWithdrawals = allTransactions.filter(tx => tx.type === 'Withdrawal' && tx.status === 'Approved');

  const calcTotal = (arr: Transaction[], since: Date) => arr.filter(tx => new Date(tx.createdAt) >= since).reduce((acc, curr) => acc + Number(curr.amount), 0);

  const fundsStats = {
    deposits: {
      today: calcTotal(approvedDeposits, today),
      week: calcTotal(approvedDeposits, lastWeek),
      month: calcTotal(approvedDeposits, lastMonth),
      total: approvedDeposits.reduce((acc, curr) => acc + Number(curr.amount), 0),
    },
    withdrawals: {
      today: calcTotal(approvedWithdrawals, today),
      week: calcTotal(approvedWithdrawals, lastWeek),
      month: calcTotal(approvedWithdrawals, lastMonth),
      total: approvedWithdrawals.reduce((acc, curr) => acc + Number(curr.amount), 0),
    }
  };

  const combinedPending = [...pendingDeposits, ...pendingWithdrawals].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const [selectedPendingTx, setSelectedPendingTx] = useState<Transaction | null>(null);
  const [selectedInvestorView, setSelectedInvestorView] = useState<Investor | null>(null);
  const [investorDetail, setInvestorDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    if (!selectedInvestorView || !token) {
      setInvestorDetail(null);
      return;
    }

    const loadDetail = async () => {
      try {
        setLoadingDetail(true);
        const data = await fetchAuthed<any>(`${API_URL}/api/admin/investors/${selectedInvestorView.id}/detail`, token);
        setInvestorDetail(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load investor details");
      } finally {
        setLoadingDetail(false);
      }
    };

    loadDetail();
  }, [selectedInvestorView, token]);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedInvestorView) return;
    if (!emailSubject.trim() || !emailBody.trim()) {
      toast.error("Subject and message body are required");
      return;
    }

    try {
      setSendingEmail(true);
      await fetchAuthed(`${API_URL}/api/admin/send-email`, token, {
        method: "POST",
        body: JSON.stringify({
          to: selectedInvestorView.email,
          subject: emailSubject,
          body: emailBody,
        }),
      });
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

  if (!token) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-3xl rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-amber-500 text-sm font-semibold flex items-center gap-3">
          <Info size={16} />
          Please log in to access the owner admin console.
        </div>
      </DashboardLayout>
    );
  }

  const role = user?.role?.toLowerCase();
  if (role !== "admin" && role !== "developer") {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-red-500 text-sm font-semibold flex items-center gap-3">
          <Shield size={16} />
          This page is restricted to owner and administrator accounts.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6 pb-12 font-sans antialiased text-foreground">

        {/* Header Block / Welcome Section */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-white/5">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground font-sora">
              Hey, {user?.fullName || "Admin"}.
            </p>
            <h1 className="text-sm font-normal italic text-muted-foreground" style={{ fontFamily: "'Georgia', serif" }}>
              Welcome to InnerCircle Hedgefund.
            </h1>
          </div>

          {/* Right Side: Minimalist Tab Switchers */}
          <nav className="flex flex-wrap gap-1 md:gap-2">
            {[
              { key: "overview", label: "Overview", icon: Activity },
              { key: "investors", label: "Investors", icon: Users },
              { key: "team", label: "MyTeam", icon: Shield },
              { key: "funds", label: "Deposits & Withdrawals", icon: Wallet, badge: pendingTransactions.length },
              { key: "settings", label: "Settings", icon: Wrench },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium cursor-pointer transition-all relative font-sans ${
                    active
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-black/5"
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="ml-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white font-numbers">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </header>

        {error && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-xs text-destructive font-semibold flex items-center gap-2">
            <XCircle size={14} />
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center text-xs text-muted-foreground font-semibold flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            Loading dashboard data...
          </div>
        ) : (
          <main className="space-y-6">

            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Left 2/3: Fund Performance + Investor Activity */}
                <div className="lg:col-span-2 space-y-6">

                  {/* Card 1: Fund Performance */}
                  <section className="bg-card rounded-2xl p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-sm font-semibold font-sora tracking-tight">Fund Performance</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Live investment status across the platform.</p>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-medium bg-muted/30 px-2.5 py-1 rounded-full">Auto-refresh · 15s</span>
                    </div>

                    <div className="grid grid-cols-3 gap-px bg-border/30 rounded-xl overflow-hidden">
                      <div className="bg-card p-4 space-y-1">
                        <span className="block text-[11px] text-muted-foreground font-medium">Total Capital</span>
                        <span className="font-numbers font-semibold text-xl text-foreground tracking-tight">{formatKSh(summary.totalAUM || 0)}</span>
                        <span className="block text-[10px] text-muted-foreground">Funds under management</span>
                      </div>
                      <div className="bg-card p-4 space-y-1">
                        <span className="block text-[11px] text-muted-foreground font-medium">Profit Paid Out</span>
                        <span className="font-numbers font-semibold text-xl text-foreground tracking-tight">+{formatKSh(summary.monthlyProfit || 0)}</span>
                        <span className="block text-[10px] text-muted-foreground">Last 30 days</span>
                      </div>
                      <div className="bg-card p-4 space-y-1">
                        <span className="block text-[11px] text-muted-foreground font-medium">Active Members</span>
                        <span className="font-numbers font-semibold text-xl text-foreground tracking-tight">{summary.totalUsers}</span>
                        <span className="block text-[10px] text-muted-foreground">Verified investors</span>
                      </div>
                    </div>

                    {pools.length > 0 && (
                      <div className="space-y-2.5 pt-2 border-t border-border/30">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-muted-foreground">Capital allocation by desk</span>
                          <span className="font-numbers text-xs font-semibold text-foreground">{formatKSh(pools.reduce((sum, p) => sum + Number(p.total_staked || 0), 0))}</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden flex">
                          {pools.map((p, idx) => {
                            const total = pools.reduce((s, pool) => s + Number(pool.total_staked || 0), 0) || 1;
                            const pct = (Number(p.total_staked || 0) / total) * 100;
                            const colors = ["bg-foreground", "bg-foreground/60", "bg-foreground/35", "bg-foreground/15"];
                            return pct > 0 ? <div key={p.id} style={{ width: `${pct}%` }} className={`${colors[idx % colors.length]} h-full`} title={`${p.name}: ${pct.toFixed(1)}%`} /> : null;
                          })}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          {pools.map((p, idx) => {
                            const total = pools.reduce((s, pool) => s + Number(pool.total_staked || 0), 0) || 1;
                            const pct = (Number(p.total_staked || 0) / total) * 100;
                            const dotColors = ["bg-foreground", "bg-foreground/60", "bg-foreground/35", "bg-foreground/15"];
                            return (
                              <div key={p.id} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                <span className={`rounded-full shrink-0 h-1.5 w-1.5 ${dotColors[idx % dotColors.length]}`} />
                                {p.name} · {pct.toFixed(0)}%
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Card 2: Investor Activity */}
                  <section className="bg-card rounded-2xl p-6 space-y-5">
                    <div>
                      <h2 className="text-sm font-semibold font-sora tracking-tight">Investor Activity</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Top investors by investment and latest moves.</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider pb-1">Highest investments</p>
                      {investors
                        .filter(inv => Number(inv.isVerified) === 1)
                        .sort((a, b) => Number(b.balance || 0) - Number(a.balance || 0))
                        .slice(0, 5)
                        .map((inv) => {
                          const totalAUM = summary.totalAUM || 1;
                          const share = ((Number(inv.balance || 0) / totalAUM) * 100).toFixed(1);
                          const initials = inv.fullName?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "—";
                          return (
                            <div key={inv.id} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-black/[0.03] transition-colors">
                              <span className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center text-[11px] font-semibold text-foreground shrink-0">{initials}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-foreground truncate">{inv.fullName}</p>
                                <div className="mt-1.5 h-1 w-full bg-muted/50 rounded-full overflow-hidden">
                                  <div className="h-full bg-foreground/50 rounded-full" style={{ width: `${Math.min(Number(share), 100)}%` }} />
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="font-numbers text-xs font-semibold text-foreground">{formatKSh(Number(inv.balance || 0))}</p>
                                <p className="text-[10px] text-muted-foreground">{share}% of fund</p>
                              </div>
                            </div>
                          );
                        })}
                      {investors.filter(inv => Number(inv.isVerified) === 1).length === 0 && (
                        <p className="text-xs text-muted-foreground py-4 text-center">No verified investors yet.</p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-border/30 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(["Deposit", "Withdrawal"] as const).map(type => {
                        const tx = allTransactions
                          .filter(t => t.type === type && t.status === "Approved")
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                        return (
                          <div key={type} className="rounded-xl bg-muted/20 p-3.5 space-y-0.5">
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Last {type}</span>
                            {tx ? (
                              <>
                                <p className="text-xs font-semibold text-foreground pt-0.5">{tx.investorName}</p>
                                <p className="font-numbers font-bold text-base text-foreground">{formatKSh(Number(tx.amount))}</p>
                                <p className="text-[10px] text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}</p>
                              </>
                            ) : (
                              <p className="text-xs text-muted-foreground pt-1">No {type.toLowerCase()}s yet.</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>

                {/* Right 1/3: Profit Calculator + Recents */}
                <div className="space-y-6">

                  {/* Card 3: Profit Calculator */}
                  <section className="bg-card rounded-2xl p-5 space-y-4">
                    <div>
                      <h2 className="text-sm font-semibold tracking-tight font-sora">Profit Calculator</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">30% return after 6 months.</p>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Investment Amount (KSh)</label>
                        <input
                          type="number"
                          value={simProfit}
                          onChange={(e) => setSimProfit(e.target.value)}
                          placeholder="Input amount to predict profit"
                          className="w-full bg-muted/20 border border-border rounded-xl px-4 py-2.5 text-sm font-numbers font-semibold focus:outline-none focus:ring-2 focus:ring-foreground/20 text-foreground placeholder:text-muted-foreground/40 transition"
                        />
                      </div>
                      {simProfit && Number(simProfit) > 0 && (
                        <div className="animate-in fade-in duration-200 space-y-2 pt-3 border-t border-border/30">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Profit (30%)</span>
                            <span className="font-numbers font-semibold text-foreground">+{formatKSh(Number(simProfit) * 0.30)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Total at maturity</span>
                            <span className="font-numbers font-semibold text-foreground">{formatKSh(Number(simProfit) * 1.30)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Monthly estimate</span>
                            <span className="font-numbers font-semibold text-foreground">~{formatKSh((Number(simProfit) * 0.30) / 6)}/mo</span>
                          </div>
                          <div className="pt-1.5 border-t border-border/30">
                            <span className="text-[10px] text-muted-foreground">30% flat · 6-month lock-in period</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Card 4: Recents */}
                  <section className="bg-card rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-sm font-semibold tracking-tight font-sora">Recents</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Latest platform activity.</p>
                      </div>
                      {systemLogs.length > 0 && (
                        <span className="text-[11px] font-medium text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-full">{systemLogs.length}</span>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      {systemLogs.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border/50 p-6 text-center text-xs text-muted-foreground/60 flex flex-col items-center gap-2">
                          <Activity size={18} className="text-muted-foreground/30" />
                          No activity yet.
                        </div>
                      ) : (
                        systemLogs.map((log, i) => (
                          <div key={i} className="flex items-start gap-3 px-2 py-2.5 rounded-xl hover:bg-black/[0.03] transition-colors">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-foreground leading-snug">{log.message}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5 font-numbers">{log.time}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </section>
                </div>

              </div>
            )}

            {/* TAB: INVESTORS */}
            {activeTab === "investors" && (
              <div className="space-y-6">
                {selectedInvestorView ? (
                  /* --- INVESTOR DEEP DIVE VIEW --- */
                  <div className="space-y-6 animate-fadeIn">
                    <button
                      onClick={() => setSelectedInvestorView(null)}
                      className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowDownLeft size={14} className="rotate-45" /> Back to Directory
                    </button>

                    {loadingDetail ? (
                      <div className="flex items-center justify-center min-h-[300px]">
                        <Loader2 className="animate-spin text-primary h-8 w-8" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Left Column: Profile, Wallet Cards & Contact Form */}
                        <div className="lg:col-span-1 space-y-6">
                          
                          {/* Profile Card */}
                          <section className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-sora font-semibold text-primary mb-4">
                              {selectedInvestorView.fullName.substring(0, 2).toUpperCase()}
                            </div>
                            <h2 className="text-lg font-sora font-semibold text-foreground mb-1">{selectedInvestorView.fullName}</h2>
                            <p className="text-xs text-muted-foreground font-mono mb-4">{selectedInvestorView.email}</p>
                            
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${Number(selectedInvestorView.isVerified) === 1 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                              {Number(selectedInvestorView.isVerified) === 1 ? 'Verified' : 'Unverified'}
                            </span>

                            <div className="w-full mt-6 space-y-3 text-left">
                              <div className="p-3 bg-muted/20 rounded-xl border border-border/40">
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Phone</p>
                                <p className="text-xs font-mono font-semibold text-foreground">{selectedInvestorView.phone || 'N/A'}</p>
                              </div>
                              <div className="p-3 bg-muted/20 rounded-xl border border-border/40">
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Country</p>
                                <p className="text-xs font-semibold text-foreground">{selectedInvestorView.country || 'N/A'}</p>
                              </div>
                              <div className="p-3 bg-muted/20 rounded-xl border border-border/40">
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Joined Date</p>
                                <p className="text-xs font-semibold text-foreground">{new Date(selectedInvestorView.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </section>

                          {/* Wallet Balances Card */}
                          <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Account Wallets</h3>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3.5 bg-muted/20 border border-border/40 rounded-xl">
                                <div>
                                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Pocket Hold</p>
                                  <p className="text-xs text-muted-foreground/80 mt-0.5">Unallocated Capital</p>
                                </div>
                                <p className="text-sm font-numbers font-bold text-foreground">{formatKSh(getWalletBalance('POCKET_HOLD'))}</p>
                              </div>
                              <div className="flex items-center justify-between p-3.5 bg-muted/20 border border-border/40 rounded-xl">
                                <div>
                                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Pocket Allocation</p>
                                  <p className="text-xs text-muted-foreground/80 mt-0.5">Staked Portfolio</p>
                                </div>
                                <p className="text-sm font-numbers font-bold text-foreground">{formatKSh(getWalletBalance('POCKET_ALLOCATION'))}</p>
                              </div>
                              <div className="flex items-center justify-between p-3.5 bg-muted/20 border border-border/40 rounded-xl">
                                <div>
                                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Pocket Yield</p>
                                  <p className="text-xs text-muted-foreground/80 mt-0.5">Earnings & Gains</p>
                                </div>
                                <p className="text-sm font-numbers font-bold text-emerald-500">{formatKSh(getWalletBalance('POCKET_YIELD'))}</p>
                              </div>
                            </div>
                          </section>

                          {/* Contact Email Form */}
                          <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
                            <div>
                              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact Investor</h3>
                              <p className="text-[10px] text-muted-foreground mt-0.5">Send a message from the hedge fund admin email.</p>
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
                                <p className="text-[10px] text-muted-foreground mt-0.5">Performance value log over time.</p>
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
                                <div className="p-8 text-center text-xs text-muted-foreground/60 border border-dashed border-border/60 rounded-xl">
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
                                        <p className="text-[10px] text-muted-foreground">{new Date(tx.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
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
                  /* --- MAIN INVESTORS LIST --- */
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Verification Queue */}
                    <div className="lg:col-span-1 space-y-6">
                      <section className="bg-card border border-border rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-5">
                          <h2 className="text-sm font-semibold font-sora">Pending Verification</h2>
                          <span className="font-numbers text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {pendingInvestors.length} new
                          </span>
                        </div>

                        <div className="space-y-4">
                          {pendingInvestors.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-xs text-muted-foreground/60">
                              No signups awaiting verification.
                            </div>
                          ) : (
                            pendingInvestors.map((investor) => (
                              <div key={investor.id} className="rounded-xl border border-border/60 bg-muted/5 p-4 flex flex-col gap-4">
                                <div>
                                  <p className="text-sm font-semibold text-foreground">{investor.fullName}</p>
                                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{investor.email}</p>
                                </div>
                                <button
                                  onClick={() => onVerifyInvestor(investor.id, true)}
                                  disabled={saving}
                                  className="w-full rounded-lg bg-foreground text-background font-semibold text-xs py-2 hover:opacity-90 transition-opacity disabled:opacity-60"
                                >
                                  Approve Investor
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </section>
                    </div>

                    {/* Active Directory */}
                    <div className="lg:col-span-2 space-y-6">
                      <section className="bg-card border border-border rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-5">
                          <h2 className="text-sm font-semibold font-sora">Investor Directory</h2>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{investors.filter(i => Number(i.isVerified) === 1).length} Members</p>
                        </div>

                        <div className="grid gap-3">
                          {investors.filter(inv => Number(inv.isVerified) === 1).length === 0 ? (
                            <div className="p-8 text-center text-xs text-muted-foreground/60 border border-dashed border-border/60 rounded-xl">
                              No active investors registered yet.
                            </div>
                          ) : (
                            investors.filter(inv => Number(inv.isVerified) === 1).map((inv) => (
                              <div key={inv.id} className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:bg-muted/10 transition-colors group cursor-pointer" onClick={() => setSelectedInvestorView(inv)}>
                                <div className="flex items-center gap-4">
                                  <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center text-xs font-semibold text-foreground">
                                    {inv.fullName.substring(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{inv.fullName}</p>
                                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{inv.email}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-6">
                                  <div className="text-right hidden sm:block">
                                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Balance</p>
                                    <p className="font-numbers text-xs font-semibold">{formatKSh(Number(inv.balance || 0))}</p>
                                  </div>
                                  <ArrowDownLeft size={16} className="text-muted-foreground/40 rotate-180 group-hover:text-primary group-hover:translate-x-1 transition-all" />
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
            )}

            {/* TAB: MY TEAM */}
            {activeTab === "team" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold font-sora tracking-tight">My Team</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">All team members, their roles, and platform activity.</p>
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-full">{teamMembers.length} members</span>
                </div>

                {teamMembers.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/60 p-16 text-center flex flex-col items-center gap-3">
                    <Users size={28} className="text-muted-foreground/30" />
                    <p className="text-xs text-muted-foreground">No team members found.</p>
                  </div>
                ) : (
                  <section className="bg-card rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-border/40">
                          <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Member</th>
                          <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Phone</th>
                          <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Role</th>
                          <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Pool</th>
                          <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Growth</th>
                          <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {teamMembers.map((member) => {
                          const initials = member.fullName?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "—";
                          return (
                            <tr key={member.id} className="hover:bg-black/[0.02] transition-colors">
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                  <span className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center text-[11px] font-semibold text-foreground shrink-0">{initials}</span>
                                  <div>
                                    <p className="text-xs font-semibold text-foreground">{member.fullName}</p>
                                    <p className="text-[11px] text-muted-foreground">{member.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3.5 hidden sm:table-cell">
                                <span className="text-xs text-muted-foreground font-numbers">{member.phone || "—"}</span>
                              </td>
                              <td className="px-5 py-3.5 hidden md:table-cell">
                                <span className="text-[11px] font-medium text-foreground bg-muted/40 px-2 py-0.5 rounded-md capitalize">{member.role}</span>
                              </td>
                              <td className="px-5 py-3.5 hidden lg:table-cell">
                                <select
                                  value={member.managed_pool_id || ""}
                                  onChange={async (e) => {
                                    const val = e.target.value;
                                    const poolId = val === "" ? null : Number(val);
                                    await onAssignPool(member.id, poolId);
                                  }}
                                  className="text-xs bg-muted/20 hover:bg-muted/40 text-foreground border border-border/20 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-foreground/10 transition-all cursor-pointer font-medium"
                                >
                                  <option value="" className="bg-card text-foreground">Unassigned</option>
                                  {pools.map(p => (
                                    <option key={p.id} value={p.id} className="bg-card text-foreground">
                                      {p.name}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-5 py-3.5 hidden lg:table-cell">
                                <span className="font-numbers text-xs font-semibold text-foreground">
                                  {Number(member.totalGrowth) > 0 ? `+${formatKSh(Number(member.totalGrowth))}` : "—"}
                                </span>
                              </td>
                              <td className="px-5 py-3.5">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    title="View member"
                                    className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                                  >
                                    <Info size={13} />
                                  </button>
                                  <a
                                    href={`mailto:${member.email}`}
                                    title="Contact member"
                                    className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                  >
                                    <Mail size={13} />
                                  </a>
                                  <button
                                    title="Remove member"
                                    onClick={() => toast.error(`Remove ${member.fullName}? Use the database panel to delete team members.`)}
                                    className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                                  >
                                    <XCircle size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </section>
                )}
              </div>
            )}

            {/* TAB: DEPOSITS & WITHDRAWALS */}
            {activeTab === "funds" && (
              <div className="space-y-6">
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Deposits Stats */}
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold font-sora">Deposit Volume</h3>
                      <span className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <ArrowDownLeft size={16} />
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Today</p>
                        <p className="font-numbers text-sm font-bold text-foreground">{formatKSh(fundsStats.deposits.today)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">7 Days</p>
                        <p className="font-numbers text-sm font-bold text-foreground">{formatKSh(fundsStats.deposits.week)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">30 Days</p>
                        <p className="font-numbers text-sm font-bold text-foreground">{formatKSh(fundsStats.deposits.month)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Withdrawals Stats */}
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold font-sora">Withdrawal Volume</h3>
                      <span className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Today</p>
                        <p className="font-numbers text-sm font-bold text-foreground">{formatKSh(fundsStats.withdrawals.today)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">7 Days</p>
                        <p className="font-numbers text-sm font-bold text-foreground">{formatKSh(fundsStats.withdrawals.week)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">30 Days</p>
                        <p className="font-numbers text-sm font-bold text-foreground">{formatKSh(fundsStats.withdrawals.month)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pending Actions lists */}
                <section className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                  
                  {/* Left Column: List of Pending */}
                  <div className="w-full md:w-1/3 border-r border-border/40 flex flex-col">
                    <div className="p-5 border-b border-border/40 flex items-center justify-between bg-muted/10">
                      <div>
                        <h2 className="text-sm font-semibold font-sora tracking-tight">Action Queue</h2>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Pending user requests</p>
                      </div>
                      <span className="font-numbers text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                        {combinedPending.length} pending
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[500px]">
                      {combinedPending.length === 0 ? (
                        <div className="p-8 text-center text-xs text-muted-foreground/60 flex flex-col items-center gap-2">
                          <Inbox size={22} className="text-muted-foreground/30" />
                          No pending requests.
                        </div>
                      ) : (
                        <ul className="divide-y divide-border/20">
                          {combinedPending.map(item => (
                            <li key={item.id}>
                              <button
                                onClick={() => setSelectedPendingTx(item)}
                                className={`w-full text-left p-4 hover:bg-muted/30 transition-colors flex items-center justify-between gap-3 ${selectedPendingTx?.id === item.id ? 'bg-muted/40 border-l-2 border-primary' : 'border-l-2 border-transparent'}`}
                              >
                                <div className="flex-1 truncate">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`h-2 w-2 rounded-full ${item.type === 'Deposit' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                                    <p className="text-xs font-semibold text-foreground truncate">{item.investorName}</p>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground font-mono truncate">{item.investorEmail}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className={`font-numbers text-xs font-bold ${item.type === 'Deposit' ? 'text-emerald-500' : 'text-orange-500'}`}>
                                    {item.type === 'Deposit' ? '+' : '-'}{formatKSh(Number(item.amount))}
                                  </p>
                                  <p className="text-[9px] text-muted-foreground mt-1">
                                    {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                  </p>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Details & Approval */}
                  <div className="w-full md:w-2/3 flex flex-col bg-muted/5">
                    {selectedPendingTx ? (
                      <div className="flex-1 flex flex-col h-full">
                        <div className="p-6 border-b border-border/40">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${selectedPendingTx.type === 'Deposit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                              {selectedPendingTx.type}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              ID: #{selectedPendingTx.id}
                            </span>
                          </div>
                          <h3 className="text-2xl font-sora font-semibold text-foreground mb-1">
                            {formatKSh(Number(selectedPendingTx.amount))}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Requested by <strong className="text-foreground">{selectedPendingTx.investorName}</strong> ({selectedPendingTx.investorEmail})
                          </p>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Proof & Details</h4>
                          
                          {(() => {
                            const details = parseDetails(selectedPendingTx.methodDetails);
                            if (!details) {
                              return <p className="text-xs italic text-muted-foreground">No details provided.</p>;
                            }

                            return (
                              <div className="space-y-6">
                                {selectedPendingTx.type === 'Deposit' ? (
                                  <>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="bg-card border border-border p-3 rounded-xl">
                                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Reference Code</p>
                                        <p className="font-mono text-xs font-semibold">{details.referenceCode || '—'}</p>
                                      </div>
                                      <div className="bg-card border border-border p-3 rounded-xl">
                                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Phone Number</p>
                                        <p className="font-mono text-xs font-semibold">{details.phoneNumber || '—'}</p>
                                      </div>
                                    </div>

                                    {details.smsMessage && (
                                      <div>
                                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-2">Pasted SMS / Message</p>
                                        <div className="bg-card border border-border/60 p-4 rounded-xl font-mono text-xs leading-relaxed text-foreground whitespace-pre-wrap shadow-sm">
                                          {details.smsMessage}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  // Withdrawal Details
                                  <div className="bg-card border border-border p-4 rounded-xl space-y-3">
                                    <p className="text-xs font-semibold border-b border-border/40 pb-2">Payout Target Instructions</p>
                                    {details.phoneNumber ? (
                                      <p className="text-sm">
                                        M-Pesa Mobile: <code className="bg-muted px-2 py-1 rounded font-mono font-bold">{details.phoneNumber}</code>
                                      </p>
                                    ) : details.bankName ? (
                                      <div className="space-y-1 text-sm">
                                        <p><span className="text-muted-foreground w-24 inline-block">Bank:</span> <strong>{details.bankName}</strong></p>
                                        <p><span className="text-muted-foreground w-24 inline-block">Account #:</span> <strong>{details.accountNumber}</strong></p>
                                        <p><span className="text-muted-foreground w-24 inline-block">Name:</span> <strong>{details.accountName}</strong></p>
                                      </div>
                                    ) : (
                                      <p className="text-xs italic text-muted-foreground">No target specified.</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>

                        <div className="p-6 border-t border-border/40 bg-card flex justify-end gap-3 mt-auto">
                          <button
                            onClick={async () => {
                              await onProcessTransaction(selectedPendingTx.id, "Rejected");
                              setSelectedPendingTx(null);
                            }}
                            disabled={saving}
                            className="px-5 py-2.5 rounded-xl border border-destructive/20 text-destructive text-xs font-bold hover:bg-destructive/10 transition-colors disabled:opacity-50"
                          >
                            Reject Request
                          </button>
                          <button
                            onClick={async () => {
                              await onProcessTransaction(selectedPendingTx.id, "Approved");
                              setSelectedPendingTx(null);
                            }}
                            disabled={saving}
                            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                          >
                            {selectedPendingTx.type === 'Deposit' ? 'Approve Deposit' : 'Confirm Payout Sent'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground/50">
                        <Inbox size={48} className="mb-4 opacity-20" />
                        <p className="text-sm">Select a pending request from the queue to view proofs and take action.</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Completed Transaction Ledger */}
                <section className="bg-card border border-border rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
                    <div>
                      <h2 className="text-sm font-black tracking-tight">Completed Transactions Ledger</h2>
                      <p className="text-[10px] text-muted-foreground">Historical records of all deposits and withdrawals.</p>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Search name, email..."
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        className="bg-muted/20 border border-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-border text-foreground max-w-[200px]"
                      />

                      <div className="flex rounded-xl border border-border p-0.5 bg-muted/20 text-[10px] font-bold">
                        {(["All", "Deposit", "Withdrawal"] as const).map((filterOpt) => (
                          <button
                            key={filterOpt}
                            onClick={() => setHistoryFilter(filterOpt)}
                            className={`px-3 py-1.5 rounded-lg cursor-pointer ${historyFilter === filterOpt
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                              }`}
                          >
                            {filterOpt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border/40 text-[10px] uppercase font-black tracking-widest text-muted-foreground/70">
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Investor</th>
                          <th className="py-3 px-4">Type</th>
                          <th className="py-3 px-4">Amount</th>
                          <th className="py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20 font-medium">
                        {filteredHistoryTransactions.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-muted-foreground/60 font-black">
                              No matching logs found.
                            </td>
                          </tr>
                        ) : (
                          filteredHistoryTransactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-muted/10">
                              <td className="py-3.5 px-4 font-mono text-[10px] text-muted-foreground">
                                {new Date(tx.createdAt).toLocaleString()}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="block font-black text-foreground">{tx.investorName}</span>
                                <span className="block text-[10px] text-muted-foreground font-mono">{tx.investorEmail}</span>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-block font-black tracking-tight text-[10px] uppercase ${tx.type === "Deposit"
                                    ? "text-emerald-500"
                                    : tx.type === "Withdrawal"
                                      ? "text-orange-500"
                                      : "text-blue-500"
                                  }`}>
                                  {tx.type}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-numbers font-black text-sm text-foreground">
                                {formatKSh(Number(tx.amount))}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase border ${tx.status === "Approved"
                                    ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10"
                                    : tx.status === "Pending"
                                      ? "bg-amber-500/5 text-amber-500 border-amber-500/10"
                                      : "bg-destructive/5 text-destructive border-destructive/10"
                                  }`}>
                                  {tx.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>

              </div>
            )}

            {/* TAB: SETTINGS */}
            {activeTab === "settings" && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* System Access & Control */}
                <div className="space-y-6">
                  <section className="bg-card border border-border rounded-2xl p-5 space-y-4">
                    <div>
                      <h2 className="text-sm font-black tracking-tight">System Controls</h2>
                      <p className="text-[10px] text-muted-foreground">Manage main app settings.</p>
                    </div>

                    <div className="space-y-4 divide-y divide-border/40">
                      {/* Maintenance mode switch */}
                      <div className="flex items-center justify-between py-2">
                        <div className="space-y-0.5 max-w-[80%]">
                          <label className="text-xs font-black tracking-tight flex items-center gap-1.5 text-foreground">
                            <Wrench size={13} className="text-muted-foreground" />
                            Maintenance Mode
                          </label>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">
                            Turn on maintenance mode to lock out normal users.
                          </p>
                        </div>
                        <button
                          onClick={() => updateDeveloperSetting("maintenance_mode", settingsState.maintenance_mode === "true" ? "false" : "true")}
                          className="text-primary hover:opacity-80 transition-all cursor-pointer"
                        >
                          {settingsState.maintenance_mode === "true" ? (
                            <ToggleRight size={38} className="text-primary shrink-0" />
                          ) : (
                            <ToggleLeft size={38} className="text-muted-foreground/60 shrink-0" />
                          )}
                        </button>
                      </div>

                      {/* Disallow logins switch */}
                      <div className="flex items-center justify-between pt-4">
                        <div className="space-y-0.5 max-w-[80%]">
                          <label className="text-xs font-black tracking-tight flex items-center gap-1.5 text-foreground">
                            <Laptop size={13} className="text-muted-foreground" />
                            Block Investor Logins
                          </label>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">
                            Prevent investors from logging in. Admins can still log in.
                          </p>
                        </div>
                        <button
                          onClick={() => updateDeveloperSetting("disallow_logins", settingsState.disallow_logins === "true" ? "false" : "true")}
                          className="text-primary hover:opacity-80 transition-all cursor-pointer"
                        >
                          {settingsState.disallow_logins === "true" ? (
                            <ToggleRight size={38} className="text-primary shrink-0" />
                          ) : (
                            <ToggleLeft size={38} className="text-muted-foreground/60 shrink-0" />
                          )}
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Theme Switcher */}
                  <section className="bg-card border border-border rounded-2xl p-5 space-y-4">
                    <div>
                      <h2 className="text-sm font-black tracking-tight">Theme Accent</h2>
                      <p className="text-[10px] text-muted-foreground">Choose the main color highlight for the website.</p>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { key: "zinc", color: "bg-zinc-500", label: "Zinc" },
                        { key: "emerald", color: "bg-emerald-500", label: "Emerald" },
                        { key: "indigo", color: "bg-indigo-500", label: "Indigo" },
                        { key: "orange", color: "bg-orange-500", label: "Orange" },
                      ].map((t) => {
                        const active = settingsState.primary_theme === t.key;
                        return (
                          <button
                            key={t.key}
                            onClick={() => updateDeveloperSetting("primary_theme", t.key)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-[10px] font-black tracking-tight cursor-pointer transition-all ${active
                                ? "bg-primary/5 border-primary text-foreground shadow-sm"
                                : "bg-card border-border hover:bg-muted/30 text-muted-foreground"
                              }`}
                          >
                            <span className={`w-4 h-4 rounded-full ${t.color} mb-1.5 shrink-0`} />
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* Provision New Account Trigger */}
                  <section className="bg-card border border-border rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h2 className="text-sm font-black tracking-tight flex items-center gap-1.5 text-foreground">
                          <Users size={14} className="text-muted-foreground" />
                          Add a User
                        </h2>
                        <p className="text-[10px] text-muted-foreground">Create a new user account with a specific role.</p>
                      </div>
                      <button
                        onClick={() => setIsAddUserOpen(!isAddUserOpen)}
                        className="rounded-full bg-foreground text-background font-bold px-4 py-1.5 text-[11px] hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        {isAddUserOpen ? "Close Form" : "Create User"}
                      </button>
                    </div>

                    {isAddUserOpen && (
                      <form onSubmit={onAddUser} className="pt-3 border-t border-border/40 space-y-3.5 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">Full Name</label>
                          <input
                            type="text"
                            required
                            value={addUserForm.fullName}
                            onChange={(e) => setAddUserForm(prev => ({ ...prev, fullName: e.target.value }))}
                            className="w-full bg-muted/10 border border-border/30 rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-foreground/30 text-[11px]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">Email Address</label>
                            <input
                              type="email"
                              required
                              value={addUserForm.email}
                              onChange={(e) => setAddUserForm(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full bg-muted/10 border border-border/30 rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-foreground/30 text-[11px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">Phone Number</label>
                            <input
                              type="text"
                              value={addUserForm.phone}
                              onChange={(e) => setAddUserForm(prev => ({ ...prev, phone: e.target.value }))}
                              className="w-full bg-muted/10 border border-border/30 rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-foreground/30 text-[11px] font-numbers"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">Password</label>
                            <input
                              type="password"
                              required
                              value={addUserForm.password}
                              onChange={(e) => setAddUserForm(prev => ({ ...prev, password: e.target.value }))}
                              className="w-full bg-muted/10 border border-border/30 rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-foreground/30 text-[11px] font-numbers"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">Confirm Password</label>
                            <input
                              type="password"
                              required
                              value={addUserForm.confirmPassword}
                              onChange={(e) => setAddUserForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              className="w-full bg-muted/10 border border-border/30 rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-foreground/30 text-[11px] font-numbers"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">Assign Role</label>
                          <select
                            value={addUserForm.role}
                            onChange={(e) => setAddUserForm(prev => ({ ...prev, role: e.target.value }))}
                            className="w-full bg-muted/10 border border-border/30 rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-foreground/30 cursor-pointer text-[11px]"
                          >
                            {userRoles.map(r => (
                              <option key={r} value={r} className="bg-card text-foreground font-sans">
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="submit"
                          disabled={saving}
                          className="w-full rounded-xl bg-foreground text-background font-black tracking-tight py-2 text-[11px] flex items-center justify-center gap-1.5 hover:opacity-90 disabled:opacity-60 cursor-pointer mt-3"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="animate-spin" size={12} />
                              Provisioning account...
                            </>
                          ) : (
                            <>
                              <UserCheck size={12} />
                              Confirm Provisioning
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </section>
                </div>

                {/* Configurations inputs & Pool Management */}
                <div className="space-y-6">
                  <section className="bg-card border border-border rounded-2xl p-5 space-y-4">
                    <div>
                      <h2 className="text-sm font-black tracking-tight">Payment Details</h2>
                      <p className="text-[10px] text-muted-foreground">Update M-Pesa details and support email.</p>
                    </div>

                    <div className="space-y-3.5 text-xs font-semibold">
                      {/* Paybill */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">Paybill Number</label>
                          <input
                            type="text"
                            value={settingsState.paybill_number}
                            onChange={(e) => setSettingsState(prev => ({ ...prev, paybill_number: e.target.value }))}
                            onBlur={(e) => updateDeveloperSetting("paybill_number", e.target.value)}
                            className="w-full bg-muted/20 border border-border rounded-xl px-4 py-2.5 font-bold font-numbers text-foreground focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">Account Name</label>
                          <input
                            type="text"
                            value={settingsState.account_number}
                            onChange={(e) => setSettingsState(prev => ({ ...prev, account_number: e.target.value }))}
                            onBlur={(e) => updateDeveloperSetting("account_number", e.target.value)}
                            className="w-full bg-muted/20 border border-border rounded-xl px-4 py-2.5 font-bold font-numbers text-foreground focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Support email */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">Support Email</label>
                        <input
                          type="email"
                          value={settingsState.support_email}
                          onChange={(e) => setSettingsState(prev => ({ ...prev, support_email: e.target.value }))}
                          onBlur={(e) => updateDeveloperSetting("support_email", e.target.value)}
                          className="w-full bg-muted/20 border border-border rounded-xl px-4 py-2.5 font-bold font-mono text-foreground focus:outline-none"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Pool Creation & Management */}
                  <section className="bg-card border border-border rounded-2xl p-5 space-y-4">
                    <div>
                      <h2 className="text-sm font-black tracking-tight">Investment Pools</h2>
                      <p className="text-[10px] text-muted-foreground">Add new investment options/pools.</p>
                    </div>

                    <form onSubmit={onCreatePool} className="space-y-3 text-xs font-semibold">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">Pool Name</label>
                          <input
                            type="text"
                            required
                            value={poolForm.name}
                            onChange={(e) => setPoolForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-muted/20 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">Category</label>
                          <select
                            value={poolForm.category}
                            onChange={(e) => setPoolForm(prev => ({ ...prev, category: e.target.value as any }))}
                            className="w-full bg-muted/20 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                          >
                            <option value="Forex">Forex</option>
                            <option value="Crypto">Crypto</option>
                            <option value="MMF">MMF</option>
                            <option value="Stocks">Stocks</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">Target Return (%)</label>
                          <input
                            type="number"
                            required
                            value={poolForm.initial_yield}
                            onChange={(e) => setPoolForm(prev => ({ ...prev, initial_yield: e.target.value }))}
                            className="w-full bg-muted/20 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">Risk Level</label>
                          <select
                            value={poolForm.risk_level}
                            onChange={(e) => setPoolForm(prev => ({ ...prev, risk_level: e.target.value }))}
                            className="w-full bg-muted/20 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                          >
                            <option value="Low">Low</option>
                            <option value="Moderate">Moderate</option>
                            <option value="High">High</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-black tracking-wider text-muted-foreground">Description</label>
                        <textarea
                          value={poolForm.description}
                          onChange={(e) => setPoolForm(prev => ({ ...prev, description: e.target.value }))}
                          rows={2}
                          className="w-full bg-muted/20 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={saving}
                        className="w-full rounded-xl bg-primary text-primary-foreground font-black py-2.5 hover:opacity-90 disabled:opacity-60 cursor-pointer"
                      >
                        Create New Pool
                      </button>
                    </form>
                  </section>
                </div>

              </div>
            )}

          </main>
        )}


      </div>
    </DashboardLayout>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-primary h-8 w-8" />
        </div>
      </DashboardLayout>
    }>
      <AdminContent />
    </Suspense>
  );
}

