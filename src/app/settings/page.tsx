"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuthStore } from "@/store/useAuthStore";
import { AvatarUpload } from "@/components/avatar-upload";
import { API_URL } from "@/lib/api";
import { Skeleton } from "@/components/skeleton";
import { Edit, Lock, User, Phone, Save, ShieldCheck, MessageCircle, Send, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { user, login, token } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedUser = {
      fullName: `${formData.get("firstName")} ${formData.get("lastName")}`,
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
      aliasPhoneWhatsApp: formData.get("aliasPhoneWhatsApp"),
      aliasPhoneTelegram: formData.get("aliasPhoneTelegram"),
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
      login(result.user, token!);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user?.avatarUrl ? `${API_URL}${user.avatarUrl}` : `https://ui-avatars.com/api/?name=${user?.fullName}&background=0F172A&color=fff`}
                  alt="Avatar"
                  className="h-16 w-16 rounded-full border object-cover"
                />
                <div className="absolute -bottom-1 -right-1">
                  <AvatarUpload />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">{user?.fullName}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
                  <ShieldCheck size={13} />
                  {user?.role}
                </div>
              </div>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="rounded-2xl border bg-card">
          <div className="flex items-center justify-between border-b p-5">
            <h2 className="text-sm font-semibold">Profile information</h2>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted/40"
            >
              <Edit size={14} />
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="space-y-6 p-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <InfoField label="First name" name="firstName" value={user?.firstName} isEditing={isEditing} />
              <InfoField label="Last name" name="lastName" value={user?.lastName} isEditing={isEditing} />
              <InfoField label="Phone" name="phone" value={user?.phone} isEditing={isEditing} icon={<Phone size={14} />} />
              <InfoField label="WhatsApp" name="aliasPhoneWhatsApp" value={user?.aliasPhoneWhatsApp} isEditing={isEditing} icon={<MessageCircle size={14} />} />
              <InfoField label="Telegram" name="aliasPhoneTelegram" value={user?.aliasPhoneTelegram} isEditing={isEditing} icon={<Send size={14} />} />
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Account role</label>
                <div className="flex h-10 items-center rounded-lg border bg-muted/20 px-3 text-sm">
                  {user?.role}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
                >
                  <Save size={15} />
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            )}
          </div>
        </form>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="rounded-2xl border bg-card p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <User size={15} />
              Contact preferences
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              <PreferenceRow label="M-Pesa phone" value={user?.phone || "Not set"} />
              <PreferenceRow label="WhatsApp" value={user?.aliasPhoneWhatsApp || "Not set"} />
              <PreferenceRow label="Telegram" value={user?.aliasPhoneTelegram || "Not set"} />
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Lock size={15} />
              Security
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              <PreferenceRow label="Two-factor authentication" value="Enabled" />
              <PreferenceRow label="Password" value="Last changed recently" />
              <PreferenceRow label="Session" value="Active" />
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

function InfoField({ label, name, value, isEditing, icon }: any) {
  return (
    <div className="space-y-2 group">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        {isEditing ? (
          <input 
            name={name} 
            defaultValue={value} 
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60" 
          />
        ) : (
          <div className="flex h-10 items-center justify-between rounded-lg border bg-muted/20 px-3 text-sm">
             {value || <Skeleton className="h-4 w-32 opacity-10" />}
             {icon}
          </div>
        )}
      </div>
    </div>
  );
}

function PreferenceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
