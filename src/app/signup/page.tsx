"use client";

import { useState } from "react";
import Link from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ThemeToggle } from "@/components/theme-toggle";
import NextLink from "next/link";
import { API_URL } from "@/lib/api";

const signUpSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  phone: z.string().min(6, { message: "Invalid phone number" }),
  country: z.string().min(2, { message: "Country is required" }),
  currency: z.string().min(3, { message: "Currency is required" }),
  agreement: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and risk notice",
  }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      agreement: false,
    },
  });

  const nextStep = async () => {
    let fields: (keyof SignUpFormValues)[] = [];
    if (step === 1) {
      fields = ["fullName", "email", "password"];
    } else if (step === 2) {
      fields = ["phone", "country", "currency"];
    }

    const isValid = await trigger(fields);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register');
      }

      window.location.href = "/login";
    } catch (error: any) {
      console.error('Registration failed:', error);
      alert(`Registration failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-6 flex justify-between items-center">
        <NextLink href="/" className="hover:opacity-80 transition-opacity">
          <img 
            src="/WhatsApp_Image_2026-05-23_at_13.40.38-removebg-preview.png" 
            alt="InnerCircle Logo" 
            className="h-10 w-auto object-contain" 
          />
        </NextLink>
        <ThemeToggle />
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Create Account</h1>
            <div className="flex justify-center items-center gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 w-12 rounded-full transition-colors ${
                    s <= step ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input
                    {...register("fullName")}
                    placeholder="John Doe"
                    className={`w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.fullName ? "border-destructive" : "border-input"
                    }`}
                  />
                  {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="name@example.com"
                    className={`w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.email ? "border-destructive" : "border-input"
                    }`}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className={`w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.password ? "border-destructive" : "border-input"
                    }`}
                  />
                  {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:opacity-90 transition-opacity"
                >
                  Next
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input
                    {...register("phone")}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.phone ? "border-destructive" : "border-input"
                    }`}
                  />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Country</label>
                  <input
                    {...register("country")}
                    placeholder="United States"
                    className={`w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.country ? "border-destructive" : "border-input"
                    }`}
                  />
                  {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Currency</label>
                  <select
                    {...register("currency")}
                    className={`w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.currency ? "border-destructive" : "border-input"
                    }`}
                  >
                    <option value="">Select currency</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                  {errors.currency && <p className="text-xs text-destructive">{errors.currency.message}</p>}
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 border border-border bg-background py-2 rounded-md font-medium hover:bg-accent transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 bg-primary text-primary-foreground py-2 rounded-md font-medium hover:opacity-90 transition-opacity"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="text-sm font-semibold mb-2">Risk Notice</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Investing involves risk of loss. The value of your investment can go down as well as up. 
                    Past performance is not a guarantee of future results. By proceeding, you acknowledge 
                    that you understand the risks associated with managed trading pools.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <input
                    id="agreement"
                    type="checkbox"
                    {...register("agreement")}
                    className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary/20"
                  />
                  <label htmlFor="agreement" className="text-sm text-muted-foreground">
                    I agree to the terms of service and acknowledge the risk notice.
                  </label>
                </div>
                {errors.agreement && <p className="text-xs text-destructive">{errors.agreement.message}</p>}
                
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 border border-border bg-background py-2 rounded-md font-medium hover:bg-accent transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary text-primary-foreground py-2 rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isSubmitting ? "Creating..." : "Create account"}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <NextLink href="/login" className="font-medium hover:underline">
              Login
            </NextLink>
          </div>
        </div>
      </main>

      <footer className="p-8 border-t text-center text-xs text-muted-foreground leading-relaxed">
        © 2026 InnerCircle Investor Platform. All rights reserved.<br />Developed by P3L Developers, Matta.
      </footer>
    </div>
  );
}
