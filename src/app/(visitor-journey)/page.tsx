"use client"; // Add this at the top

import { motion } from "framer-motion";
import CustomNfcCardSection from "@/components/CustomNfcCardSection";
import DetailedAnalytics from "@/components/DetailedAnalytics";
import FeaturesGrid from "@/components/FeaturesGrid";
import Faq from "@/components/Faq";
import HeroSection from "@/components/HeroSection";
import ManageYourLinks from "@/components/ManageYourLinks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  const scrollVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <main className="relative bg-[#FEF4EA]">
      <HeroSection />
      
      {/* FeaturesGrid with scroll animation */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={scrollVariants}
      >
        <FeaturesGrid />
      </motion.div>
      
      {/* CustomNfcCardSection with scroll animation */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={scrollVariants}
        transition={{ delay: 0.1 }}
      >
        <CustomNfcCardSection />
      </motion.div>
      
      {/* ManageYourLinks with scroll animation */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={scrollVariants}
        transition={{ delay: 0.2 }}
      >
        <ManageYourLinks />
      </motion.div>
      
      {/* DetailedAnalytics with scroll animation */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={scrollVariants}
        transition={{ delay: 0.3 }}
      >
        <DetailedAnalytics />
      </motion.div>
      
      {/* Testimonials with scroll animation */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={scrollVariants}
        transition={{ delay: 0.4 }}
      >
        <Testimonials />
      </motion.div>
      
      {/* FAQ with scroll animation */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={scrollVariants}
        transition={{ delay: 0.5 }}
      >
        <Faq />
      </motion.div>
      
      <Footer />
    </main>
  );
}