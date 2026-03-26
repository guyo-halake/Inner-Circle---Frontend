"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Bell, 
  Search, 
  LogOut, 
  Settings, 
  UserCircle, 
  X,
  History,
  TrendingUp,
  Wallet,
  Landmark,
  Clock,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useRealtimeNotifications } from "@/hooks/use-realtime-notifications";
import { useAuthStore } from "@/store/useAuthStore";
import { API_URL } from "@/lib/api";
import { usePortfolioData } from "@/hooks/use-portfolio-data";
import { formatKSh } from "@/lib/utils";

export function TopBar() {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { notifications, markAsRead } = useRealtimeNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;
  const menuRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState("");

  const { data: portfolio } = usePortfolioData();
  const walletLimit = 1250000;

  useEffect(() => {
    const updateTime = () => {
      const eat = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Nairobi",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(new Date());
      setCurrentTime(eat);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-background/60 backdrop-blur-2xl z-[60] px-6 flex items-center justify-between">
        {/* Logo & Market Time */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-xl font-black tracking-tighter hover:opacity-80 transition-opacity">
            Inner<span className="text-primary italic">Circle</span>
          </Link>
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-muted/40 rounded-full border border-border/50 select-none">
            <Clock size={12} className="text-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
              EAT: <span className="text-foreground">{currentTime}</span>
            </span>
          </div>
        </div>

        {/* Command Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search Portfolios, Statements... (Ctrl+K)"
              className="w-full bg-muted/30 border border-border/50 rounded-xl py-2 pl-10 pr-4 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-primary/30 group-hover:bg-muted/50 transition-all placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        {/* Action Center */}
        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-4 border-r border-border/50 pr-4 mr-2">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Liquid Wallet</span>
              <span className="text-xs font-black font-numbers">{formatKSh(walletLimit)}</span>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Wallet size={16} />
            </div>
          </div>

          <ThemeToggle />
          
          {/* Notifications Trigger */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2.5 text-muted-foreground hover:text-foreground transition-all rounded-xl hover:bg-muted relative active:scale-95"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background shadow-sm shadow-primary/50" />
            )}
          </button>
          
          {/* Prestige Profile Hub */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group relative p-0.5 rounded-full ring-2 ring-border/50 hover:ring-primary/50 transition-all active:scale-95"
            >
              <div className="absolute -top-1 -right-1 z-10 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-background shadow-sm">
                 <ShieldCheck size={8} className="text-black fill-current" />
              </div>
              <img 
                src={user?.avatarUrl ? `${API_URL}${user.avatarUrl}` : `https://ui-avatars.com/api/?name=${user?.fullName}&background=random`}
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover"
              />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-5 py-4 border-b border-border/50 mb-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-sm font-black">{user?.fullName}</p>
                    <span className="text-[8px] bg-yellow-500/10 text-yellow-600 px-1.5 py-0.5 rounded-full border border-yellow-500/20 uppercase font-black tracking-tighter">Platinum</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium truncate">{user?.email}</p>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center justify-between px-4 py-2.5 mx-2 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  <div className="flex items-center gap-3">
                    <UserCircle className="w-4 h-4" />
                    Security Profile
                  </div>
                  <ChevronRight size={12} className="opacity-40" />
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center justify-between px-4 py-2.5 mx-2 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4" />
                    Account Settings
                  </div>
                  <ChevronRight size={12} className="opacity-40" />
                </Link>
                <div className="mx-2 mt-2 pt-2 border-t border-border/50">
                  <button
                    onClick={() => { logout(); window.location.href = "/login"; }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    End Session
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Activity Sidebar (Activity Drawer) */}
      <div 
        className={`fixed inset-0 z-[70] transition-opacity duration-500 ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
        <div 
          className={`absolute right-0 top-0 bottom-0 w-full max-w-sm bg-card/95 backdrop-blur-2xl border-l border-border/50 shadow-2xl transition-transform duration-500 transform ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-border/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <History size={16} className="text-primary" />
                  Activity Center
                </h3>
                <p className="text-[10px] text-muted-foreground mt-1 font-medium">Tracking real-time actions and alerts</p>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-muted rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">Unread Alerts</h4>
                  {notifications.filter(n => !n.read).map((n) => (
                    <div 
                      key={n.id} 
                      className="group bg-primary/5 border border-primary/20 rounded-2xl p-4 hover:bg-primary/10 transition-all cursor-pointer"
                      onClick={() => markAsRead(n.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-primary" />
                           <p className="text-xs font-black">{n.title}</p>
                         </div>
                         <p className="text-[9px] font-bold text-muted-foreground">{n.time}</p>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                  {unreadCount === 0 && (
                    <div className="p-8 text-center bg-muted/20 border border-dashed rounded-2xl">
                       <TrendingUp className="mx-auto w-8 h-8 text-muted-foreground/40 mb-3" />
                       <p className="text-xs font-bold text-muted-foreground">Portfolio is performing stable.</p>
                       <p className="text-[10px] text-muted-foreground/60">No new alerts to display.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border/50 bg-muted/20 text-center">
               <Link href="/reports" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:underline">
                 View Full Audit Logs
               </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
