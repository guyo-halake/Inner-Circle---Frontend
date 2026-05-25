"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuthStore } from "@/store/useAuthStore";
import { AvatarUpload } from "@/components/avatar-upload";
import { API_URL } from "@/lib/api";
import { Skeleton } from "@/components/skeleton";
import { 
  Edit, 
  Lock, 
  User, 
  Phone, 
  Save, 
  ShieldCheck, 
  MessageCircle, 
  Send, 
  LogOut, 
  Sliders, 
  Bell, 
  CreditCard 
} from "lucide-react";

export default function SettingsPage() {
  const { user, login, token } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fintech State Settings
  const [autoReinvest, setAutoReinvest] = useState(false);
  const [riskStrategy, setRiskStrategy] = useState("Conservative");
  const [payoutChannel, setPayoutChannel] = useState("M-Pesa");
  const [yieldAlerts, setYieldAlerts] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  // Sync settings with localStorage on mount
  useEffect(() => {
    setAutoReinvest(localStorage.getItem("setting_auto_reinvest") === "true");
    setRiskStrategy(localStorage.getItem("setting_risk_strategy") || "Conservative");
    setPayoutChannel(localStorage.getItem("setting_payout_channel") || "M-Pesa");
    setYieldAlerts(localStorage.getItem("setting_yield_alerts") !== "false");
    setLoginAlerts(localStorage.getItem("setting_login_alerts") !== "false");
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const country = formData.get("country") as string;

    const updatedUser = {
      fullName: `${firstName} ${lastName}`,
      phone,
      country,
    };

    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/api/users/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      const result = await response.json();
      
      // Update store state
      login({ ...user, ...result.user }, token!);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const toggleSetting = (key: string, currentValue: boolean, setter: (v: boolean) => void) => {
    const newValue = !currentValue;
    setter(newValue);
    localStorage.setItem(key, newValue.toString());
  };

  const handleSelectSetting = (key: string, value: string, setter: (v: string) => void) => {
    setter(value);
    localStorage.setItem(key, value);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-8 font-sans">
        
        {/* Header Block */}
        <div className="border border-zinc-800 rounded-2xl p-6 bg-transparent">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user?.avatarUrl ? `${API_URL}${user.avatarUrl}` : `https://ui-avatars.com/api/?name=${user?.fullName || "User"}&background=18181B&color=fff`}
                  alt="Avatar"
                  className="h-14 w-14 rounded-full border border-zinc-800 object-cover"
                />
                <div className="absolute -bottom-1 -right-1">
                  <AvatarUpload />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">{user?.fullName}</h1>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-zinc-800/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  <ShieldCheck size={12} className="text-primary" />
                  {user?.role}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-850 bg-transparent px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-zinc-700 transition-colors"
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </div>

        {/* Profile Settings form */}
        <form onSubmit={handleProfileUpdate} className="border border-zinc-800 rounded-2xl bg-transparent overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800/80 p-5">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider">Profile Information</h2>
              <p className="text-[10px] text-muted-foreground mt-0.5">Manage your personal credentials</p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider hover:border-zinc-700 transition-colors bg-transparent"
            >
              <Edit size={12} />
              {isEditing ? "Cancel" : "Edit Details"}
            </button>
          </div>

          <div className="space-y-6 p-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <InfoField 
                label="First Name" 
                name="firstName" 
                value={user?.firstName || user?.fullName?.split(" ")[0]} 
                isEditing={isEditing} 
              />
              <InfoField 
                label="Last Name" 
                name="lastName" 
                value={user?.lastName || user?.fullName?.split(" ").slice(1).join(" ")} 
                isEditing={isEditing} 
              />
              <InfoField 
                label="Primary Phone" 
                name="phone" 
                value={user?.phone} 
                isEditing={isEditing} 
                icon={<Phone size={12} className="text-muted-foreground/40" />} 
              />
              <InfoField 
                label="Country / Region" 
                name="country" 
                value={user?.country || "Kenya"} 
                isEditing={isEditing} 
              />
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Email Address</label>
                <div className="flex h-10 items-center rounded-lg border border-zinc-850 bg-zinc-900/10 px-3 text-xs text-muted-foreground">
                  {user?.email}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Account Classification</label>
                <div className="flex h-10 items-center rounded-lg border border-zinc-850 bg-zinc-900/10 px-3 text-xs text-muted-foreground">
                  {user?.role === "Admin" ? "Administrative Controller" : "Private Venture Member"}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end pt-2 border-t border-zinc-850">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-4 py-2 text-[10px] font-bold uppercase tracking-wider disabled:opacity-60 hover:opacity-90 transition-opacity"
                >
                  <Save size={14} />
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Financial & Yield Settings */}
        <div className="border border-zinc-800 rounded-2xl bg-transparent">
          <div className="border-b border-zinc-800 p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Sliders size={14} className="text-primary" />
              Financial & Strategy Controls
            </h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">Control how your pocket balances generate and handle yield distributions</p>
          </div>

          <div className="p-5 space-y-6">
            {/* Auto-Reinvest Toggle */}
            <div className="flex items-center justify-between py-3 border-b border-zinc-850">
              <div className="space-y-0.5 pr-4">
                <h3 className="text-xs font-bold text-foreground">Auto-Reinvest Yield (Compounding)</h3>
                <p className="text-[10px] text-muted-foreground max-w-md">Automatically transfer earnings in your Yield Pocket into your active Invested Capital balance at midnight payouts.</p>
              </div>
              <button 
                type="button"
                onClick={() => toggleSetting("setting_auto_reinvest", autoReinvest, setAutoReinvest)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoReinvest ? "bg-primary" : "bg-zinc-800"
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  autoReinvest ? "translate-x-4" : "translate-x-0"
                }`} />
              </button>
            </div>

            {/* Risk Strategy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-zinc-850">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-foreground">Investment Risk Strategy</h3>
                <p className="text-[10px] text-muted-foreground">Select your allocation risk tier. Note: Returns are locked at 30% yield per 6 months for Conservative.</p>
              </div>
              <div className="flex items-center">
                <select
                  value={riskStrategy}
                  onChange={(e) => handleSelectSetting("setting_risk_strategy", e.target.value, setRiskStrategy)}
                  className="w-full bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg text-xs font-medium text-foreground outline-none cursor-pointer focus:border-zinc-700 transition-colors"
                >
                  <option value="Conservative">Conservative (30% Yield - Active)</option>
                  <option value="Balanced">Balanced Strategy</option>
                  <option value="Aggressive">Aggressive Strategy</option>
                </select>
              </div>
            </div>

            {/* Payout Destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-foreground">Default Payout Channel</h3>
                <p className="text-[10px] text-muted-foreground">Select your preferred destination for withdrawal transfers.</p>
              </div>
              <div className="flex items-center">
                <select
                  value={payoutChannel}
                  onChange={(e) => handleSelectSetting("setting_payout_channel", e.target.value, setPayoutChannel)}
                  className="w-full bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg text-xs font-medium text-foreground outline-none cursor-pointer focus:border-zinc-700 transition-colors"
                >
                  <option value="M-Pesa">Mobile Money (M-Pesa)</option>
                  <option value="Bank">Bank Wire Transfer</option>
                  <option value="USDT">Crypto Settlement (USDT - TRC20)</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* Security & Notification cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notifications Panel */}
          <div className="border border-zinc-800 rounded-2xl bg-transparent p-5 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Bell size={14} className="text-primary" />
              Notifications
            </h2>
            <p className="text-[10px] text-muted-foreground">Adjust statements and delivery reports</p>
            
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between py-1.5">
                <span className="text-xs text-foreground font-medium">Daily yield payout statements</span>
                <button 
                  type="button"
                  onClick={() => toggleSetting("setting_yield_alerts", yieldAlerts, setYieldAlerts)}
                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-150 ease-in-out ${
                    yieldAlerts ? "bg-primary" : "bg-zinc-800"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white transition duration-150 ease-in-out ${
                    yieldAlerts ? "translate-x-3" : "translate-x-0"
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-xs text-foreground font-medium">Login and security alerts</span>
                <button 
                  type="button"
                  onClick={() => toggleSetting("setting_login_alerts", loginAlerts, setLoginAlerts)}
                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-150 ease-in-out ${
                    loginAlerts ? "bg-primary" : "bg-zinc-800"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white transition duration-150 ease-in-out ${
                    loginAlerts ? "translate-x-3" : "translate-x-0"
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Security & Authentication */}
          <div className="border border-zinc-800 rounded-2xl bg-transparent p-5 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Lock size={14} className="text-primary" />
              Authentication & Security
            </h2>
            <p className="text-[10px] text-muted-foreground">Keep your venture profile protected</p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between py-1 text-xs">
                <span className="text-muted-foreground">Two-Factor Authentication</span>
                <span className="font-bold text-[9px] uppercase tracking-wider bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded border border-green-500/10">Active</span>
              </div>
              <div className="flex items-center justify-between py-1 text-xs">
                <span className="text-muted-foreground">Account Status</span>
                <span className="font-bold text-[9px] uppercase tracking-wider bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded border border-blue-500/10">Verified</span>
              </div>
              <div className="flex items-center justify-between py-1 text-xs">
                <span className="text-muted-foreground">Password Lock</span>
                <span className="font-bold text-[9px] uppercase tracking-wider text-muted-foreground">Managed via SSO</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

function InfoField({ label, name, value, isEditing, icon }: any) {
  return (
    <div className="space-y-1.5 group">
      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">{label}</label>
      <div className="relative">
        {isEditing ? (
          <input 
            name={name} 
            defaultValue={value} 
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-foreground outline-none transition-colors focus:border-zinc-700" 
          />
        ) : (
          <div className="flex h-10 items-center justify-between rounded-lg border border-zinc-850/80 bg-zinc-900/5 px-3 text-xs text-foreground">
             <span>{value || "Not set"}</span>
             {icon}
          </div>
        )}
      </div>
    </div>
  );
}
