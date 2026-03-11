 'use client'

import Header from '@/components/Header/Header'
import HeroSearch from '@/components/HeroSearch/HeroSearch'
import Footer from '@/components/Footer/Footer'
import Link from 'next/link'
 import { useSearchParams } from 'next/navigation'
import jobsData from '@/data/jobs.json'

function normalize(text: string) {
  return text.toLowerCase().trim()
}

export default function JobsPage() {
  const searchParams = useSearchParams()
  const rawQuery = searchParams.get('query') ?? ''
  const query = normalize(rawQuery)

  const allJobs = [...jobsData.featuredJobs, ...jobsData.heroJobs].filter(
    (job, index, arr) => arr.findIndex((other) => other.link === job.link) === index,
  )

  const filtered = query.length
    ? allJobs.filter((job) => normalize(`${job.title} ${job.category}`).includes(query))
    : allJobs

  return (
    <div className="site">
      <Header />

      <main className="main">
        <HeroSearch />
        <section className="container block-container mb-l">
          <h1 className="headline-1 mb-xs">Job openings</h1>
          <p className="paragraph-2 mb-m">
            {query.length ? (
              <>
                Showing results for <strong>{rawQuery}</strong> ({filtered.length})
              </>
            ) : (
              <>Browse current opportunities ({filtered.length})</>
            )}
          </p>

          {filtered.length === 0 ? (
            <p className="paragraph-2">No roles match your search. Try another keyword.</p>
          ) : (
            <div className="row">
              <div className="col-12 col-md-8">
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {filtered.map((job) => (
                    <li
                      key={job.link}
                      style={{
                        padding: '16px 0',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <Link href={job.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <p className="detail-2 ma-0" style={{ opacity: 0.7 }}>
                          {job.category.toUpperCase()}
                        </p>
                        <p className="headline-3 ma-0">{job.title}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

