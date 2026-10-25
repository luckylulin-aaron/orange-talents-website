import { notFound } from 'next/navigation'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import JobDetail from '@/components/JobDetail/JobDetail'
import { findJob } from '@/lib/jobs'
export const dynamic = 'force-dynamic'
export default async function JobDetailPage({params}:{params:{jobSlug:string}}) {
 const job = await findJob(params.jobSlug)
 if (!job || job.status==='draft') notFound()
 return <div className="site"><Header/><main className="main" style={{background:'white'}}><JobDetail job={JSON.parse(JSON.stringify(job))}/></main><Footer/></div>
}
