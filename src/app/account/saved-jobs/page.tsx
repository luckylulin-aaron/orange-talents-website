/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import SaveJobButton from '@/components/SaveJobButton/SaveJobButton'

type SavedJob = {
  job_link: string
  job_title: string | null
  job_category: string | null
  saved_at: string
}

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [requiresAuth, setRequiresAuth] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/saved-jobs', { credentials: 'include' })
        if (res.status === 401) {
          setRequiresAuth(true)
          setSavedJobs([])
          return
        }

        const data = await res.json()
        setSavedJobs(Array.isArray(data?.savedJobs) ? data.savedJobs : [])
      } catch {
        setSavedJobs([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <div className="site">
      <Header />
      <main className="main">
        <section className="container block-container mb-l">
          <h1 className="headline-1 mb-m">Saved jobs</h1>
          <p className="paragraph-2 mb-s">
            Here are the roles you’ve saved.
          </p>
        </section>

        <section className="container block-container mb-l">
          {loading ? (
            <p className="paragraph-2">Loading…</p>
          ) : requiresAuth ? (
            <p className="paragraph-2">
              Please <Link href="/account/sign-in">sign in</Link> to view your saved jobs.
            </p>
          ) : savedJobs.length === 0 ? (
            <p className="paragraph-2">You have no saved jobs yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {savedJobs.map((job) => (
                <div
                  key={job.job_link}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    padding: '14px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div>
                    <p className="detail-2 ma-0" style={{ opacity: 0.7 }}>
                      {(job.job_category ?? '').toUpperCase()}
                    </p>
                    <p className="headline-3 ma-0">{job.job_title ?? job.job_link}</p>
                    <p className="paragraph-2 ma-0" style={{ opacity: 0.7 }}>
                      <Link href="/jobs">View in jobs</Link>
                    </p>
                  </div>

                  <SaveJobButton
                    jobLink={job.job_link}
                    jobTitle={job.job_title ?? ''}
                    jobCategory={job.job_category ?? ''}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

