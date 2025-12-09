import CustomNfcCardSection from "@/components/CustomNfcCardSection";
import DetailedAnalytics from "@/components/DetailedAnalytics";
import FeaturesGrid from "@/components/FeaturesGrid";
import Faq from "@/components/Faq";
import HeroSection from "@/components/HeroSection";
import ManageYourLinks from "@/components/ManageYourLinks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <main className="relative bg-[#FEF4EA]">
      <HeroSection />
      <FeaturesGrid />
      <CustomNfcCardSection/>
      <ManageYourLinks/>
      <DetailedAnalytics />
      <Testimonials />
      <Faq />
      <Footer />
    </main>
  );
}
