import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemsSection from "@/components/ProblemsSection";
import SolutionsSection from "@/components/SolutionsSection";
import BenefitsSection from "@/components/BenefitsSection";
import WhyUsSection from "@/components/WhyUsSection";
import ResultsSection from "@/components/ResultsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProblemsSection />
        <SolutionsSection />
        <BenefitsSection />
        <WhyUsSection />
        <ResultsSection />
        <TestimonialsSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
