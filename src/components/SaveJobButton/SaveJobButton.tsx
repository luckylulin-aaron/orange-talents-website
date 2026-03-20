'use client'

import { useEffect, useState } from 'react'
import styles from './SaveJobButton.module.scss'

type Props = {
  jobLink: string
  jobTitle: string
  jobCategory: string
}

export default function SaveJobButton({ jobLink, jobTitle, jobCategory }: Props) {
  const [isSaved, setIsSaved] = useState<boolean | null>(null)
  const [requiresAuth, setRequiresAuth] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadSavedState() {
      try {
        const res = await fetch(`/api/saved-jobs/is-saved?jobLink=${encodeURIComponent(jobLink)}`, {
          credentials: 'include',
        })

        if (res.status === 401) {
          if (!isMounted) return
          setRequiresAuth(true)
          setIsSaved(false)
          return
        }

        const data = await res.json()
        if (!isMounted) return
        setRequiresAuth(false)
        setIsSaved(Boolean(data?.saved))
      } catch {
        if (!isMounted) return
        setRequiresAuth(false)
        setIsSaved(false)
      }
    }

    loadSavedState()
    return () => {
      isMounted = false
    }
  }, [jobLink])

  const onClick = async () => {
    if (requiresAuth) {
      window.location.href = '/account/sign-in'
      return
    }

    if (isSaved) {
      const res = await fetch('/api/saved-jobs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ jobLink }),
      })

      if (res.status === 401) {
        setRequiresAuth(true)
        setIsSaved(false)
        window.location.href = '/account/sign-in'
        return
      }

      if (res.ok) setIsSaved(false)
      return
    }

    const res = await fetch('/api/saved-jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        jobLink,
        jobTitle,
        jobCategory,
      }),
    })

    if (res.status === 401) {
      setRequiresAuth(true)
      setIsSaved(false)
      window.location.href = '/account/sign-in'
      return
    }

    if (res.ok) setIsSaved(true)
  }

  return (
    <button
      type="button"
      className={`${styles.button} ${isSaved ? styles.saved : ''}`}
      onClick={onClick}
      disabled={isSaved === null}
      aria-label={requiresAuth ? 'Sign in to save this job' : isSaved ? 'Unsave this job' : 'Save this job'}
    >
      {requiresAuth ? 'Sign in' : isSaved ? 'Saved' : 'Save'}
    </button>
  )
}

