'use client'

import { useEffect, useState } from 'react'

import styles from './ApplyJobForm.module.scss'

type Props = {
  jobLink: string
  jobTitle: string
  jobCategory: string
}

type ExistingApplication = {
  status?: string
  created_at?: string
}

export default function ApplyJobForm({ jobLink, jobTitle, jobCategory }: Props) {
  const [coverLetter, setCoverLetter] = useState('')
  const [isApplied, setIsApplied] = useState<boolean | null>(null)
  const [existingApplication, setExistingApplication] = useState<ExistingApplication | null>(null)
  const [requiresAuth, setRequiresAuth] = useState(false)
  const [checking, setChecking] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [checkWarning, setCheckWarning] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadApplied() {
      setError(null)
      setSuccess(null)
      setCheckWarning(null)
      setChecking(true)

      try {
        const res = await fetch(`/api/job-applications/is-applied?jobLink=${encodeURIComponent(jobLink)}`, {
          credentials: 'include',
        })

        if (res.status === 401) {
          if (!isMounted) return
          setRequiresAuth(true)
          setIsApplied(false)
          setExistingApplication(null)
          return
        }

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data?.error || 'Unable to check application status.')
        }

        const data = await res.json()
        if (!isMounted) return
        setRequiresAuth(false)
        setIsApplied(Boolean(data?.applied))
        setExistingApplication(data?.application ?? null)
      } catch {
        if (!isMounted) return
        setRequiresAuth(false)
        setIsApplied(false)
        setExistingApplication(null)
        setCheckWarning('We could not verify whether you already applied. You can still submit this form.')
      } finally {
        if (isMounted) setChecking(false)
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
    setSuccess(null)

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

      if (res.status === 409) {
        const data = await res.json().catch(() => ({}))
        setIsApplied(true)
        setExistingApplication(data?.application ?? null)
        setSuccess(data?.error || 'You have already applied for this job.')
        setCoverLetter('')
        return
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Application submission failed.')
      }

      const data = await res.json().catch(() => ({}))
      setIsApplied(true)
      setExistingApplication(data?.application ?? null)
      setSuccess('Application submitted. You can track it from your account.')
      setCoverLetter('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Application submission failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const appliedDate = existingApplication?.created_at
    ? new Date(existingApplication.created_at).toLocaleDateString()
    : null

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Apply for this role</h2>

      {checking ? (
        <p className={styles.hint}>Checking your application status...</p>
      ) : requiresAuth ? (
        <p className={styles.hint}>
          Please <a className={styles.link} href="/account/sign-in">sign in</a> to submit your application.
        </p>
      ) : isApplied ? (
        <div className={styles.statusBlock}>
          <p className={styles.success}>
            {success ?? 'Application submitted. You can track it in Applications.'}
          </p>
          <p className={styles.hint}>
            {existingApplication?.status ? `Current status: ${existingApplication.status}.` : null}
            {appliedDate ? ` Submitted: ${appliedDate}.` : null}
          </p>
        </div>
      ) : (
        <form className={styles.form} onSubmit={onSubmit}>
          {checkWarning ? <p className={styles.warning}>{checkWarning}</p> : null}

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
            {submitting ? 'Submitting...' : 'Submit application'}
          </button>
        </form>
      )}
    </div>
  )
}
