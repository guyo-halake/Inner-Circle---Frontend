"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, Send } from "lucide-react";

export function ContactSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Listen for the custom "open-contact" event from the navbar
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    };

    window.addEventListener("open-contact", handleOpen);
    return () => window.removeEventListener("open-contact", handleOpen);
  }, []);

  // Form link builders
  const getMailtoLink = () => {
    const subject = encodeURIComponent("InnerCircle Inquiry - " + fullName);
    const body = encodeURIComponent(
      `Hello InnerCircle Team,\n\n${message}\n\nBest regards,\n${fullName}\nEmail: ${email}`
    );
    return `mailto:innercirclehedgefund@gmail.com?subject=${subject}&body=${body}`;
  };

  const getWhatsAppLink = () => {
    const text = encodeURIComponent(
      `Hi InnerCircle, my name is ${fullName} (${email}). ${message}`
    );
    return `https://wa.me/254114339025?text=${text}`;
  };

  const isFormValid = fullName.trim() !== "" && email.trim() !== "" && message.trim() !== "";

  return (
    <section id="contact" className="py-16 bg-muted/20 border-t relative scroll-mt-20">
      <div className="container mx-auto px-4 max-w-xl text-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="trigger"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-8"
            >
              <h3 className="text-2xl font-bold mb-4">Have Questions?</h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Get direct access to our private desk regarding investment allocations or redemptions.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(true)}
                className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl text-sm font-bold shadow-md hover:opacity-95 transition-opacity cursor-pointer inline-flex items-center gap-2"
              >
                <Mail className="w-4 h-4" /> Contact Us
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
              className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm text-left relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold">Contact Our Desk</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Send an inquiry directly via Email or WhatsApp.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <a
                    href={isFormValid ? getMailtoLink() : undefined}
                    onClick={(e) => {
                      if (!isFormValid) {
                        e.preventDefault();
                        alert("Please fill in all fields before sending.");
                      }
                    }}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-center border transition-all shadow-sm ${
                      isFormValid 
                        ? "bg-background hover:bg-muted text-primary cursor-pointer" 
                        : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <Mail className="w-4 h-4" /> Send by Email
                  </a>

                  <a
                    href={isFormValid ? getWhatsAppLink() : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!isFormValid) {
                        e.preventDefault();
                        alert("Please fill in all fields before sending.");
                      }
                    }}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-center transition-all shadow-sm ${
                      isFormValid 
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer" 
                        : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
