"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuthStore } from "@/store/useAuthStore";
import { formatKSh } from "@/lib/utils";
import { AvatarUpload } from "@/components/avatar-upload";
import { MultiSelect } from "@/components/multi-select";
import { API_URL } from "@/lib/api";
import { Skeleton } from "@/components/skeleton";
import { usePortfolioData } from "@/hooks/use-portfolio-data";
import { Edit, Lock, User, Mail, Phone, MapPin, Save, ShieldCheck, Crown, FileCheck, Users } from "lucide-react";

export default function SettingsPage() {
  const { user, login } = useAuthStore();
  const { data: portfolio } = usePortfolioData();
  const [isEditing, setIsEditing] = useState(false);
  const [investmentStrategy, setInvestmentStrategy] = useState<string[]>([]);

  useEffect(() => {
    if (user?.investmentStrategy) {
      setInvestmentStrategy(user.investmentStrategy.split(","));
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedUser = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      country: formData.get("country"),
    };

    try {
      const response = await fetch(`${API_URL}/api/users/${user?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedUser),
        }
      );
      if (!response.ok) throw new Error("Failed to update profile");
      const result = await response.json();
      login(result.user, localStorage.getItem("token")!);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating your profile.");
    }
  };

  const handleStrategyUpdate = async () => {
    // ... (Strategy update logic)
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your profile, security, and investment preferences.</p>
        </div>

        {/* Profile Card */}
        <form onSubmit={handleProfileUpdate} className="bg-card border rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="p-8 border-b flex justify-between items-center">
            <h3 className="text-xl font-bold flex items-center gap-3"><User size={20} /> Personal Details</h3>
            <button type="button" onClick={() => setIsEditing(!isEditing)} className="text-sm font-bold text-primary flex items-center gap-2">
              <Edit size={14} /> {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="relative">
                <img
                  src={user?.avatarUrl ? `${API_URL}${user.avatarUrl}` : `https://ui-avatars.com/api/?name=${user?.fullName}&background=0D89EC&color=fff`}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-4 border-background shadow-lg"
                />
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black p-1.5 rounded-full border-4 border-card shadow-lg" title="Platinum Tier Member">
                  <Crown size={14} fill="currentColor" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5 border-4 border-card cursor-pointer">
                  <AvatarUpload />
                </div>
              </div>
              <div className="flex flex-col gap-1 flex-grow">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-extrabold">{user?.fullName}</h2>
                  <span className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-yellow-500/20">Platinum Investor</span>
                </div>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-green-500 bg-green-500/5 px-2 py-1 rounded-md border border-green-500/10">
                    <ShieldCheck size={12} /> Account Verified
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t">
              <InfoField label="Full Name" name="fullName" value={user?.fullName} isEditing={isEditing} />
              <InfoField label="Phone Number" name="phone" value={user?.phone} isEditing={isEditing} />
              <InfoField label="Country" name="country" value={user?.country} isEditing={isEditing} />
              <InfoField label="KRA PIN (for Taxes)" name="kra" value="A0123...456Z" isEditing={isEditing} />
            </div>

            {isEditing && (
              <div className="flex justify-end pt-6">
                <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            )}
          </div>
        </form>

        {/* KYC & Identity Card */}
        <div className="bg-card border rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="p-8 border-b">
            <h3 className="text-xl font-bold flex items-center gap-3"><FileCheck size={20} /> Security Center</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Identity Verification</h4>
              <div className="space-y-4">
                <KYCItem title="National ID / Passport" status="Verified" />
                <KYCItem title="KRA PIN Certificate" status="Verified" />
                <KYCItem title="Proof of Residence" status="Pending" />
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Beneficiary / Next of Kin</h4>
              <div className="p-4 border rounded-xl bg-background/50 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Jane Mary Wanjiku</p>
                    <p className="text-xs text-muted-foreground">Nominee (Spouse) - 100% Allocation</p>
                  </div>
                </div>
                <button className="w-full py-2 bg-secondary border rounded-lg text-xs font-bold hover:bg-accent transition-colors">Manage Nominee</button>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Card */}
        <div className="bg-card border rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="p-8 border-b">
            <h3 className="text-xl font-bold flex items-center gap-3"><Lock size={20} /> Authentication</h3>
          </div>
          <div className="p-8 space-y-4">
            <SecurityOption title="Change Password" description="Last changed 3 months ago." buttonText="Update" />
            <SecurityOption title="M-Pesa 2FA" description="Secure your withdrawals via mobile verification code." buttonText="Enabled" isSuccess />
          </div>
        </div>

        {/* Investment Strategy Card */}
        <div className="bg-card border rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="p-8 border-b">
            <h3 className="text-xl font-bold">Investment Strategy</h3>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-background/50 p-6 rounded-xl">
                <p className="text-sm text-muted-foreground">Total Investment</p>
                <p className="text-3xl font-bold font-numbers">{formatKSh(Number(portfolio?.totalInvestment || 0))}</p>
              </div>
              <div className="bg-background/50 p-6 rounded-xl">
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-3xl font-bold font-numbers text-green-500">{formatKSh(Number(portfolio?.netProfit || 0))}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Select your preferred asset classes.</p>
            <MultiSelect options={["Forex", "Stocks", "MMF"]} value={investmentStrategy} onChange={(val: any) => setInvestmentStrategy(val)} />
            <button onClick={handleStrategyUpdate} className="mt-6 w-full bg-primary text-primary-foreground text-sm py-2.5 rounded-lg font-bold">Update Strategy</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function InfoField({ label, name, value, isEditing }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {isEditing ? (
        <input name={name} defaultValue={value} className="w-full p-2.5 bg-background border rounded-lg text-sm" />
      ) : (
        <p className="font-semibold text-sm p-2.5 bg-background/50 rounded-lg min-h-[44px] flex items-center">
          {value || <Skeleton className="h-4 w-full opacity-30" />}
        </p>
      )}
    </div>
  );
}

function SecurityOption({ title, description, buttonText, isSuccess }: any) {
  return (
    <div className="flex justify-between items-center p-4 border rounded-xl bg-background/50">
      <div>
        <p className="font-bold text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
        isSuccess ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-secondary border hover:bg-accent"
      }`}>{buttonText}</button>
    </div>
  );
}

function KYCItem({ title, status }: { title: string; status: "Verified" | "Pending" | "Rejected" }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-background/30">
      <p className="text-sm font-medium">{title}</p>
      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
        status === "Verified" ? "text-green-500 bg-green-500/5" : "text-orange-500 bg-orange-500/5"
      }`}>{status}</span>
    </div>
  );
}
