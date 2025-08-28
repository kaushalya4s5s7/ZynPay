// app/page.tsx or pages/index.tsx (depending on your project structure)

import React from 'react';
import { useState, useEffect } from 'react';
import useFullPageLoader from '@/hooks/usePageLoader';
import Loader from '@/components/ui/loader';

import Navbar from '@/components/home/Navbar';
import Hero from '@/components/home/Hero1';
import ProblemSolution from '@/components/home/ProblemSolution';
import Workflow from '@/components/home/workflow';
import LogoCarousel from '@/components/home/logoCarousel';
import GlobalCoverage from '@/components/home/GlobalCoverage';
import LiveStats from '@/components/home/LiveStats';
import UseCases from '@/components/home/UseCases';
import Testimonials from '@/components/home/Testimonials';
import Pricing from '@/components/home/Pricing';
import Security from '@/components/home/Security';
import CallToAction from '@/components/home/CallToAction';
import FloatingCTA from '@/components/home/FloatingCTA';
import Features from '@/components/home/Features';
import GlobalPayrollFeatureCarousel from '@/components/home/FeatureDemo';

function LandingPage() {
    
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <LogoCarousel />
      <Features />
      <ProblemSolution />
      <GlobalPayrollFeatureCarousel />
      <GlobalCoverage />
      <LiveStats />
      <UseCases />
      <Testimonials />
      <Pricing />
      {/* <Security /> */}
      <CallToAction />
      <FloatingCTA />
    </main>
  );
}

// Export with loader
const LandingWithLoader = useFullPageLoader(LandingPage, <Loader />);
export default LandingWithLoader;
