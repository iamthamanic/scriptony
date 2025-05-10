
import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import MediaSection from '@/components/landing/MediaSection';
import FeatureListSection from '@/components/landing/FeatureListSection';
import ComparisonSection from '@/components/landing/ComparisonSection';
import PricingSection from '@/components/landing/PricingSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import QuoteCarousel from '@/components/QuoteCarousel';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <MediaSection />
      <QuoteCarousel />
      <FeatureListSection />
      <ComparisonSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Landing;
