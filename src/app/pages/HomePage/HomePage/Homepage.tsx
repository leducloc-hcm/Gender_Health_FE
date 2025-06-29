import AboutSection from './partials/AboutSection'
import FeaturesSection from './partials/FeaturesSection'
import HeroSection from './partials/HeroSection'
import BookingConsultantSection from './partials/BookingConsultantSection'
import PartnerSection from '@/app/pages/HomePage/HomePage/partials/PartnerSection'
import BlogSection from '@/app/pages/HomePage/HomePage/partials/BlogSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PartnerSection />
      <FeaturesSection />
      <BookingConsultantSection />
      <BlogSection />
      <AboutSection />
    </>
  )
}
