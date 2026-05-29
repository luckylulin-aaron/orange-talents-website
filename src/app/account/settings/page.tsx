'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from '../auth.module.scss'

export default function AccountSettingsPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setIsLoggedIn(!!data?.user))
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to change password.')
      }

      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setError(err?.message || 'Failed to change password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <div className="site">
      <Header />
      <main className="main">
        <section className={styles.section}>
          <div className="container">
            <div className={styles.card}>
              <h1 className={`headline-1 ${styles.title}`}>Account settings</h1>

              {isLoggedIn === null ? (
                <p className="paragraph-2">Loading…</p>
              ) : !isLoggedIn ? (
                <p className="paragraph-2">
                  Please <Link href="/account/sign-in">sign in</Link> to manage your settings.
                </p>
              ) : (
                <>
                  <p className={`paragraph-2 ${styles.text}`}>Change your password below.</p>

                  <form className={styles.form} onSubmit={onSubmit}>
                    <div>
                      <label className={styles.label} htmlFor="currentPassword">
                        Current password
                      </label>
                      <input
                        id="currentPassword"
                        className={styles.input}
                        type="password"
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value)
                          setSuccess(false)
                        }}
                        autoComplete="current-password"
                        required
                      />
                    </div>

                    <div>
                      <label className={styles.label} htmlFor="newPassword">
                        New password
                      </label>
                      <input
                        id="newPassword"
                        className={styles.input}
                        type="password"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value)
                          setSuccess(false)
                        }}
                        autoComplete="new-password"
                        required
                        minLength={8}
                      />
                    </div>

                    <div>
                      <label className={styles.label} htmlFor="confirmPassword">
                        Confirm new password
                      </label>
                      <input
                        id="confirmPassword"
                        className={styles.input}
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          setSuccess(false)
                        }}
                        autoComplete="new-password"
                        required
                      />
                    </div>

                    <button className={styles.submit} type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving…' : 'Change password'}
                    </button>

                    {error && <p className={styles.error}>{error}</p>}
                    {success && (
                      <p className={styles.error} style={{ color: '#1ed760' }}>
                        Password changed successfully.
                      </p>
                    )}
                  </form>

                  <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                    <p className={styles.label} style={{ marginBottom: 12 }}>
                      Sign out
                    </p>
                    <button
                      className={styles.submit}
                      type="button"
                      onClick={onSignOut}
                      style={{ background: 'rgba(0,0,0,0.08)', color: 'inherit' }}
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
