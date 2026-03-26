import Link from "next/link";

export function Hero() {
  return (
    <section className="pt-32 pb-16 md:pt-48 md:pb-32 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Private investment access with transparent performance
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Monitor your capital, track growth, and manage withdrawals from a single dashboard
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="w-full sm:w-auto bg-primary text-primary-foreground px-6 py-2 rounded-md text-base font-medium hover:opacity-90 transition-opacity"
          >
            Create account
          </Link>
          <Link
            href="#performance"
            className="w-full sm:w-auto border border-border bg-background px-6 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            View performance
          </Link>
        </div>
      </div>
    </section>
  );
}
