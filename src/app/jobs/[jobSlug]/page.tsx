import Link from 'next/link'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import jobsData from '@/data/jobs.json'
import SaveJobButton from '@/components/SaveJobButton/SaveJobButton'
import ApplyJobForm from '@/components/ApplyJobForm/ApplyJobForm'

type Params = {
  params: {
    jobSlug: string
  }
}

export default function JobDetailPage({ params }: Params) {
  const jobLink = `/jobs/${params.jobSlug}`

  const allJobs = [...jobsData.featuredJobs, ...jobsData.heroJobs]
  const job = allJobs.find((j: any) => j.link === jobLink)

  if (!job) {
    return (
      <div className="site">
        <Header />
        <main className="main">
          <section className="container block-container mb-l">
            <h1 className="headline-1 mb-m">Job not found</h1>
            <p className="paragraph-2">
              <Link href="/jobs">Back to jobs</Link>
            </p>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  const safeJob = job as any
  const jobTitle = safeJob.title as string
  const jobCategory = safeJob.category as string
  const jobDescription = (safeJob.description ?? '') as string

  return (
    <div className="site">
      <Header />
      <main className="main">
        <section className="container block-container mb-l">
          <h1 className="headline-1 mb-m">{jobTitle}</h1>
          <p className="paragraph-2 mb-s">{jobCategory}</p>

          {jobDescription ? <p className="paragraph-2">{jobDescription}</p> : null}
        </section>

        <section className="container block-container mb-l">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 380px' }}>
              <SaveJobButton jobLink={jobLink} jobTitle={jobTitle} jobCategory={jobCategory} />
            </div>

            <div style={{ flex: '2 1 520px' }}>
              <ApplyJobForm jobLink={jobLink} jobTitle={jobTitle} jobCategory={jobCategory} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

