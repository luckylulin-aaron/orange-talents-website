import Header from '@/components/Header/Header'
import HeroSearch from '@/components/HeroSearch/HeroSearch'
import FeaturedJobs from '@/components/FeaturedJobs/FeaturedJobs'
import Footer from '@/components/Footer/Footer'

export default function JobsPage() {
  return (
    <div className="site">
      <Header />

      <main className="main">
        <HeroSearch />
        <FeaturedJobs />
      </main>

      <Footer />
    </div>
  )
}

