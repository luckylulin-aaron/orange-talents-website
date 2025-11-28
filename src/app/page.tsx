import Header from '@/components/Header/Header'
import HeroBanner from '@/components/HeroBanner/HeroBanner'
import HeroSearch from '@/components/HeroSearch/HeroSearch'
import TabSection from '@/components/TabSection/TabSection'
import FeaturedJobs from '@/components/FeaturedJobs/FeaturedJobs'
import LocationScroll from '@/components/LocationScroll/LocationScroll'
import QuickLinks from '@/components/QuickLinks/QuickLinks'
import Footer from '@/components/Footer/Footer'

export default function Home() {
  return (
    <div className="site">
      <Header />
      
      <main className="main">
        <HeroBanner />
        <HeroSearch />
        <TabSection />
        <FeaturedJobs />
        <LocationScroll />
        <QuickLinks />
      </main>
      
      <Footer />
    </div>
  )
}




