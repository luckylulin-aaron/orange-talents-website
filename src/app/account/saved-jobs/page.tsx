'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from './saved-jobs.module.scss'

type SavedJob = {
  job_link: string; job_title: string | null; location: string | null;
  contract_type: string | null; salary: string | null; job_status: string | null;
}
function MetaIcon({ kind }: { kind: 'location' | 'contract' | 'salary' }) {
  return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    {kind === 'location' ? <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></> : kind === 'contract' ? <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12h18M10 12v3h4v-3"/></> : <><circle cx="12" cy="12" r="9"/><path d="M15 8h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9M12 6v12"/></>}
  </svg>
}
export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<SavedJob[]>([])
  const [loading, setLoading] = useState(true)
  const [requiresAuth, setRequiresAuth] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [message, setMessage] = useState('')
  const [removeError, setRemoveError] = useState('')
  const [pending, setPending] = useState<string[]>([])
  const locks = useRef(new Set<string>())
  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true); setLoadError(false)
    try {
      const res = await fetch('/api/saved-jobs', { credentials: 'include', cache: 'no-store', signal })
      if (res.status === 401) { setRequiresAuth(true); return }
      if (!res.ok) throw new Error('Load failed')
      const data = await res.json()
      if (!Array.isArray(data.savedJobs)) throw new Error('Invalid response')
      setRequiresAuth(false); setJobs(data.savedJobs)
    } catch { if (!signal?.aborted) setLoadError(true) }
    finally { if (!signal?.aborted) setLoading(false) }
  }, [])
  useEffect(() => { const controller = new AbortController(); load(controller.signal); return () => controller.abort() }, [load])
  async function remove(job: SavedJob) {
    if (locks.current.has(job.job_link)) return
    locks.current.add(job.job_link); setPending([...locks.current]); setRemoveError(''); setMessage('')
    try {
      const res = await fetch('/api/saved-jobs', { method: 'DELETE', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobLink: job.job_link }) })
      if (res.status === 401) { setRequiresAuth(true); return }
      if (!res.ok) throw new Error('Remove failed')
      setJobs(current => current.filter(item => item.job_link !== job.job_link))
      setMessage((job.job_title || 'Job') + ' removed from saved jobs.')
    } catch { setRemoveError('Could not remove this job. Please try again.') }
    finally { locks.current.delete(job.job_link); setPending([...locks.current]) }
  }
  return <div className="site"><Header /><main className={styles.page}>
    <section className={styles.hero}><div className={styles.container}>
      <nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/">Home</Link><span>/</span><Link href="/account">My Account</Link><span>/</span><span aria-current="page">Saved Jobs</span></nav>
      <h1>Saved Jobs</h1>
    </div></section>
    <section className={styles.content} aria-label="Saved jobs">
      {loading ? <p role="status">Loading saved jobs…</p> : requiresAuth ? <div className={styles.empty}><h2>Your saved jobs, all in one place</h2><p>Please sign in to view your saved jobs.</p><Link className={styles.primary} href="/account/sign-in?next=%2Faccount%2Fsaved-jobs">Sign in</Link></div> : loadError ? <div className={styles.empty}><p role="alert">We couldn’t load your saved jobs.</p><button className={styles.primary} onClick={() => load()}>Try again</button></div> : <>
        <h2 className={styles.heading}>Saved jobs <span>({jobs.length})</span></h2>
        {removeError && <p role="alert" className={styles.error}>{removeError}</p>}
        <p className={styles.srOnly} role="status">{message}</p>
        {jobs.length === 0 ? <div className={styles.empty}><p>You haven’t saved any jobs yet.</p><Link className={styles.primary} href="/jobs">Explore opportunities</Link></div> : <ul className={styles.list}>
          {jobs.map(job => {
            const canView = (job.job_status === 'published' || job.job_status === 'closed') && /^\/jobs\/[a-z0-9-]+$/.test(job.job_link)
            return <li key={job.job_link} className={styles.row}><div className={styles.info}>
              <h3>{job.job_title || 'Saved opportunity'}</h3>
              <div className={styles.meta}>
                {job.location && <span><MetaIcon kind="location" />{job.location}</span>}
                {job.contract_type && <span><MetaIcon kind="contract" />{job.contract_type}</span>}
                {job.salary && <span><MetaIcon kind="salary" />{job.salary}</span>}
                {job.job_status === 'closed' && <span className={styles.badge}>Applications closed</span>}
                {!canView && <span className={styles.badge}>No longer available</span>}
              </div>
            </div><div className={styles.actions}>
              {canView && <Link href={job.job_link} className={styles.primary} aria-label={'View job: ' + job.job_title}>View Job</Link>}
              <button className={styles.secondary} disabled={pending.includes(job.job_link)} onClick={() => remove(job)} aria-label={'Remove ' + job.job_title}>{pending.includes(job.job_link) ? 'Removing…' : 'Remove'}</button>
            </div></li>
          })}
        </ul>}
      </>}
    </section>
  </main><Footer /></div>
}
