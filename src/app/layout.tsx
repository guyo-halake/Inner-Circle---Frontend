import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InnerCircle | Private Investment Platform",
  description: "Private investment access with transparent performance",
};

import { Toaster } from "sonner";
import { SystemSettingsProvider } from "@/components/system-settings-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${sora.variable} font-sans min-h-screen bg-background text-foreground antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SystemSettingsProvider>
            {children}
          </SystemSettingsProvider>
          <Toaster position="top-center" richColors theme="light" />
        </ThemeProvider>
      </body>
    </html>
  );
}
