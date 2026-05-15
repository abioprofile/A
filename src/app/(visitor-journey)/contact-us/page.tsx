"use client";

import Footer from "@/components/Footer";
import NavBar from "@/components/partials/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { toast } from "sonner";
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  MessageCircle, 
  Users, 
  Globe,
  ArrowRight,
  Bell,
  Heart
} from "lucide-react";

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Message sent successfully!", {
      description: "We'll get back to you within 24 hours.",
    });
    
    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
    
    toast.success("Subscribed successfully!", {
      description: "Thank you for joining our newsletter.",
    });
    
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const inputVariants = {
    focus: { 
      scale: 1.01,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    hover: { 
      scale: 1.005,
      transition: { duration: 0.2, ease: "easeInOut" }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        duration: 0.5 
      }
    },
  };

  const featureCardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      },
    }),
    hover: {
      y: -4,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  const features = [
    { icon: MessageCircle, title: "Quick Support", desc: "Average response time under 2 hours" },
    { icon: Users, title: "Community", desc: "Join 10,000+ creators worldwide" },
    { icon: Globe, title: "Global Reach", desc: "Available in 50+ countries" },
    { icon: Heart, title: "Made with Love", desc: "Dedicated support team" },
  ];

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#FEF4EA] overflow-x-hidden"
    >
      <NavBar />
      
      <main className="flex flex-col items-center justify-center px-5 pt-32 pb-20">
        {/* Hero Section */}
        <motion.div 
          variants={itemVariants}
          className="mb-16 max-w-3xl text-center"
        >
          <motion.div
            variants={iconVariants}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 bg-[#FED45C] flex items-center justify-center shadow-md">
              <Mail className="w-8 h-8 text-[#331400]" />
            </div>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#331400] mb-4 tracking-tight"
          >
            Let's Talk
          </motion.h1>
          
          <motion.div
            variants={itemVariants}
            className="w-20 h-0.5 bg-[#FED45C] mx-auto mb-6"
          />
          
          <motion.p 
            variants={itemVariants}
            className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed"
          >
            Whether you're curious about features, need support, or want to share feedback — 
            we're here to help. Drop us a message and we'll respond within 24 hours.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              custom={index}
              variants={featureCardVariants}
              whileHover="hover"
              className="bg-white border border-[#E0D5C8] p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.2 }}
                className="w-12 h-12 bg-[#FED45C]/10 flex items-center justify-center mx-auto mb-4"
              >
                <feature.icon className="w-6 h-6 text-[#331400]" />
              </motion.div>
              <h3 className="font-semibold text-[#331400] mb-2">{feature.title}</h3>
              <p className="text-xs text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          variants={cardVariants}
          className="w-full max-w-2xl bg-white border border-[#E0D5C8] shadow-lg p-8 md:p-12"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#331400] mb-2">Send a Message</h2>
            <p className="text-sm text-gray-600">
              Fill out the form below and we'll get back to you shortly.
            </p>
          </motion.div>

          <motion.form 
            variants={itemVariants}
            onSubmit={handleContactSubmit} 
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="border-2 border-[#E0D5C8] focus:border-[#331400] focus:ring-0 rounded-none h-12 px-4 text-base transition-all duration-200"
                whileFocus="focus"
                whileHover="hover"
                variants={inputVariants}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="border-2 border-[#E0D5C8] focus:border-[#331400] focus:ring-0 rounded-none h-12 px-4 text-base transition-all duration-200"
                whileFocus="focus"
                whileHover="hover"
                variants={inputVariants}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                required
                className="border-2 border-[#E0D5C8] focus:border-[#331400] focus:ring-0 rounded-none px-4 py-3 text-base transition-all duration-200 resize-none"
                whileFocus="focus"
                whileHover="hover"
                variants={inputVariants}
              />
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="text-center"
            >
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#FED45C] hover:bg-[#FECB33] text-[#331400] font-semibold h-12 rounded-none transition-all duration-300 group"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-[#331400] border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </motion.form>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div 
          variants={cardVariants}
          className="mt-20 w-full max-w-3xl bg-gradient-to-br from-[#331400] to-[#4a2c1a] border border-[#E0D5C8] p-10 md:p-14 text-center shadow-lg relative overflow-hidden"
        >
          {/* Animated background elements */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-64 h-64 bg-[#FED45C]/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 w-64 h-64 bg-[#FED45C]/5 rounded-full blur-3xl"
          />

          {/* <motion.div variants={itemVariants} className="relative z-10">
            <motion.div
              variants={iconVariants}
              className="flex justify-center mb-6"
            >
              <div className="w-16 h-16 bg-[#FED45C] flex items-center justify-center shadow-md">
                <Bell className="w-8 h-8 text-[#331400]" />
              </div>
            </motion.div>

            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-white mb-3"
            >
              Stay in the Loop
            </motion.h2>
            
            <motion.p 
              variants={itemVariants}
              className="text-sm md:text-base text-[#FFE4A5] mb-8 max-w-md mx-auto"
            >
              Get the latest updates, features, and tips delivered straight to your inbox.
            </motion.p>

            <motion.form 
              variants={itemVariants}
              onSubmit={handleNewsletterSubmit} 
              className="flex flex-col sm:flex-row items-center gap-4 justify-center"
            >
              <div className="relative flex-1 max-w-md w-full">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  className="border-2 border-[#E0D5C8] bg-white/10 text-white placeholder:text-white/60 focus:border-[#FED45C] focus:ring-0 rounded-none h-12 px-4 text-base transition-all duration-200"
                  whileFocus="focus"
                  whileHover="hover"
                  variants={inputVariants}
                />
              </div>
              
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-full sm:w-auto"
              >
                <Button 
                  type="submit" 
                  className="w-full sm:w-36 bg-[#FED45C] hover:bg-[#FECB33] text-[#331400] font-semibold h-12 rounded-none transition-all duration-300 group"
                >
                  <AnimatePresence mode="wait">
                    {isSubscribed ? (
                      <motion.div
                        key="success"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="flex items-center"
                      >
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Subscribed!
                      </motion.div>
                    ) : (
                      <motion.div
                        key="subscribe"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center"
                      >
                        Subscribe
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </motion.form>

            <motion.p 
              variants={itemVariants}
              className="text-xs text-white/50 mt-6"
            >
              Loved by creators, influencers, artists, musicians, coaches, and entrepreneurs worldwide.
            </motion.p>
          </motion.div> */}
        </motion.div>

        Trust Indicators
        <motion.div 
          variants={itemVariants}
          className="mt-16 text-center"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-2 text-sm text-gray-600"
          >
            <Sparkles className="w-4 h-4 text-[#FED45C]" />
            <span>Trusted by 10,000+ creators</span>
            <Sparkles className="w-4 h-4 text-[#FED45C]" />
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
    </motion.section>
  );
};

export default ContactPage;