import { listPublishedJobs } from '@/lib/jobs'
import jobsData from '@/data/jobs.json'
export const dynamic = 'force-dynamic'
import Header from '@/components/Header/Header'
import HeroBanner from '@/components/HeroBanner/HeroBanner'
import HeroSearch from '@/components/HeroSearch/HeroSearch'
import TabSection from '@/components/TabSection/TabSection'
import FeaturedJobs from '@/components/FeaturedJobs/FeaturedJobs'
import LocationScroll from '@/components/LocationScroll/LocationScroll'
import QuickLinks from '@/components/QuickLinks/QuickLinks'
import Footer from '@/components/Footer/Footer'

export default async function Home() {
  const jobs = (await listPublishedJobs()).slice(0,6).map(job=>({id:job.id,title:job.title,category:job.category,link:'/jobs/'+job.slug,image:jobsData.featuredJobs.find(item=>item.link==='/jobs/'+job.slug)?.image}))
  return (
    <div className="site">
      <Header />
      
      <main className="main">
        <HeroBanner />
        <HeroSearch />
        <TabSection />
        <FeaturedJobs jobs={jobs} />
        <LocationScroll />
        <QuickLinks />
      </main>
      
      <Footer />
    </div>
  )
}




