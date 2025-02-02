"use client"

import Image from "next/image";
import Hero from './components/Hero';
import TrustStats from './components/TrustStats';
import CoreBenefits from './components/CoreBenefits';
import DigitalTwin from './components/DigitalTwin';
import HowItWorks from './components/HowItWorks';
import TechStack from './components/TechStack';
import ConsumerExperience from './components/ConsumerExperience';
import CaseStudies from './components/CaseStudies';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-navy-900 text-white">
      <Navbar />
      <Hero />
      <TrustStats />
      <CoreBenefits />
      <DigitalTwin />
      <HowItWorks />
      <TechStack />
      <ConsumerExperience />
      <CaseStudies />
      <FinalCTA />
      <Footer />
    </div>
  );
}
