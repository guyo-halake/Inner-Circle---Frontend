"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuthStore } from "@/store/useAuthStore";
import { API_URL } from "@/lib/api";
import { 
  ShieldCheck, 
  User, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Settings as SettingsIcon,
  ChevronRight,
  ShieldAlert,
  Fingerprint
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  
  const stats = [
    { label: "Investor Tier", value: "Platinum", icon: ShieldCheck, color: "text-yellow-500" },
    { label: "Account Status", value: "Verified", icon: User, color: "text-green-500" },
    { label: "Last Session", value: "Today, 14:40", icon: Calendar, color: "text-primary" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        <h1 className="text-4xl font-black mb-2 tracking-tighter">Private Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
           {/* Profile Card (Left) */}
           <div className="md:col-span-1 space-y-6">
              <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[80px] -mr-16 -mt-16 group-hover:bg-primary/20 transition-all duration-700" />
                 
                 <div className="relative flex flex-col items-center text-center">
                    <div className="relative mb-6">
                       <div className="p-1 rounded-full ring-4 ring-primary/20">
                          <img 
                            src={user?.avatarUrl ? `${API_URL}${user.avatarUrl}` : `https://ui-avatars.com/api/?name=${user?.fullName}&background=random`}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full object-cover"
                          />
                       </div>
                       <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-500 rounded-full border-4 border-background flex items-center justify-center">
                          <ShieldCheck size={14} className="text-black fill-current" />
                       </div>
                    </div>
                    <h2 className="text-xl font-black mb-1">{user?.fullName || "Investor"}</h2>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-6">{user?.email}</p>
                    
                    <div className="w-full space-y-3">
                       {stats.map((stat, i) => (
                          <div key={i} className="flex justify-between items-center px-4 py-2.5 bg-muted/30 border border-border/20 rounded-xl">
                             <div className="flex items-center gap-2">
                                <stat.icon size={12} className={stat.color} />
                                <span className="text-[10px] font-black uppercase text-muted-foreground">{stat.label}</span>
                             </div>
                             <span className="text-[10px] font-black">{stat.value}</span>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
              
              <Link href="/settings" className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-muted border border-border/50 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-muted/80 transition-all">
                 <SettingsIcon size={14} />
                 Account Settings
              </Link>
           </div>

           {/* Security Hub (Right) */}
           <div className="md:col-span-2 space-y-8">
              <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-xl">
                 <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-8 flex items-center gap-3">
                    <ShieldAlert size={14} className="text-primary" />
                    Institutional Security Hub
                 </h3>
                 
                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-5 bg-background/50 border border-border/40 rounded-2xl hover:border-primary/30 transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-muted rounded-xl text-primary">
                             <Fingerprint size={24} />
                          </div>
                          <div>
                             <p className="text-xs font-black uppercase tracking-widest">Two-Factor Authentication</p>
                             <p className="text-[10px] text-muted-foreground leading-relaxed font-bold">Enabled via SMS & Authenticator App</p>
                          </div>
                       </div>
                       <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary" />
                    </div>

                    <div className="flex items-center justify-between p-5 bg-background/50 border border-border/40 rounded-2xl hover:border-primary/30 transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-muted rounded-xl text-primary">
                             <MapPin size={24} />
                          </div>
                          <div>
                             <p className="text-xs font-black uppercase tracking-widest">Active Login Locations</p>
                             <p className="text-[10px] text-muted-foreground leading-relaxed font-bold italic">Nairobi, Kenya • Mac OS Ventura</p>
                          </div>
                       </div>
                       <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary" />
                    </div>
                 </div>

                 <div className="mt-10 pt-10 border-t border-border/50">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Investment Strategy Weight</h4>
                    <div className="flex gap-3 flex-wrap">
                       {["Compounding Alpha", "Diversified Risk", "Forex Yield"].map((tag) => (
                          <span key={tag} className="px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-tighter rounded-full">
                             {tag}
                          </span>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-muted border border-dashed border-border/50 rounded-2xl text-center">
                 <p className="text-[10px] text-muted-foreground font-bold italic">
                    Member since January 2026. Your account is audited monthly by InnerCircle Compliance.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
