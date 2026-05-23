"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { API_URL } from "@/lib/api";
import { io } from "socket.io-client";

interface SystemSettings {
  maintenance_mode: string;
  disallow_logins: string;
  paybill_number: string;
  account_number: string;
  support_email: string;
  app_version: string;
  primary_theme: string;
}

interface SettingsContextType {
  settings: SystemSettings | null;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  refreshSettings: async () => {},
});

export function useSystemSettings() {
  return useContext(SettingsContext);
}

export function SystemSettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  const refreshSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/settings`);
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (err) {
      console.error("Failed to load system settings:", err);
    }
  };

  useEffect(() => {
    refreshSettings();

    // Setup real-time settings update listener via socket
    const socket = io(API_URL);
    socket.on("systemSettingsUpdate", (updatedKeys) => {
      setSettings((prev) => {
        if (!prev) return prev;
        return { ...prev, ...updatedKeys };
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Apply Theme dynamically
  useEffect(() => {
    if (settings?.primary_theme) {
      const html = document.documentElement;
      
      // Remove any existing theme- classes
      html.classList.forEach((className) => {
        if (className.startsWith("theme-")) {
          html.classList.remove(className);
        }
      });
      
      // Add the active theme class
      html.classList.add(`theme-${settings.primary_theme}`);
    }
  }, [settings?.primary_theme]);

  const isAdminOrDev = user?.role === "Admin" || user?.role === "Developer";

  // Render maintenance overlay if active and user is an investor
  if (settings?.maintenance_mode === "true" && !isAdminOrDev) {
    return (
      <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center text-center p-6 font-sans">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        </div>
        <h1 className="text-xl font-black tracking-tight mb-2 text-foreground">System Maintenance</h1>
        <p className="text-muted-foreground text-[11px] font-bold max-w-xs leading-relaxed mb-6">
          We are currently performing routine upgrades to improve your investment experience. The system will reflect back online shortly.
        </p>
        <div className="text-[9px] text-muted-foreground/60 font-mono tracking-tight">
          For urgent queries, email us at <span className="text-primary font-black underline">{settings.support_email || "p3lcodes@gmail.com"}</span>
        </div>
      </div>
    );
  }

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
