"use client";
import HeroSection from "@/components/HeroSection";
import NavBar from "@/components/partials/NavBar";
import FeaturesGrid from "@/components/FeaturesGrid";
import CustomNfcCardSection from "@/components/CustomNfcCardSection";
import ManageYourLinks from "@/components/ManageYourLinks";
import DetailedAnalytics from "@/components/DetailedAnalytics";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import IntegrateSocials from "@/components/IntegrateSocials";
import SignIn from "../auth/sign-in/page";

export default function VisitorJourneyPage() {
  return (
    <main className="overflow-y-auto bg-[#FEF4EA] overflow-x-hidden scroll-smooth">
      {/* <NavBar />
      <HeroSection />
      <FeaturesGrid />
      <IntegrateSocials />
      <ManageYourLinks />
      <CustomNfcCardSection />
      <DetailedAnalytics />
      <Testimonials />
      <Faq />
      <Footer /> */}
      <SignIn/>
    </main>
  );
}
