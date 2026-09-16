// Landing page – core sections
import HeroSection from '../components/landing/HeroSection';
import ServicesSection from '../components/landing/ServicesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FAQSection from '../components/landing/FAQSection';
import ContactSection from '../components/landing/ContactSection';
import { FooterCta } from '@/components/ui/ember-footer-cta';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <FooterCta
        eyebrow="stay in the loop"
        heading="Join the waitlist."
        sub="Get early access to new consultants, features, and platform updates."
        note="no spam, one launch email"
        onWaitlistSubmit={(email) => {
          console.info('[waitlist]', email);
        }}
      />
    </div>
  );
}
