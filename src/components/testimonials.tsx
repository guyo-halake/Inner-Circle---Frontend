"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "The absolute transparency is what sets InnerCircle apart. Being able to track daily yields and initiate withdrawals with zero friction has redefined how I manage my private capital.",
    name: "Jeffrey Wairugu",
    title: "Private Investor",
  },
  {
    quote: "I love the clean minimalism of the dashboard. Instead of waiting for quarterly PDF statements, I can monitor my allocation growth and compounded returns in real-time.",
    name: "Sara Rashid",
    title: "Business Founder & Investor",
  },
  {
    quote: "Having a predictable, absolute-return yield structure backed by transparent trade proofs gives me peace of mind that traditional management options cannot match.",
    name: "Joseph Gitari",
    title: "Investor",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

export function Testimonials() {
  return (
    <section className="py-24 bg-muted/20 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Investor Perspectives</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base">
            Trusted by founders, executives, and private individuals seeking transparent pool exposure.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-primary/20 transition-all group relative"
            >
              <Quote className="absolute right-6 top-6 w-8 h-8 text-muted/30 group-hover:text-primary/10 transition-colors" />
              
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 relative z-10 italic">
                "{testimonial.quote}"
              </p>
              
              <div className="border-t pt-4">
                <p className="font-bold text-sm text-primary">{testimonial.name}</p>
                <p className="text-xs text-muted-foreground">{testimonial.title}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
