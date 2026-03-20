/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

type Application = {
  job_link: string
  job_title: string | null
  job_category: string | null
  cover_letter: string | null
  status: string
  created_at: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [requiresAuth, setRequiresAuth] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/job-applications', { credentials: 'include' })
        if (res.status === 401) {
          setRequiresAuth(true)
          setApplications([])
          return
        }

        const data = await res.json()
        setApplications(Array.isArray(data?.applications) ? data.applications : [])
      } catch {
        setApplications([])
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
          <h1 className="headline-1 mb-m">Applications</h1>
          <p className="paragraph-2 mb-s">Track your submissions and see their current status.</p>
        </section>

        <section className="container block-container mb-l">
          {loading ? (
            <p className="paragraph-2">Loading…</p>
          ) : requiresAuth ? (
            <p className="paragraph-2">
              Please <Link href="/account/sign-in">sign in</Link> to view your applications.
            </p>
          ) : applications.length === 0 ? (
            <p className="paragraph-2">You have no applications yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {applications.map((app) => (
                <div
                  key={`${app.job_link}-${app.created_at}`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 16,
                    padding: '14px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div>
                    <p className="detail-2 ma-0" style={{ opacity: 0.7 }}>
                      {(app.job_category ?? '').toUpperCase()}
                    </p>
                    <p className="headline-3 ma-0">
                      <Link href={app.job_link}>{app.job_title ?? app.job_link}</Link>
                    </p>
                    <p className="paragraph-2 ma-0" style={{ opacity: 0.7 }}>
                      Status: {app.status}
                    </p>
                    <p className="paragraph-2 ma-0" style={{ opacity: 0.7 }}>
                      Submitted: {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
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

