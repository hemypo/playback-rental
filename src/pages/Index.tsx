
import { HeroSection } from '@/components/home/HeroSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FeaturedProductsSection } from '@/components/home/FeaturedProductsSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { CallToActionSection } from '@/components/home/CallToActionSection';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <HowItWorksSection />
      <CallToActionSection />
    </div>
  );
};

export default Index;
