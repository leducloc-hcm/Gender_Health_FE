// import ServicesSection from '@/app/pages/HomePage/partials/ServiceSection'
import BlogSection from '@/app/pages/HomePage/HomePage/partials/BlogSection'
import AboutSection from './partials/AboutSection'
import FeaturesSection from './partials/FeaturesSection'
import Header from './partials/Header'
import HeroSection from './partials/HeroSection'

export default function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <BlogSection />
    </>
  )
}
