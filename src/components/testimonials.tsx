const testimonials = [
  {
    quote: "InnerCircle has been a game-changer for my investment strategy. The transparency and real-time updates are exactly what I was looking for.",
    name: "John Kimani",
    title: "Investor",
  },
  {
    quote: "The platform is incredibly easy to use, and the team is always responsive. I feel in control of my capital, which is a huge plus.",
    name: "Jane Wanjiru",
    title: "Investor",
  },
  {
    quote: "I was hesitant at first, but the performance and the professionalism of the InnerCircle team have exceeded my expectations.",
    name: "Peter Omondi",
    title: "Investor",
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
