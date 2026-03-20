'use client'

import { useEffect, useState } from 'react'

import styles from './ApplyJobForm.module.scss'

type Props = {
  jobLink: string
  jobTitle: string
  jobCategory: string
}

export default function ApplyJobForm({ jobLink, jobTitle, jobCategory }: Props) {
  const [coverLetter, setCoverLetter] = useState('')
  const [isApplied, setIsApplied] = useState<boolean | null>(null)
  const [requiresAuth, setRequiresAuth] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadApplied() {
      setError(null)
      try {
        const res = await fetch(`/api/job-applications/is-applied?jobLink=${encodeURIComponent(jobLink)}`, {
          credentials: 'include',
        })

        if (res.status === 401) {
          if (!isMounted) return
          setRequiresAuth(true)
          setIsApplied(false)
          return
        }

        const data = await res.json()
        if (!isMounted) return
        setRequiresAuth(false)
        setIsApplied(Boolean(data?.applied))
      } catch {
        if (!isMounted) return
        setRequiresAuth(false)
        setIsApplied(false)
      }
    }

    loadApplied()
    return () => {
      isMounted = false
    }
  }, [jobLink])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (requiresAuth) {
      window.location.href = '/account/sign-in'
      return
    }

    if (!coverLetter.trim()) {
      setError('Please write a short introduction before submitting.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/job-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          jobLink,
          jobTitle,
          jobCategory,
          coverLetter: coverLetter.trim(),
        }),
      })

      if (res.status === 401) {
        setRequiresAuth(true)
        setIsApplied(false)
        window.location.href = '/account/sign-in'
        return
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Application submission failed.')
      }

      setIsApplied(true)
      setCoverLetter('')
    } catch (err: any) {
      setError(err?.message || 'Application submission failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Apply for this role</h2>

      {requiresAuth ? (
        <p className={styles.hint}>
          Please <a className={styles.link} href="/account/sign-in">sign in</a> to submit your application.
        </p>
      ) : isApplied ? (
        <p className={styles.success}>Application submitted. You can track it in “Applications”.</p>
      ) : (
        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.label} htmlFor="coverLetter">
            Short introduction
          </label>
          <textarea
            id="coverLetter"
            className={styles.textarea}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Tell us briefly about your background, relevant experience, and why this role fits you."
            rows={6}
            required
          />

          {error ? <p className={styles.error}>{error}</p> : null}

          <button className={styles.submit} type="submit" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit application'}
          </button>
        </form>
      )}
    </div>
  )
}

