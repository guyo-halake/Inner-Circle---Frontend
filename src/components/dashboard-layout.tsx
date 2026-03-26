"use client";

import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { API_URL } from "@/lib/api";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, login, token } = useAuthStore();

  useEffect(() => {
    const validateSession = async () => {
      if (token && !user) {
            try {
              const response = await fetch(`${API_URL}/api/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) throw new Error("Session expired");
          const userData = await response.json();
          login(userData, token);
        } catch (error) {
          console.error("Session validation failed:", error);
          // Optionally logout user here
        }
      }
    };
    validateSession();
  }, [token, user, login]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="flex">
        <Sidebar />
        <main className="flex-grow pt-16 pl-64 min-h-screen">
          <div className="container mx-auto p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
