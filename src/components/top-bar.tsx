"use client";

import Link from "next/link";
import { Bell, User, LogOut, Settings, UserCircle, Check } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useState, useRef, useEffect } from "react";
import { useRealtimeNotifications } from "@/hooks/use-realtime-notifications";
import { useAuthStore } from "@/store/useAuthStore";
import { API_URL } from "@/lib/api";

export function TopBar() {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { notifications, markAsRead } = useRealtimeNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight">
          InnerCircle
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background animate-pulse" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-card border rounded-lg shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b flex justify-between items-center">
                <p className="text-sm font-bold">Notifications</p>
                {unreadCount > 0 && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">{unreadCount} New</span>}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`px-4 py-3 hover:bg-accent/50 transition-colors border-b last:border-0 cursor-pointer ${!n.read ? "bg-primary/5" : ""}`}
                      onClick={() => markAsRead(n.id)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-xs font-bold ${!n.read ? "text-primary" : ""}`}>{n.title}</p>
                        <p className="text-[10px] text-muted-foreground">{n.time}</p>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                      {!n.read && (
                        <button className="mt-2 text-[10px] font-bold text-primary flex items-center gap-1">
                          <Check className="w-3 h-3" /> Mark as read
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 p-1 pl-2 rounded-full border border-border hover:bg-accent transition-colors"
          >
            <span className="text-sm font-medium mr-1 hidden sm:inline-block">{user?.fullName}</span>
            <img 
              src={user?.avatarUrl ? `${API_URL}${user.avatarUrl}` : `https://ui-avatars.com/api/?name=${user?.fullName}&background=random`}
              alt="Avatar"
              className="w-8 h-8 rounded-full"
            />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-card border rounded-lg shadow-lg py-1 z-50">
              <div className="px-4 py-3 border-b mb-1">
                <p className="text-sm font-medium">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors"
              >
                <UserCircle className="w-4 h-4" />
                Profile
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <div className="border-t mt-1 pt-1">
                <button
                  onClick={() => { logout(); window.location.href = "/login"; }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
