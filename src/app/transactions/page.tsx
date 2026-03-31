"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { formatKSh } from "@/lib/utils";
import { 
  Building2,
  AlertCircle,
  Globe,
  Coins,
} from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";
import Image from "next/image";
import { formatRelativeTime } from "@/lib/utils";

type TabType = "History" | "Deposit" | "Withdraw";
type MethodType = "M-Pesa" | "Bank" | "PayPal" | "Binance";
type FinancialCategory = "Bank" | "Mobile" | "Crypto" | "PayPal";

type FinancialRecord = {
   id: number;
   name: string;
   category: FinancialCategory;
   accountName: string | null;
   accountNumber: string | null;
   paybill: string | null;
   logoUrl: string | null;
};

const parseTab = (value: string | null): TabType => {
   const v = (value || "").toLowerCase();
   if (v === "deposit") return "Deposit";
   if (v === "withdraw") return "Withdraw";
   return "History";
};

const normalizeFinancialCategory = (value: string): FinancialCategory => {
   const v = (value || "").toLowerCase();
   if (v.includes("mobile") || v.includes("mpesa")) return "Mobile";
   if (v.includes("pay")) return "PayPal";
   if (v.includes("crypto") || v.includes("binance")) return "Crypto";
   return "Bank";
};

const normalizeFinancialRecord = (item: any): FinancialRecord => ({
   id: Number(item?.id ?? 0),
   name: item?.name || item?.bankName || "Unnamed",
   category: normalizeFinancialCategory(item?.category || "Bank"),
   accountName: item?.accountName ?? item?.account_name ?? null,
   accountNumber: item?.accountNumber ?? item?.account_number ?? null,
   paybill: item?.paybill ?? item?.payBill ?? item?.paybillNumber ?? item?.paybill_number ?? null,
   logoUrl: item?.logoUrl ?? item?.logoURL ?? item?.logo ?? null,
});

function DepositWithdrawContent() {
  const { user } = useAuthStore();
   const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
   const initialTab = parseTab(searchParams.get("tab"));
  
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [activeMethod, setActiveMethod] = useState<MethodType>("M-Pesa");
   const [financials, setFinancials] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [peers, setPeers] = useState<any[]>([]);

  const [amount, setAmount] = useState("");
   const [phone, setPhone] = useState(user?.phone || user?.mpesaNumber || "");
   const [mpesaReference, setMpesaReference] = useState("");

   const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
   const [showBankCardForm, setShowBankCardForm] = useState(false);
   const [bankCardName, setBankCardName] = useState(user?.fullName || "");
   const [bankCardNumber, setBankCardNumber] = useState("");
   const [bankCardCvv, setBankCardCvv] = useState("");
   const [bankCardExpiry, setBankCardExpiry] = useState("");

   const [paypalEmail, setPaypalEmail] = useState("");
   const [paypalTxnId, setPaypalTxnId] = useState("");

   const [walletAddress, setWalletAddress] = useState("");
   const [binanceNetwork, setBinanceNetwork] = useState("");
   const [binanceTxHash, setBinanceTxHash] = useState("");

   const [withdrawPhone, setWithdrawPhone] = useState(user?.phone || user?.mpesaNumber || "");
   const [withdrawBankId, setWithdrawBankId] = useState<number | null>(null);
   const [withdrawBankAccountName, setWithdrawBankAccountName] = useState(user?.fullName || "");
   const [withdrawBankAccountNumber, setWithdrawBankAccountNumber] = useState("");
   const [withdrawPaypalEmail, setWithdrawPaypalEmail] = useState("");
   const [withdrawWalletAddress, setWithdrawWalletAddress] = useState("");
   const [withdrawNetwork, setWithdrawNetwork] = useState("");

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

   useEffect(() => {
      if (!token) return;
      fetchFinancials();
      fetchTransactions();
      fetchPeers();
   }, [token]);

   const getAuthHeaders = (includeJson = false): HeadersInit => {
      if (!token) return includeJson ? { "Content-Type": "application/json" } : {};
      return includeJson
         ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
         : { Authorization: `Bearer ${token}` };
   };

   const handleUnauthorized = () => {
      toast.error("Session expired. Please login again.");
      router.push("/login");
   };

   const bankOptions = financials.filter((item) => item.category === "Bank");
   const mobileOption = financials.find((item) => item.category === "Mobile");
   const paypalOption = financials.find((item) => item.category === "PayPal");
   const binanceOption = financials.find((item) => item.category === "Crypto");

   useEffect(() => {
      if (!selectedBankId && bankOptions.length > 0) {
         setSelectedBankId(bankOptions[0].id);
      }
   }, [bankOptions, selectedBankId]);

   useEffect(() => {
      if (!withdrawBankId && bankOptions.length > 0) {
         setWithdrawBankId(bankOptions[0].id);
      }
   }, [bankOptions, withdrawBankId]);

  const fetchFinancials = async () => {
      if (!token) return;
    try {
         const res = await fetch(`${API_URL}/api/payments/financials`, {
            headers: getAuthHeaders()
         });
      if (res.status === 401 || res.status === 403) return handleUnauthorized();
         if (res.ok) {
            const data = await res.json();
            setFinancials(Array.isArray(data) ? data.map(normalizeFinancialRecord) : []);
         }
    } catch (e) { console.error(e); }
  };

  const fetchTransactions = async () => {
      if (!token) return;
    try {
         const res = await fetch(`${API_URL}/api/portfolio/history-ledger`, {
            headers: getAuthHeaders()
         });
      if (res.status === 401 || res.status === 403) return handleUnauthorized();
         if (res.ok) setTransactions(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchPeers = async () => {
      if (!token) return;
    try {
         const res = await fetch(`${API_URL}/api/portfolio/peers`, {
            headers: getAuthHeaders()
         });
      if (res.status === 401 || res.status === 403) return handleUnauthorized();
         if (res.ok) setPeers(await res.json());
    } catch (e) { console.error(e); }
  };

   const getSelectedBank = () => bankOptions.find((b) => b.id === selectedBankId) || null;
   const getWithdrawBank = () => bankOptions.find((b) => b.id === withdrawBankId) || null;

   const validateAmount = () => {
      const parsed = Number(amount);
      if (!Number.isFinite(parsed) || parsed <= 0) {
         return "Enter a valid amount";
      }
      return null;
   };

   const validateDepositInputs = (method: MethodType) => {
      const amountError = validateAmount();
      if (amountError) return amountError;

      if (method === "M-Pesa") {
         if (!phone.trim()) return "Enter your M-Pesa phone number";
         if (!mobileOption) return "M-Pesa destination is not configured yet";
      }

      if (method === "Bank") {
         if (!selectedBankId) return "Select a bank account";
         if (showBankCardForm) {
            if (!bankCardName.trim()) return "Enter name on card";
            if (!bankCardNumber.trim() || bankCardNumber.replace(/\s/g, "").length < 12) return "Enter a valid card number";
            if (!bankCardCvv.trim() || bankCardCvv.length < 3) return "Enter a valid CVV";
            if (!bankCardExpiry.trim()) return "Enter card expiry date";
         }
      }

      if (method === "PayPal") {
         if (!paypalOption) return "PayPal destination is not configured yet";
         if (!paypalEmail.trim()) return "Enter your PayPal email";
         if (!paypalTxnId.trim()) return "Enter PayPal transaction ID";
      }

      if (method === "Binance") {
         if (!binanceOption) return "Binance wallet is not configured yet";
         if (!walletAddress.trim()) return "Enter your sending wallet address";
         if (!binanceNetwork.trim()) return "Enter network used (e.g. BSC, TRC20)";
         if (!binanceTxHash.trim()) return "Enter transaction hash";
      }

      return null;
   };

   const buildDepositMethodDetails = (method: MethodType) => {
      if (method === "M-Pesa") {
         return {
            channel: "STK Push",
            phoneNumber: phone,
            reference: mpesaReference || null,
            financialId: mobileOption?.id || null,
            paybill: mobileOption?.paybill || null,
         };
      }

      if (method === "Bank") {
         const selectedBank = getSelectedBank();
         return {
            financialId: selectedBank?.id || null,
            receivingBank: selectedBank?.name || null,
            receivingAccountName: selectedBank?.accountName || null,
            receivingAccountNumber: selectedBank?.accountNumber || null,
            receivingPaybill: selectedBank?.paybill || null,
            paymentMode: showBankCardForm ? "Card" : "Transfer",
            cardName: showBankCardForm ? bankCardName : null,
            cardNumber: showBankCardForm ? bankCardNumber : null,
            cardCvv: showBankCardForm ? bankCardCvv : null,
            cardExpiry: showBankCardForm ? bankCardExpiry : null,
         };
      }

      if (method === "PayPal") {
         return {
            financialId: paypalOption?.id || null,
            destinationAccount: paypalOption?.accountName || null,
            senderPaypalEmail: paypalEmail,
            paypalTransactionId: paypalTxnId,
         };
      }

      return {
         financialId: binanceOption?.id || null,
         destinationWallet: binanceOption?.accountNumber || null,
         senderWallet: walletAddress,
         network: binanceNetwork,
         transactionHash: binanceTxHash,
      };
   };

   const validateWithdrawInputs = (method: MethodType) => {
      const amountError = validateAmount();
      if (amountError) return amountError;

      if (method === "M-Pesa" && !withdrawPhone.trim()) {
         return "Enter the destination M-Pesa phone number";
      }

      if (method === "Bank") {
         if (!withdrawBankId) return "Select destination bank";
         if (!withdrawBankAccountName.trim()) return "Enter account name";
         if (!withdrawBankAccountNumber.trim()) return "Enter account number";
      }

      if (method === "PayPal" && !withdrawPaypalEmail.trim()) {
         return "Enter destination PayPal email";
      }

      if (method === "Binance") {
         if (!withdrawWalletAddress.trim()) return "Enter destination wallet address";
         if (!withdrawNetwork.trim()) return "Enter destination network";
      }

      return null;
   };

   const buildWithdrawMethodDetails = (method: MethodType) => {
      if (method === "M-Pesa") {
         return {
            destinationPhone: withdrawPhone,
         };
      }

      if (method === "Bank") {
         const selectedBank = getWithdrawBank();
         return {
            destinationBankName: selectedBank?.name || null,
            destinationBankPaybill: selectedBank?.paybill || null,
            destinationAccountName: withdrawBankAccountName,
            destinationAccountNumber: withdrawBankAccountNumber,
         };
      }

      if (method === "PayPal") {
         return {
            destinationPaypalEmail: withdrawPaypalEmail,
         };
      }

      return {
         destinationWalletAddress: withdrawWalletAddress,
         destinationNetwork: withdrawNetwork,
      };
   };

  const handleDepositRequest = async (methodOverride?: string) => {
      if (!token) return handleUnauthorized();
    setLoading(true);

      const method = (methodOverride || activeMethod) as MethodType;
      const validationError = validateDepositInputs(method);
      if (validationError) {
         setLoading(false);
         return toast.error(validationError);
      }
    
    try {
         if (method === "M-Pesa") {
            const res = await fetch(`${API_URL}/api/payments/stk-push`, {
               method: "POST",
               headers: getAuthHeaders(true),
               body: JSON.stringify({ amount, phoneNumber: phone })
            });
            if (res.status === 401 || res.status === 403) return handleUnauthorized();
            if (res.ok) toast.success("M-Pesa prompt sent to your phone");
            else toast.error("Could not start M-Pesa payment");
         } else {
            const res = await fetch(`${API_URL}/api/payments/deposit-request`, {
               method: "POST",
               headers: getAuthHeaders(true),
               body: JSON.stringify({ 
                  amount, 
                  method, 
                  methodDetails: buildDepositMethodDetails(method)
               })
            });
            if (res.status === 401 || res.status === 403) return handleUnauthorized();
            if (res.ok) toast.success("Deposit request submitted");
            else toast.error("Could not submit deposit request");
         }
    } catch (e) {
         toast.error("Network error while submitting request");
    } finally {
         setLoading(false);
         fetchTransactions();
    }
  };

  const getColorForStatus = (status: string) => {
      switch(status) {
          case 'Approved': return 'text-emerald-500 bg-emerald-500/10';
          case 'Pending': return 'text-amber-500 bg-amber-500/10';
          case 'Rejected': return 'text-rose-500 bg-rose-500/10';
          case 'Unsuccessful': return 'text-muted-foreground bg-muted/10';
          default: return 'text-muted-foreground bg-muted/10';
      }
  };

   return (
      <div className="space-y-6 animate-in fade-in duration-300">
         <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
               <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
               <p className="mt-1 text-sm text-muted-foreground">
                  Deposit funds, request withdrawals, and review your activity.
               </p>
            </div>
            <div className="rounded-2xl border bg-card p-4 sm:min-w-64">
               <p className="text-xs text-muted-foreground">Available balance</p>
               <p className="mt-1 text-2xl font-semibold tracking-tight">
                  {formatKSh(Number(user?.wallets?.find((w: any) => w.type === "POCKET_HOLD")?.balance || 0))}
               </p>
            </div>
         </div>

         <div className="flex w-full max-w-md gap-1 rounded-xl border bg-muted/30 p-1">
            {(["History", "Deposit", "Withdraw"] as TabType[]).map((tab) => (
               <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                     activeTab === tab
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                  }`}
               >
                  {tab}
               </button>
            ))}
         </div>

         <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
            <div className="xl:col-span-3">
               {activeTab === "History" ? (
                  <div className="overflow-hidden rounded-2xl border bg-card">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
                              <th className="p-4 font-medium">Date</th>
                              <th className="p-4 font-medium">Type</th>
                              <th className="p-4 text-right font-medium">Amount</th>
                              <th className="p-4 text-center font-medium">Status</th>
                           </tr>
                        </thead>
                        <tbody className="text-sm">
                           {transactions.map((tx: any) => (
                              <tr key={tx.id} className="border-b last:border-b-0">
                                 <td className="p-4 text-muted-foreground">
                                    {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                 </td>
                                 <td className="p-4 font-medium">{tx.action}</td>
                                 <td className="p-4 text-right font-semibold">{formatKSh(Number(tx.amount))}</td>
                                 <td className="p-4">
                                    <div className="flex items-center justify-center">
                                       <span className={`rounded-full px-3 py-1 text-xs font-medium ${getColorForStatus(tx.status)}`}>
                                          {tx.status}
                                       </span>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                           {transactions.length === 0 && (
                              <tr>
                                 <td colSpan={4} className="p-10 text-center text-sm text-muted-foreground">
                                    No transactions yet.
                                 </td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               ) : (
                  <div className="rounded-2xl border bg-card p-6 md:p-8">
                     <div className="mb-6">
                        <h2 className="text-lg font-semibold">
                           {activeTab === "Deposit" ? "Deposit funds" : "Withdraw funds"}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                           Select a payment method and submit your request.
                        </p>
                     </div>

                     <div className="mb-6 flex flex-wrap gap-2">
                        {(["M-Pesa", "Bank", "PayPal", "Binance"] as MethodType[]).map((m) => (
                           <button
                              key={m}
                              onClick={() => setActiveMethod(m)}
                              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors cursor-pointer ${
                                 activeMethod === m
                                    ? "border-primary bg-primary/10 text-foreground"
                                    : "border-border text-muted-foreground hover:text-foreground"
                              }`}
                           >
                              {m === "M-Pesa" && (
                                 <Image
                                    src="https://static.thenounproject.com/png/951052-200.png"
                                    alt="M-Pesa"
                                    width={16}
                                    height={16}
                                 />
                              )}
                              {m === "Bank" && <Building2 size={16} />}
                              {m === "PayPal" && <Globe size={16} />}
                              {m === "Binance" && <Coins size={16} />}
                              <span>{m}</span>
                           </button>
                        ))}
                     </div>

                     {activeTab === "Deposit" ? (
                        <div className="space-y-5">
                           {activeMethod === "M-Pesa" && (
                              <>
                                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                       <label className="text-sm font-medium">Phone number</label>
                                       <input
                                          value={phone}
                                          onChange={(e) => setPhone(e.target.value)}
                                          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                          placeholder="2547XXXXXXXX"
                                       />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-sm font-medium">Amount (KSh)</label>
                                       <input
                                          value={amount}
                                          onChange={(e) => setAmount(e.target.value)}
                                          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                          placeholder="0.00"
                                       />
                                    </div>
                                 </div>

                                    <div className="space-y-2">
                                       <label className="text-sm font-medium">Reference (optional)</label>
                                       <input
                                          value={mpesaReference}
                                          onChange={(e) => setMpesaReference(e.target.value)}
                                          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                          placeholder="e.g. Monthly top-up"
                                       />
                                    </div>

                                 <button
                                    disabled={loading}
                                    onClick={() => handleDepositRequest()}
                                    className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
                                 >
                                       {loading ? "Sending request..." : "Send M-Pesa STK push"}
                                 </button>

                                 <div className="rounded-lg border bg-muted/20 p-4">
                                       <p className="text-sm font-medium">Payment details from your configured channel</p>
                                    <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                                       <div>
                                          <p className="text-muted-foreground">Paybill number</p>
                                             <p className="font-medium">{mobileOption?.paybill || "Not configured"}</p>
                                       </div>
                                       <div>
                                          <p className="text-muted-foreground">Account name</p>
                                             <p className="font-medium">{mobileOption?.accountName || "Not configured"}</p>
                                       </div>
                                    </div>
                                 </div>
                              </>
                           )}

                           {activeMethod === "Bank" && (
                              <>
                                 <div className="rounded-lg border bg-muted/20 p-4">
                                       <p className="text-sm font-medium">Choose company bank account</p>
                                       <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                                          {bankOptions.map((bank) => (
                                             <label key={bank.id} className={`cursor-pointer rounded-lg border p-3 text-sm transition-colors ${selectedBankId === bank.id ? "border-primary bg-primary/5" : "border-border"}`}>
                                                <div className="flex items-start gap-3">
                                                   <input
                                                      type="radio"
                                                      checked={selectedBankId === bank.id}
                                                      onChange={() => setSelectedBankId(bank.id)}
                                                      className="mt-1"
                                                   />
                                                   <div>
                                                      <div className="flex items-center gap-2">
                                                         <span className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded bg-muted/40">
                                                            <Building2 size={15} className="text-muted-foreground" />
                                                            {bank.logoUrl && (
                                                               <img
                                                                  src={bank.logoUrl}
                                                                  alt={`${bank.name} logo`}
                                                                  className="absolute inset-0 h-8 w-8 object-contain"
                                                                  onError={(e) => {
                                                                     e.currentTarget.style.display = "none";
                                                                  }}
                                                               />
                                                            )}
                                                         </span>
                                                         <p className="font-medium">{bank.name}</p>
                                                      </div>
                                                      <p className="mt-1 text-muted-foreground">{bank.accountName || "No account name"}</p>
                                                      <p className="text-muted-foreground">{bank.accountNumber || "No account number"}</p>
                                                   </div>
                                                </div>
                                             </label>
                                          ))}
                                          {bankOptions.length === 0 && (
                                             <p className="text-sm text-muted-foreground">No active bank accounts configured.</p>
                                          )}
                                       </div>
                                    </div>

                                 <div className="rounded-lg border p-4">
                                    <p className="text-sm font-medium">Company payment details</p>
                                    <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                                       <div className="space-y-2">
                                          <label className="text-sm font-medium">Bank name</label>
                                          <input
                                             value={getSelectedBank()?.name || ""}
                                             readOnly
                                             className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm"
                                          />
                                       </div>
                                       <div className="space-y-2">
                                          <label className="text-sm font-medium">Paybill</label>
                                          <input
                                             value={getSelectedBank()?.paybill || "Not configured"}
                                             readOnly
                                             className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm"
                                          />
                                       </div>
                                       <div className="space-y-2 md:col-span-2">
                                          <label className="text-sm font-medium">Account number</label>
                                          <input
                                             value={getSelectedBank()?.accountNumber || "Not available"}
                                             readOnly
                                             className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm"
                                          />
                                       </div>
                                       <div className="space-y-2 md:col-span-2">
                                          <label className="text-sm font-medium">Amount (KSh)</label>
                                          <input
                                             value={amount}
                                             onChange={(e) => setAmount(e.target.value)}
                                             className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                             placeholder="0.00"
                                          />
                                       </div>
                                    </div>
                                 </div>

                                 <div className="flex items-center justify-between">
                                    <button
                                       type="button"
                                       onClick={() => setShowBankCardForm((prev) => !prev)}
                                       className="rounded-lg border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                                    >
                                       Cards
                                    </button>
                                    <button
                                       disabled={loading}
                                       onClick={() => handleDepositRequest("Bank")}
                                       className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                                    >
                                       {loading ? "Submitting..." : "Send"}
                                    </button>
                                 </div>

                                 {showBankCardForm && (
                                    <div className="rounded-lg border p-4">
                                       <p className="text-sm font-medium">Pay with card</p>
                                       <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                                          <div className="space-y-2">
                                             <label className="text-sm font-medium">Card name</label>
                                             <input
                                                value={bankCardName}
                                                onChange={(e) => setBankCardName(e.target.value)}
                                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                                placeholder="Name on card"
                                             />
                                          </div>
                                          <div className="space-y-2">
                                             <label className="text-sm font-medium">Card number</label>
                                             <input
                                                value={bankCardNumber}
                                                onChange={(e) => setBankCardNumber(e.target.value)}
                                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                                placeholder="0000 0000 0000 0000"
                                             />
                                          </div>
                                          <div className="space-y-2">
                                             <label className="text-sm font-medium">CVV</label>
                                             <input
                                                value={bankCardCvv}
                                                onChange={(e) => setBankCardCvv(e.target.value)}
                                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                                placeholder="123"
                                                maxLength={4}
                                             />
                                          </div>
                                          <div className="space-y-2">
                                             <label className="text-sm font-medium">Exp date</label>
                                             <input
                                                value={bankCardExpiry}
                                                onChange={(e) => setBankCardExpiry(e.target.value)}
                                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                                placeholder="MM/YY"
                                             />
                                          </div>
                                          <div className="space-y-2 md:col-span-2">
                                             <label className="text-sm font-medium">Amount (KSh)</label>
                                             <input
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                                placeholder="0.00"
                                             />
                                          </div>
                                       </div>

                                       <button
                                          disabled={loading}
                                          onClick={() => handleDepositRequest("Bank")}
                                          className="mt-4 w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
                                       >
                                          {loading ? "Submitting..." : "Pay by card"}
                                       </button>
                                    </div>
                                 )}
                              </>
                           )}

                              {activeMethod === "PayPal" && (
                              <>
                                    <div className="rounded-lg border bg-muted/20 p-4 text-sm">
                                       <p className="font-medium">Destination PayPal account</p>
                                       <p className="mt-1 text-muted-foreground">
                                          {paypalOption?.accountName || "Not configured"}
                                       </p>
                                    </div>

                                 <div className="space-y-2">
                                       <label className="text-sm font-medium">Your PayPal email</label>
                                    <input
                                          value={paypalEmail}
                                          onChange={(e) => setPaypalEmail(e.target.value)}
                                       className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                          placeholder="you@example.com"
                                       />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-sm font-medium">PayPal transaction ID</label>
                                       <input
                                          value={paypalTxnId}
                                          onChange={(e) => setPaypalTxnId(e.target.value)}
                                          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                          placeholder="Transaction ID"
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">Amount (KSh)</label>
                                    <input
                                       value={amount}
                                       onChange={(e) => setAmount(e.target.value)}
                                       className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                       placeholder="0.00"
                                    />
                                 </div>
                                 <button
                                    disabled={loading}
                                    onClick={() => handleDepositRequest("PayPal")}
                                    className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
                                 >
                                    {loading ? "Submitting..." : "Submit deposit request"}
                                 </button>
                              </>
                           )}

                           {activeMethod === "Binance" && (
                              <>
                                 <div className="rounded-lg border bg-muted/20 p-4 text-sm">
                                    <p className="font-medium">Destination wallet</p>
                                    <p className="mt-1 text-muted-foreground break-all">
                                       {binanceOption?.accountNumber || "Not configured"}
                                    </p>
                                 </div>

                                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                       <label className="text-sm font-medium">Your sending wallet address</label>
                                       <input
                                          value={walletAddress}
                                          onChange={(e) => setWalletAddress(e.target.value)}
                                          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                          placeholder="0x..."
                                       />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-sm font-medium">Network</label>
                                       <input
                                          value={binanceNetwork}
                                          onChange={(e) => setBinanceNetwork(e.target.value)}
                                          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                          placeholder="BEP20, TRC20, ERC20"
                                       />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                       <label className="text-sm font-medium">Transaction hash</label>
                                       <input
                                          value={binanceTxHash}
                                          onChange={(e) => setBinanceTxHash(e.target.value)}
                                          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                          placeholder="Paste blockchain transaction hash"
                                       />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                       <label className="text-sm font-medium">Amount (KSh)</label>
                                       <input
                                          value={amount}
                                          onChange={(e) => setAmount(e.target.value)}
                                          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                          placeholder="0.00"
                                       />
                                    </div>
                                 </div>

                                 <button
                                    disabled={loading}
                                    onClick={() => handleDepositRequest("Binance")}
                                    className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
                                 >
                                    {loading ? "Submitting..." : "Submit deposit request"}
                                 </button>
                              </>
                           )}
                        </div>
                     ) : (
                        <div className="space-y-5">
                           {activeMethod === "M-Pesa" && (
                              <div className="space-y-2">
                                 <label className="text-sm font-medium">Destination M-Pesa phone number</label>
                                 <input
                                    value={withdrawPhone}
                                    onChange={(e) => setWithdrawPhone(e.target.value)}
                                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                    placeholder="2547XXXXXXXX"
                                 />
                              </div>
                           )}

                           {activeMethod === "Bank" && (
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">Destination bank</label>
                                    <select
                                       value={withdrawBankId ?? ""}
                                       onChange={(e) => setWithdrawBankId(Number(e.target.value))}
                                       className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                    >
                                       {bankOptions.map((bank) => (
                                          <option key={bank.id} value={bank.id}>
                                             {bank.name}
                                          </option>
                                       ))}
                                    </select>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">Bank paybill</label>
                                    <input
                                       value={getWithdrawBank()?.paybill || "Not configured"}
                                       readOnly
                                       className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm"
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">Destination account name</label>
                                    <input
                                       value={withdrawBankAccountName}
                                       onChange={(e) => setWithdrawBankAccountName(e.target.value)}
                                       className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                       placeholder="Full account name"
                                    />
                                 </div>
                                 <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">Destination account number</label>
                                    <input
                                       value={withdrawBankAccountNumber}
                                       onChange={(e) => setWithdrawBankAccountNumber(e.target.value)}
                                       className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                       placeholder="Account number"
                                    />
                                 </div>
                              </div>
                           )}

                           {activeMethod === "PayPal" && (
                              <div className="space-y-2">
                                 <label className="text-sm font-medium">Destination PayPal email</label>
                                 <input
                                    value={withdrawPaypalEmail}
                                    onChange={(e) => setWithdrawPaypalEmail(e.target.value)}
                                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                    placeholder="recipient@example.com"
                                 />
                              </div>
                           )}

                           {activeMethod === "Binance" && (
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                 <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">Destination wallet address</label>
                                    <input
                                       value={withdrawWalletAddress}
                                       onChange={(e) => setWithdrawWalletAddress(e.target.value)}
                                       className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                       placeholder="0x..."
                                    />
                                 </div>
                                 <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">Destination network</label>
                                    <input
                                       value={withdrawNetwork}
                                       onChange={(e) => setWithdrawNetwork(e.target.value)}
                                       className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                       placeholder="BEP20, TRC20, ERC20"
                                    />
                                 </div>
                              </div>
                           )}

                           <div className="space-y-2">
                              <label className="text-sm font-medium">Amount (KSh)</label>
                              <input
                                 value={amount}
                                 onChange={(e) => setAmount(e.target.value)}
                                 className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                                 placeholder="0.00"
                              />
                           </div>

                           <button
                              disabled={loading}
                              onClick={async () => {
                                 const validationError = validateWithdrawInputs(activeMethod);
                                 if (validationError) return toast.error(validationError);

                                 if (!token) return handleUnauthorized();
                                 setLoading(true);
                                 try {
                                    const res = await fetch(`${API_URL}/api/payments/withdrawal-request`, {
                                       method: "POST",
                                       headers: getAuthHeaders(true),
                                       body: JSON.stringify({ amount, method: activeMethod, methodDetails: buildWithdrawMethodDetails(activeMethod) })
                                    });
                                    if (res.status === 401 || res.status === 403) return handleUnauthorized();
                                    if (res.ok) toast.success("Withdrawal request submitted");
                                    else toast.error("Could not submit request");
                                 } finally {
                                    setLoading(false);
                                    fetchTransactions();
                                 }
                              }}
                              className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background disabled:opacity-50"
                           >
                              {loading ? "Submitting..." : "Submit withdrawal request"}
                           </button>

                           <div className="flex items-start gap-3 rounded-lg border bg-amber-500/5 p-4 text-sm text-muted-foreground">
                              <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-500" />
                              <p>Most withdrawals are reviewed and processed within 2 to 6 hours.</p>
                           </div>
                        </div>
                     )}
                  </div>
               )}
            </div>

            <div className="space-y-4">
               <div className="rounded-2xl border bg-card p-5">
                  <h3 className="text-sm font-semibold">Need help?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                     Payment details shown here come from your active finance channels. If one is missing, add it in system financial settings.
                  </p>
               </div>

               <div className="rounded-2xl border bg-card p-5">
                  <h3 className="text-sm font-semibold">Recent activity</h3>
                  <div className="mt-3 space-y-3">
                     {peers.map((peer: any, i: number) => (
                        <div key={i} className="flex items-center justify-between gap-3 text-sm">
                           <span className="truncate">{peer.name.split(" ")[0]} {peer.name.split(" ")[1]?.[0]}.</span>
                           <span className="text-muted-foreground">{peer.action}</span>
                           <span className="shrink-0 text-xs text-muted-foreground">{formatRelativeTime(peer.date)}</span>
                        </div>
                     ))}
                     {peers.length === 0 && (
                        <p className="py-2 text-sm text-muted-foreground">No recent activity.</p>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default function DepositWithdrawPage() {
  return (
    <DashboardLayout>
          <Suspense fallback={<div className="flex h-screen items-center justify-center text-sm text-muted-foreground">Loading transactions...</div>}>
          <DepositWithdrawContent />
       </Suspense>
    </DashboardLayout>
  );
}
