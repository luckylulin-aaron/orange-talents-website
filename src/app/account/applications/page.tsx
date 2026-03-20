/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ApplicationProgress from '@/components/ApplicationProgress/ApplicationProgress'

type Application = {
  id: number
  job_link: string
  job_title: string | null
  job_category: string | null
  cover_letter: string | null
  status: string
  created_at: string
  phaseIndex?: number
  phaseLabel?: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [requiresAuth, setRequiresAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

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

  useEffect(() => {
    async function loadAdminFlag() {
      try {
        const res = await fetch('/api/admin/is-admin', { credentials: 'include' })
        if (res.status === 200) {
          const data = await res.json()
          setIsAdmin(Boolean(data?.isAdmin))
        }
      } catch {
        setIsAdmin(false)
      }
    }

    loadAdminFlag()
  }, [])

  const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
    { value: 'submitted', label: 'Applied' },
    { value: 'applied', label: 'Applied' },
    { value: 'resume_screening_passed', label: 'Resume screening passed' },
    { value: 'interviewing', label: 'Interviewing' },
    { value: 'interview', label: 'Interviewing' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'offered', label: 'Offered' },
    { value: 'rejected_offered', label: 'Rejected / offered' },
    { value: 'onboarding', label: 'Onboarding' },
  ]

  const [updatingAppId, setUpdatingAppId] = useState<number | null>(null)

  const updateApplicationStatus = async (applicationId: number, newStatus: string) => {
    setUpdatingAppId(applicationId)
    try {
      const res = await fetch('/api/admin/job-applications/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ applicationId, newStatus }),
      })

      if (!res.ok) return

      // Reload list so phase mapping stays consistent.
      const listRes = await fetch('/api/job-applications', { credentials: 'include' })
      if (!listRes.ok) return
      const data = await listRes.json()
      setApplications(Array.isArray(data?.applications) ? data.applications : [])
    } finally {
      setUpdatingAppId(null)
    }
  }

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
                  <div style={{ flex: 1 }}>
                    <p className="detail-2 ma-0" style={{ opacity: 0.7 }}>
                      {(app.job_category ?? '').toUpperCase()}
                    </p>
                    <p className="headline-3 ma-0">
                      <Link href={app.job_link}>{app.job_title ?? app.job_link}</Link>
                    </p>
                    <p className="paragraph-2 ma-0" style={{ opacity: 0.7 }}>
                      Submitted: {new Date(app.created_at).toLocaleDateString()}
                    </p>

                    <div style={{ marginTop: 10 }}>
                      <ApplicationProgress phaseIndex={app.phaseIndex ?? 0} />
                      <p className="paragraph-2 ma-0" style={{ opacity: 0.7 }}>
                        Phase: {app.phaseLabel ?? 'Applied'} (Status: {app.status})
                      </p>
                    </div>

                    {isAdmin ? (
                      <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                        <select
                          value={app.status}
                          disabled={updatingAppId === app.id}
                          onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                          style={{
                            background: 'rgba(0,0,0,0.25)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: 10,
                            padding: '8px 10px',
                          }}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <span className="paragraph-2" style={{ opacity: 0.7 }}>
                          {updatingAppId === app.id ? 'Updating…' : ''}
                        </span>
                      </div>
                    ) : null}
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

