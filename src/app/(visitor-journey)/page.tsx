"use client";
import HeroSection from "@/components/HeroSection";
import SignIn from "../auth/sign-in/page";
import NavBar from "@/components/partials/NavBar";
import FeaturesGrid from "@/components/FeaturesGrid";
import GetStarted from "@/components/GetStarted";
export default function VisitorJourneyPage() {
  return (
    <main>
      {/* <NavBar />
      <HeroSection />
      <FeaturesGrid />
      <GetStarted/> */}

      <SignIn />
    </main>
  );
}