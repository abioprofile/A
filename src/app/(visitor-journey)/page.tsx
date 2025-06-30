import ContactUs from "@/components/ContactUs";
import CustomNfcCardSection from "@/components/CustomNfcCardSection";
import DetailedAnalytics from "@/components/DetailedAnalytics";
import FeaturesForYou from "@/components/FeaturesForYou";
import GetStarted from "@/components/GetStarted";
import HeroSection from "@/components/HeroSection";
import ManageYourLinks from "@/components/ManageYourLinks";
import Testimonials from "@/components/Testimonials";
import ToolsYouUse from "@/components/ToolsYouUse";


export default function Home() {
  return (
    <main className="relative">
      <HeroSection />
      <CustomNfcCardSection />
      <DetailedAnalytics />
      <ManageYourLinks />
      <ToolsYouUse />
      <FeaturesForYou />
      <Testimonials />
      <GetStarted showBlur />
      <ContactUs />
    </main>
  );
}
