import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MetricStrip from "@/components/MetricStrip";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import SecuritySection from "@/components/SecuritySection";
import Footer from "@/components/Footer";
import BackgroundOrbs from "@/components/ui/BackgroundOrbs";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <BackgroundOrbs />
      <Navbar />
      <Hero />
      <MetricStrip />
      <ProblemSection />
      <SolutionSection />
      <SecuritySection />
      <Footer />
    </main>
  );
}
