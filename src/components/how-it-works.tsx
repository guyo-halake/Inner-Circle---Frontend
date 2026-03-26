import { ArrowRightLeft, ShieldCheck, TrendingUp } from "lucide-react";

const steps = [
  {
    title: "Deposit funds",
    description: "Connect your preferred payment method and deposit capital securely into the trading pool.",
    icon: ArrowRightLeft,
  },
  {
    title: "Managed by experts",
    description: "Capital is managed by our experienced trading team using low-risk, proven strategies.",
    icon: ShieldCheck,
  },
  {
    title: "Track & Withdraw",
    description: "Monitor performance in real-time and request withdrawals whenever you need access to funds.",
    icon: TrendingUp,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center p-8 bg-card rounded-xl border hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
