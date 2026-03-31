"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { formatKSh } from "@/lib/utils";
import { API_URL } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Activity,
  CheckCircle2,
  Clock3,
  FileUp,
  Loader2,
  Mail,
  Save,
  Send,
  ShieldCheck,
  Wallet,
  XCircle,
} from "lucide-react";

type AdminTab =
  | "investors"
  | "trading"
  | "funds"
  | "reporting"
  | "business"
  | "communication";

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
};

type PendingTransaction = {
  id: number;
  userId: number;
  type: "Deposit" | "Withdrawal";
  amount: number;
  status: "Pending" | "Approved" | "Rejected" | "Unsuccessful";
  createdAt: string;
  investorName: string;
  investorEmail: string;
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

type Financial = {
  id: number;
  name: string;
  category: "Bank" | "Mobile" | "Crypto" | "PayPal";
  accountName?: string;
  accountNumber?: string;
  paybill?: string;
  logoUrl?: string;
  isActive: number;
};

type TradeProof = {
  id: number;
  asset: string;
  result: "Profit" | "Loss";
  amount: number;
  note?: string;
  created_at: string;
};

type ReportItem = {
  id: number;
  title: string;
  summary?: string;
  status: string;
  created_at: string;
};

const tabs: Array<{ key: AdminTab; label: string }> = [
  { key: "investors", label: "Investor Management" },
  { key: "trading", label: "Trading Operations" },
  { key: "funds", label: "Fund Controls" },
  { key: "reporting", label: "Reporting" },
  { key: "business", label: "Business Settings" },
  { key: "communication", label: "Communication" },
];

async function fetchAuthed<T>(url: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error || "Request failed");
  }
  return payload as T;
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export default function AdminPage() {
  const { token, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<AdminTab>("investors");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [summary, setSummary] = useState<Summary>({ totalAUM: 0, totalUsers: 0, monthlyProfit: 0 });
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([]);
  const [pools, setPools] = useState<Pool[]>([]);
  const [financials, setFinancials] = useState<Financial[]>([]);
  const [tradeProofs, setTradeProofs] = useState<TradeProof[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);

  const [poolForm, setPoolForm] = useState({
    name: "",
    category: "Forex",
    description: "",
    initial_yield: "",
    risk_level: "Moderate",
  });

  const [tradeForm, setTradeForm] = useState({
    asset: "",
    result: "Profit",
    amount: "",
    note: "",
  });

  const [csvData, setCsvData] = useState("");
  const [selectedPoolId, setSelectedPoolId] = useState<string>("");

  const [financialForm, setFinancialForm] = useState({
    name: "",
    category: "Bank",
    accountName: "",
    accountNumber: "",
    paybill: "",
    logoUrl: "",
  });

  const [policy, setPolicy] = useState({
    poolFee: "2.5",
    withdrawalLimit: "500000",
  });

  const [announcement, setAnnouncement] = useState("");
  const [audience, setAudience] = useState<"investors" | "developers" | "both">("investors");

  const refreshAdminData = useCallback(async () => {
    if (!token) return;

    const [summaryData, investorData, pendingData, poolsData, financialsData, proofsData, reportsData] = await Promise.all([
      fetchAuthed<Summary>(`${API_URL}/api/admin/summary`, token),
      fetchAuthed<Investor[]>(`${API_URL}/api/admin/investors`, token),
      fetchAuthed<PendingTransaction[]>(`${API_URL}/api/admin/transactions/pending`, token),
      fetchAuthed<Pool[]>(`${API_URL}/api/admin/pools`, token),
      fetchAuthed<Financial[]>(`${API_URL}/api/payments/financials`, token),
      fetchAuthed<TradeProof[]>(`${API_URL}/api/portfolio/proofs`, token),
      fetchAuthed<ReportItem[]>(`${API_URL}/api/reports`, token),
    ]);

    setSummary(summaryData);
    setInvestors(investorData);
    setPendingTransactions(pendingData);
    setPools(poolsData);
    setFinancials(financialsData);
    setTradeProofs(proofsData);
    setReports(reportsData);
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
      } catch (err: unknown) {
        if (mounted) setError(getErrorMessage(err, "Failed to load admin data"));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    const interval = setInterval(async () => {
      try {
        await refreshAdminData();
      } catch {
        // Keep polling even if one refresh fails.
      }
    }, 15000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [token, refreshAdminData]);

  const pendingAmount = useMemo(
    () => pendingTransactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0),
    [pendingTransactions]
  );

  const pendingInvestors = useMemo(
    () => investors.filter((investor) => Number(investor.isVerified) === 0),
    [investors]
  );

  const pendingWithdrawals = useMemo(
    () => pendingTransactions.filter((tx) => tx.type === "Withdrawal"),
    [pendingTransactions]
  );

  const onVerifyInvestor = async (id: number, isVerified: boolean) => {
    if (!token) return;
    try {
      setSaving(true);
      await fetchAuthed(`${API_URL}/api/admin/investors/${id}/verification`, token, {
        method: "PUT",
        body: JSON.stringify({ isVerified }),
      });
      await refreshAdminData();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to update investor status"));
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
      await refreshAdminData();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to process transaction"));
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
      setPoolForm({ name: "", category: "Forex", description: "", initial_yield: "", risk_level: "Moderate" });
      await refreshAdminData();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to create pool"));
    } finally {
      setSaving(false);
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
      setTradeForm({ asset: "", result: "Profit", amount: "", note: "" });
      await refreshAdminData();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to publish trade"));
    } finally {
      setSaving(false);
    }
  };

  const onImportTrades = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedPoolId || !csvData.trim()) return;
    try {
      setSaving(true);
      await fetchAuthed(`${API_URL}/api/admin/import-trades`, token, {
        method: "POST",
        body: JSON.stringify({ csvData, poolId: Number(selectedPoolId) }),
      });
      setCsvData("");
      await refreshAdminData();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to import trades"));
    } finally {
      setSaving(false);
    }
  };

  const onCreateFinancial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      setSaving(true);
      await fetchAuthed(`${API_URL}/api/admin/financials`, token, {
        method: "POST",
        body: JSON.stringify(financialForm),
      });
      setFinancialForm({
        name: "",
        category: "Bank",
        accountName: "",
        accountNumber: "",
        paybill: "",
        logoUrl: "",
      });
      await refreshAdminData();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to save financial channel"));
    } finally {
      setSaving(false);
    }
  };

  const investorEmails = useMemo(
    () => investors.map((investor) => investor.email).filter(Boolean).join(","),
    [investors]
  );

  const developerEmails = useMemo(() => {
    // Developers are not exposed by /admin/investors endpoint; pull from loaded users via simple request if needed later.
    // For now this keeps communication explicit and safe.
    return "razakwako45@gmail.com";
  }, []);

  const onOpenEmailClient = () => {
    const recipients =
      audience === "investors"
        ? investorEmails
        : audience === "developers"
        ? developerEmails
        : [investorEmails, developerEmails].filter(Boolean).join(",");

    const subject = encodeURIComponent("InnerCircle update");
    const body = encodeURIComponent(announcement || "Hello,\n\n");
    window.location.href = `mailto:${recipients}?subject=${subject}&body=${body}`;
  };

  if (!token) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-3xl rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-900">
          Please log in to access the admin console.
        </div>
      </DashboardLayout>
    );
  }

  if (user?.role !== "Admin") {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-300 bg-red-50 p-6 text-red-900">
          This page is restricted to admin accounts.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl space-y-6 pb-8">
        <header className="rounded-2xl border border-slate-200 bg-gradient-to-r from-sky-50 via-white to-emerald-50 p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Admin Console</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Owner Operations Dashboard</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Live control center for investor approvals, transactions, trading updates, pools, and platform operations.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm md:w-[420px]">
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                <p className="text-xs text-slate-500">Pending actions</p>
                <p className="font-semibold text-slate-900">{pendingTransactions.length}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                <p className="text-xs text-slate-500">Pending amount</p>
                <p className="font-semibold text-slate-900">{formatKSh(pendingAmount)}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                <p className="text-xs text-slate-500">Total AUM</p>
                <p className="font-semibold text-slate-900">{formatKSh(summary.totalAUM || 0)}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                <p className="text-xs text-slate-500">Total users</p>
                <p className="font-semibold text-slate-900">{summary.totalUsers || 0}</p>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <section className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</section>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-xl px-3 py-2 text-sm transition-colors ${
                  activeTab === tab.key
                    ? "bg-slate-900 text-white"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {loading ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
            <div className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading live admin data...
            </div>
          </section>
        ) : null}

        {!loading && activeTab === "investors" && (
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Approve and review investors</h2>
              <p className="mt-1 text-sm text-slate-600">Live queue from registered investor accounts.</p>
              <div className="mt-4 space-y-3">
                {pendingInvestors.length === 0 ? (
                  <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">No pending investor approvals.</p>
                ) : (
                  pendingInvestors.map((investor) => (
                    <div key={investor.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{investor.fullName}</p>
                          <p className="text-xs text-slate-600">{investor.email}</p>
                          <p className="mt-1 text-xs text-slate-500">Joined {new Date(investor.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button
                          onClick={() => onVerifyInvestor(investor.id, true)}
                          disabled={saving}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Deposits, withdrawals, pending actions</h2>
              <p className="mt-1 text-sm text-slate-600">Realtime queue from transaction approvals endpoint.</p>
              <div className="mt-4 space-y-3">
                {pendingTransactions.length === 0 ? (
                  <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">No pending financial actions.</p>
                ) : (
                  pendingTransactions.slice(0, 8).map((action) => (
                    <div key={action.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {action.type} · {action.investorName}
                          </p>
                          <p className="text-xs text-slate-600">{formatKSh(Number(action.amount))} · {action.status}</p>
                        </div>
                        <Clock3 className="h-4 w-4 text-slate-500" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </article>
          </section>
        )}

        {!loading && activeTab === "trading" && (
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Post trading updates and results</h2>
              <p className="mt-1 text-sm text-slate-600">Publishes live trade proof records for investors.</p>
              <form className="mt-4 space-y-3" onSubmit={onPublishManualTrade}>
                <input
                  value={tradeForm.asset}
                  onChange={(e) => setTradeForm((prev) => ({ ...prev, asset: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  placeholder="Asset (example: XAUUSD)"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={tradeForm.result}
                    onChange={(e) => setTradeForm((prev) => ({ ...prev, result: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="Profit">Profit</option>
                    <option value="Loss">Loss</option>
                  </select>
                  <input
                    value={tradeForm.amount}
                    onChange={(e) => setTradeForm((prev) => ({ ...prev, amount: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="Amount"
                    type="number"
                    min="0"
                    required
                  />
                </div>
                <textarea
                  value={tradeForm.note}
                  onChange={(e) => setTradeForm((prev) => ({ ...prev, note: e.target.value }))}
                  className="h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  placeholder="Notes for investors"
                />
                <button
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  <Send className="h-4 w-4" /> Publish update
                </button>
              </form>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Import trade performance records</h2>
              <p className="mt-1 text-sm text-slate-600">Distribute imported profit/loss to selected pool.</p>
              <form className="mt-4 space-y-3" onSubmit={onImportTrades}>
                <select
                  value={selectedPoolId}
                  onChange={(e) => setSelectedPoolId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select pool</option>
                  {pools.map((pool) => (
                    <option key={pool.id} value={pool.id}>
                      {pool.name} ({pool.category})
                    </option>
                  ))}
                </select>
                <textarea
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  className="h-32 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  placeholder="Paste CSV content with a Profit column"
                  required
                />
                <button
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  <FileUp className="h-4 w-4" /> Import performance file
                </button>
              </form>

              <div className="mt-5 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recent proof updates</p>
                {tradeProofs.slice(0, 4).map((proof) => (
                  <div key={proof.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-sm font-medium text-slate-800">
                      {proof.asset} · {proof.result}
                    </p>
                    <p className="text-xs text-slate-600">
                      {formatKSh(Number(proof.amount))} · {new Date(proof.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {!loading && activeTab === "funds" && (
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Approve or reject withdrawals</h2>
              <p className="mt-1 text-sm text-slate-600">Live withdrawal queue from pending transactions.</p>
              <div className="mt-4 space-y-3">
                {pendingWithdrawals.length === 0 ? (
                  <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">No pending withdrawals.</p>
                ) : (
                  pendingWithdrawals.map((item) => (
                    <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{item.investorName}</p>
                          <p className="text-xs text-slate-600">
                            Withdrawal · {formatKSh(Number(item.amount))}
                          </p>
                          <p className="text-xs text-slate-500">Requested {new Date(item.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onProcessTransaction(item.id, "Rejected")}
                            disabled={saving}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100 disabled:opacity-60"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Reject
                          </button>
                          <button
                            onClick={() => onProcessTransaction(item.id, "Approved")}
                            disabled={saving}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Liquidity and payout schedule</h2>
              <p className="mt-1 text-sm text-slate-600">Realtime totals from summary and pending queue.</p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-sky-50 p-3">
                  <p className="text-xs text-slate-600">Available liquidity</p>
                  <p className="text-lg font-semibold text-slate-900">{formatKSh(summary.totalAUM || 0)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-emerald-50 p-3">
                  <p className="text-xs text-slate-600">Monthly profit</p>
                  <p className="text-lg font-semibold text-slate-900">{formatKSh(summary.monthlyProfit || 0)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-amber-50 p-3">
                  <p className="text-xs text-slate-600">Pending withdrawals</p>
                  <p className="text-sm font-semibold text-slate-900">{pendingWithdrawals.length}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs text-slate-600">Refresh interval</p>
                  <p className="text-sm font-semibold text-slate-900">15 seconds</p>
                </div>
              </div>
            </article>
          </section>
        )}

        {!loading && activeTab === "reporting" && (
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Investor statements</h2>
              <p className="mt-1 text-sm text-slate-600">Live report records from the reports API.</p>
              <div className="mt-4 space-y-3">
                {reports.length === 0 ? (
                  <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">No report entries yet.</p>
                ) : (
                  reports.slice(0, 8).map((report) => (
                    <div key={report.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-sm font-medium text-slate-900">{report.title}</p>
                      <p className="text-xs text-slate-600">
                        {report.status} · {new Date(report.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Performance snapshots and proof uploads</h2>
              <p className="mt-1 text-sm text-slate-600">Latest trade proof feed for transparency.</p>
              <div className="mt-4 space-y-3">
                {tradeProofs.length === 0 ? (
                  <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">No trade proofs available.</p>
                ) : (
                  tradeProofs.slice(0, 8).map((proof) => (
                    <div key={proof.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-sm font-medium text-slate-900">{proof.asset}</p>
                      <p className="text-xs text-slate-600">
                        {proof.result} · {formatKSh(Number(proof.amount))} · {new Date(proof.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </article>
          </section>
        )}

        {!loading && activeTab === "business" && (
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Pool configuration</h2>
              <p className="mt-1 text-sm text-slate-600">Create and view active pools from live admin endpoints.</p>
              <form className="mt-4 space-y-3" onSubmit={onCreatePool}>
                <input
                  value={poolForm.name}
                  onChange={(e) => setPoolForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  placeholder="Pool name"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={poolForm.category}
                    onChange={(e) => setPoolForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="Stocks">Stocks</option>
                    <option value="MMF">MMF</option>
                    <option value="Forex">Forex</option>
                    <option value="Crypto">Crypto</option>
                  </select>
                  <input
                    value={poolForm.initial_yield}
                    onChange={(e) => setPoolForm((prev) => ({ ...prev, initial_yield: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="Initial yield"
                    type="number"
                    step="0.01"
                  />
                </div>
                <input
                  value={poolForm.risk_level}
                  onChange={(e) => setPoolForm((prev) => ({ ...prev, risk_level: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  placeholder="Risk level"
                />
                <textarea
                  value={poolForm.description}
                  onChange={(e) => setPoolForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="h-20 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  placeholder="Description"
                />
                <button
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  <Save className="h-4 w-4" /> Save pool configuration
                </button>
              </form>

              <div className="mt-5 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Active pools</p>
                {pools.slice(0, 5).map((pool) => (
                  <div key={pool.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-sm font-medium text-slate-900">{pool.name}</p>
                    <p className="text-xs text-slate-600">
                      {pool.category} · Yield {Number(pool.current_yield || 0).toFixed(2)}% · {formatKSh(Number(pool.total_staked || 0))}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Fees, limits, and payout policy</h2>
              <p className="mt-1 text-sm text-slate-600">Policy editor with live financial channel registry.</p>
              <div className="mt-4 space-y-3">
                <label className="block text-sm">
                  <span className="mb-1 block text-xs text-slate-500">Management fee (%)</span>
                  <input
                    value={policy.poolFee}
                    onChange={(e) => setPolicy((prev) => ({ ...prev, poolFee: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-xs text-slate-500">Single withdrawal limit (KSh)</span>
                  <input
                    value={policy.withdrawalLimit}
                    onChange={(e) => setPolicy((prev) => ({ ...prev, withdrawalLimit: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <form className="mt-5 space-y-3" onSubmit={onCreateFinancial}>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Add payment channel</p>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={financialForm.name}
                    onChange={(e) => setFinancialForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="Name"
                    required
                  />
                  <select
                    value={financialForm.category}
                    onChange={(e) => setFinancialForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="Bank">Bank</option>
                    <option value="Mobile">Mobile</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Crypto">Crypto</option>
                  </select>
                </div>
                <input
                  value={financialForm.accountName}
                  onChange={(e) => setFinancialForm((prev) => ({ ...prev, accountName: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  placeholder="Account name"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={financialForm.accountNumber}
                    onChange={(e) => setFinancialForm((prev) => ({ ...prev, accountNumber: e.target.value }))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="Account number"
                  />
                  <input
                    value={financialForm.paybill}
                    onChange={(e) => setFinancialForm((prev) => ({ ...prev, paybill: e.target.value }))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="Paybill"
                  />
                </div>
                <input
                  value={financialForm.logoUrl}
                  onChange={(e) => setFinancialForm((prev) => ({ ...prev, logoUrl: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  placeholder="Logo URL"
                />
                <button
                  disabled={saving}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  Save payment channel
                </button>
              </form>

              <div className="mt-5 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Active channels</p>
                {financials.slice(0, 6).map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-sm font-medium text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-600">
                      {item.category} · {item.paybill || item.accountNumber || "No paybill/account"}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {!loading && activeTab === "communication" && (
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Contact investors and developers</h2>
              <p className="mt-1 text-sm text-slate-600">Use your email client with live recipient lists from the system.</p>
              <form
                className="mt-4 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  onOpenEmailClient();
                }}
              >
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as "investors" | "developers" | "both")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="investors">Investors</option>
                  <option value="developers">Developers</option>
                  <option value="both">Investors and Developers</option>
                </select>
                <textarea
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  className="h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  placeholder="Write the update you want to send"
                />
                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800" type="submit">
                    <Mail className="h-4 w-4" /> Open email draft
                  </button>
                  <button
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    type="button"
                    onClick={() => navigator.clipboard.writeText(announcement || "")}
                  >
                    <Send className="h-4 w-4" /> Copy message text
                  </button>
                </div>
              </form>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Live operations feed</h2>
              <p className="mt-1 text-sm text-slate-600">Realtime snapshots from transactions and proofs.</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Pending financial actions</p>
                  <p className="text-sm text-slate-700">{pendingTransactions.length} awaiting decision</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Latest trade proof</p>
                  <p className="text-sm text-slate-700">
                    {tradeProofs[0]
                      ? `${tradeProofs[0].asset} · ${tradeProofs[0].result} · ${formatKSh(Number(tradeProofs[0].amount || 0))}`
                      : "No proof uploaded yet"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Investor approvals</p>
                  <p className="text-sm text-slate-700">{pendingInvestors.length} investors pending verification</p>
                </div>
              </div>
            </article>
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-600 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-slate-500" />
            All admin actions should be logged with actor, timestamp, and before/after values.
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-slate-500" />
            Use multi-step confirmation for high-value approvals and policy updates.
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Activity className="h-4 w-4 text-slate-500" />
            This page auto-refreshes every 15 seconds to keep data current.
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
