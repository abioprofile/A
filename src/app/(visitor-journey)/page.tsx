import ContactUs from "@/components/ContactUs";
import FeaturesForYou from "@/components/FeaturesForYou";
import GetStarted from "@/components/GetStarted";
import Testimonials from "@/components/Testimonials";


export default function Home() {
  return (
    <main className="px-5 mt-5">
      <FeaturesForYou />
      <Testimonials />
      <GetStarted />
      <ContactUs />
    </main>
  );
}
