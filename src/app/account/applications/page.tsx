'use client'

import { useCallback, useEffect, useState } from 'react'
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

async function readError(res: Response, fallback: string) {
  const data = await res.json().catch(() => ({}))
  return data?.error || fallback
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [requiresAuth, setRequiresAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminError, setAdminError] = useState<string | null>(null)
  const [updateMessage, setUpdateMessage] = useState<string | null>(null)
  const [updatingAppId, setUpdatingAppId] = useState<number | null>(null)

  const loadApplications = useCallback(async ({ showLoading = false }: { showLoading?: boolean } = {}) => {
    if (showLoading) setLoading(true)
    setLoadError(null)

    try {
      const res = await fetch('/api/job-applications', { credentials: 'include' })
      if (res.status === 401) {
        setRequiresAuth(true)
        setApplications([])
        return
      }

      if (!res.ok) {
        throw new Error(await readError(res, 'Could not load your applications.'))
      }

      const data = await res.json()
      setRequiresAuth(false)
      setApplications(Array.isArray(data?.applications) ? data.applications : [])
    } catch (err: unknown) {
      setApplications([])
      setLoadError(err instanceof Error ? err.message : 'Could not load your applications.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadApplications({ showLoading: true })
  }, [loadApplications])

  useEffect(() => {
    async function loadAdminFlag() {
      try {
        const res = await fetch('/api/admin/is-admin', { credentials: 'include' })
        if (res.status === 200) {
          const data = await res.json()
          setIsAdmin(Boolean(data?.isAdmin))
        } else {
          setIsAdmin(false)
        }
      } catch {
        setIsAdmin(false)
      }
    }

    loadAdminFlag()
  }, [])

  const updateApplicationStatus = async (applicationId: number, newStatus: string) => {
    setUpdatingAppId(applicationId)
    setAdminError(null)
    setUpdateMessage(null)

    try {
      const res = await fetch('/api/admin/job-applications/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ applicationId, newStatus }),
      })

      if (!res.ok) {
        throw new Error(await readError(res, 'Could not update the application status.'))
      }

      await loadApplications()
      setUpdateMessage('Application status updated.')
    } catch (err: unknown) {
      setAdminError(err instanceof Error ? err.message : 'Could not update the application status.')
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
            <p className="paragraph-2">Loading...</p>
          ) : requiresAuth ? (
            <p className="paragraph-2">
              Please <Link href="/account/sign-in">sign in</Link> to view your applications.
            </p>
          ) : loadError ? (
            <div>
              <p className="paragraph-2" style={{ color: '#ffb4a2' }}>
                {loadError}
              </p>
              <button
                type="button"
                onClick={() => loadApplications({ showLoading: true })}
                style={{
                  border: 0,
                  borderRadius: 999,
                  padding: '10px 18px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Try again
              </button>
            </div>
          ) : applications.length === 0 ? (
            <p className="paragraph-2">You have no applications yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {updateMessage ? (
                <p className="paragraph-2" style={{ color: '#9ee493', margin: 0 }}>
                  {updateMessage}
                </p>
              ) : null}
              {adminError ? (
                <p className="paragraph-2" style={{ color: '#ffb4a2', margin: 0 }}>
                  {adminError}
                </p>
              ) : null}

              {applications.map((app) => (
                <div
                  key={app.id}
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
                          aria-label={`Update status for ${app.job_title ?? app.job_link}`}
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
                          {updatingAppId === app.id ? 'Updating...' : ''}
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
