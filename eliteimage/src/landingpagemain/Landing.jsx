import AiFeatures from "@/components/landingpage/AiFeatures";
import ContactSection from "@/components/landingpage/ContactUs";
import Footer from "@/components/landingpage/Footer";
import Hero from "@/components/landingpage/Hero";
import HowItWork from "@/components/landingpage/HowItWork";
import Navbar from "@/components/landingpage/Navbar";
import PricingSection from "@/components/landingpage/PricingSection";
import Showcase from "@/components/landingpage/Showcase";
import Testimonials from "@/components/landingpage/Testimonials";
import WhyChooseUs from "@/components/landingpage/WhyChooseUs";
import { usePathname } from "next/navigation";

import React, { useEffect } from "react";

const Landing = () => {
  useEffect(() => {
    const hash = window.location.hash?.replace("#", "");
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const navbarHeight = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - navbarHeight;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }, 300);
    }
  }, []);
  return (
    <div>
      <Navbar />
      <Hero />
      <AiFeatures />
      <HowItWork />
      <Showcase />
      <WhyChooseUs />
      <PricingSection />
      <Testimonials />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Landing;
