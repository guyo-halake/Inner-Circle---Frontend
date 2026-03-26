"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Something went wrong</h1>
          <p className="text-muted-foreground">
            We encountered an unexpected error. Our team has been notified.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border border-border px-6 py-2 rounded-lg font-medium hover:bg-accent transition-colors"
          >
            Go back home
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          Error ID: {error.digest || "unknown"}
        </p>
      </div>
    </div>
  );
}
