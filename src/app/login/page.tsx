"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthStore } from '@/store/useAuthStore';
import { API_URL } from "@/lib/api";
import { motion } from "framer-motion";
import { Mail, Phone, Lock, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().min(4, { message: "Please enter a valid email or phone number" }),
  password: z.string().min(7, { message: "Password must be at least 7 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email, // backend maps this parameter to search either email or phone
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to login');
      }

      const { token, user } = await response.json();
      login(user, token);

      const role = user?.role?.toLowerCase();
      if (role === "admin" || role === "developer") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      alert(`Login failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/20 relative overflow-hidden">
      {/* Background radial gradient decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(23,23,23,0.03)_0%,transparent_60%)] pointer-events-none" />

      <header className="p-6 flex justify-between items-center relative z-10">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <img 
            src="/WhatsApp_Image_2026-05-23_at_13.40.38-removebg-preview.png" 
            alt="InnerCircle Logo" 
            className="h-16 w-auto object-contain" 
          />
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-grow flex items-center justify-center p-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="w-full max-w-md bg-card border rounded-2xl shadow-lg shadow-black/[0.02] p-8 md:p-10 relative overflow-hidden"
        >
          {/* Card Top Branding Logo */}
          <div className="flex flex-col items-center mb-8">
            <img 
              src="/WhatsApp_Image_2026-05-23_at_13.40.38-removebg-preview.png" 
              alt="InnerCircle Logo" 
              className="h-20 w-auto object-contain mb-4" 
            />
            <h1 className="text-xl font-bold tracking-tight mb-1">Please login to your account</h1>
          </div>

          {/* Modern Sliding Tabs */}
          <div className="flex bg-muted p-1 rounded-xl mb-6 relative">
            <button
              type="button"
              onClick={() => {
                setLoginMethod("email");
                setValue("email", "");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all relative z-10 flex items-center justify-center gap-1.5 cursor-pointer ${
                loginMethod === "email" ? "text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> Email
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMethod("phone");
                setValue("email", "");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all relative z-10 flex items-center justify-center gap-1.5 cursor-pointer ${
                loginMethod === "phone" ? "text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              <Phone className="w-3.5 h-3.5" /> Phone Number
            </button>

            {/* Sliding Pill Indicator */}
            <motion.div
              layoutId="loginTabIndicator"
              className="absolute top-1 bottom-1 left-1 bg-primary rounded-lg -z-0"
              initial={false}
              animate={{
                left: loginMethod === "email" ? "4px" : "50%",
                width: "calc(50% - 6px)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Conditional email/phone inputs */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {loginMethod === "email" ? "Email Address" : "Phone Number"}
              </label>
              <div className="relative">
                <input
                  id="email"
                  type={loginMethod === "email" ? "email" : "tel"}
                  {...register("email")}
                  className={`w-full pl-4 pr-4 py-3 bg-background border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
                    errors.email ? "border-destructive" : "border-input"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-destructive font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full pl-4 pr-4 py-3 bg-background border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
                    errors.password ? "border-destructive" : "border-input"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-[11px] text-destructive font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Submit button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm shadow-md hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isSubmitting ? "Authenticating..." : "Login"}
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>

          {/* Account sign up link */}
          <div className="mt-8 text-center border-t pt-6">
            <p className="text-xs text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary font-bold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="p-8 border-t text-center text-[10px] text-muted-foreground leading-relaxed">
        &copy; 2026 InnerCircle. All rights reserved. Developed by P3L Developers, Matta.
      </footer>
    </div>
  );
}
