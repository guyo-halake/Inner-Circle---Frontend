"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ThemeToggle } from "@/components/theme-toggle";
import { API_URL } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Check, AlertCircle } from "lucide-react";

// List of all countries
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia",
  "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan",
  "Vanuatu", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

const signUpSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(6, { message: "Invalid phone number" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Confirm password must be at least 8 characters" }),
  country: z.string().min(2, { message: "Country is required" }),
  agreement: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      agreement: false,
      country: "",
    },
  });

  // Handle outside click to close country dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectCountry = (country: string) => {
    setSelectedCountry(country);
    setValue("country", country, { shouldValidate: true });
    setIsDropdownOpen(false);
    setCountrySearch("");
  };

  const filteredCountries = countries.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      const nameParts = data.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const payload = {
        fullName: data.fullName,
        firstName,
        lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        country: data.country,
        role: "Investor", // Enforces ONLY Investor creation
      };

      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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
    <div className="min-h-screen flex flex-col bg-muted/20 relative overflow-hidden">
      {/* Background radial decoration */}
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
          className="w-full max-w-lg bg-card border rounded-2xl shadow-lg shadow-black/[0.02] p-8 md:p-10 relative overflow-hidden"
        >
          {/* Card Top Logo */}
          <div className="flex flex-col items-center mb-8">
            <img 
              src="/WhatsApp_Image_2026-05-23_at_13.40.38-removebg-preview.png" 
              alt="InnerCircle Logo" 
              className="h-20 w-auto object-contain mb-4" 
            />
            <h1 className="text-xl font-bold tracking-tight mb-1">Create your account</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
              <input
                {...register("fullName")}
                className={`w-full px-4 py-2.5 bg-background border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
                  errors.fullName ? "border-destructive" : "border-input"
                }`}
              />
              {errors.fullName && <p className="text-[11px] text-destructive font-medium">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
              <input
                {...register("email")}
                type="email"
                className={`w-full px-4 py-2.5 bg-background border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
                  errors.email ? "border-destructive" : "border-input"
                }`}
              />
              {errors.email && <p className="text-[11px] text-destructive font-medium">{errors.email.message}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</label>
              <input
                {...register("phone")}
                type="tel"
                className={`w-full px-4 py-2.5 bg-background border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
                  errors.phone ? "border-destructive" : "border-input"
                }`}
              />
              {errors.phone && <p className="text-[11px] text-destructive font-medium">{errors.phone.message}</p>}
            </div>

            {/* Country Dropdown with Search */}
            <div className="space-y-1.5 relative" ref={dropdownRef}>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Country</label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full px-4 py-2.5 bg-background border rounded-xl text-sm flex items-center justify-between text-left focus:outline-none focus:ring-1 focus:ring-primary ${
                  errors.country ? "border-destructive" : "border-input"
                }`}
              >
                <span className={selectedCountry ? "text-foreground" : "text-muted-foreground"}>
                  {selectedCountry || "Select your country"}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute z-20 left-0 right-0 mt-1 bg-card border rounded-xl shadow-lg max-h-60 overflow-hidden flex flex-col"
                  >
                    {/* Search Field */}
                    <div className="p-2 border-b flex items-center gap-2 bg-muted/40">
                      <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Search countries..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full bg-transparent text-xs focus:outline-none"
                      />
                    </div>

                    {/* Options list */}
                    <div className="overflow-y-auto flex-grow py-1">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((country) => (
                          <button
                            key={country}
                            type="button"
                            onClick={() => selectCountry(country)}
                            className="w-full px-4 py-2 text-left text-xs hover:bg-muted transition-colors flex items-center justify-between cursor-pointer"
                          >
                            <span>{country}</span>
                            {selectedCountry === country && <Check className="w-3.5 h-3.5 text-primary" />}
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-center text-xs text-muted-foreground">
                          No countries found
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {errors.country && <p className="text-[11px] text-destructive font-medium">{errors.country.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
              <input
                {...register("password")}
                type="password"
                className={`w-full px-4 py-2.5 bg-background border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
                  errors.password ? "border-destructive" : "border-input"
                }`}
              />
              {errors.password && <p className="text-[11px] text-destructive font-medium">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Confirm Password</label>
              <input
                {...register("confirmPassword")}
                type="password"
                className={`w-full px-4 py-2.5 bg-background border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
                  errors.confirmPassword ? "border-destructive" : "border-input"
                }`}
              />
              {errors.confirmPassword && <p className="text-[11px] text-destructive font-medium">{errors.confirmPassword.message}</p>}
            </div>

            {/* Agreement Checkbox */}
            <div className="flex items-start gap-2.5 pt-2">
              <input
                id="agreement"
                type="checkbox"
                {...register("agreement")}
                className="mt-0.5 h-4 w-4 rounded border-input text-primary focus:ring-primary/20 cursor-pointer"
              />
              <label htmlFor="agreement" className="text-xs text-muted-foreground cursor-pointer select-none">
                I agree to the Terms and Conditions of service.
              </label>
            </div>
            {errors.agreement && <p className="text-[11px] text-destructive font-medium">{errors.agreement.message}</p>}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm shadow-md hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </motion.button>
          </form>

          {/* Account Login link */}
          <div className="mt-8 text-center border-t pt-6">
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Login
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
