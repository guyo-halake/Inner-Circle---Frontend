const testimonials = [
  {
    quote: "The transparency is what sets InnerCircle apart. Being able to track daily returns and manage withdrawals with zero friction has completely redefined private capital management for me.",
    name: "Razak Guyo",
    title: "Private Investor",
  },
  {
    quote: "I love the simplicity of the dashboard. Instead of waiting for monthly or quarterly PDF statements, I can see my allocation growth and yield in real-time.",
    name: "Sarah Rashid",
    title: "Tech Entrepreneur & Investor",
  },
  {
    quote: "Having a predictable 5% monthly return structure backed by active, transparent trade proofs gives me peace of mind that traditional options simply cannot offer.",
    name: "Joseph Gitari",
    title: "Managing Director, JG Enterprises",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">What Our Investors Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card border rounded-xl p-8 shadow-sm">
              <p className="text-muted-foreground mb-6">{testimonial.quote}</p>
              <div>
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
