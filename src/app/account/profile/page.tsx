'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from '../auth.module.scss'

type User = { id: number; email: string; name: string | null }

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [name, setName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        const u = data?.user ?? null
        setUser(u)
        setName(u?.name ?? '')
      })
      .finally(() => setIsLoading(false))
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveError(null)
    setSaveSuccess(false)
    setIsSaving(true)

    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to save.')
      }

      setUser((prev) => (prev ? { ...prev, name: data.name } : prev))
      setSaveSuccess(true)
    } catch (err: any) {
      setSaveError(err?.message || 'Failed to save.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="site">
      <Header />
      <main className="main">
        <section className={styles.section}>
          <div className="container">
            <div className={styles.card}>
              <h1 className={`headline-1 ${styles.title}`}>Profile</h1>
              <p className={`paragraph-2 ${styles.text}`}>Review and update your personal information.</p>

              {isLoading ? (
                <p className="paragraph-2">Loading…</p>
              ) : !user ? (
                <p className="paragraph-2">
                  Please <Link href="/account/sign-in">sign in</Link> to view your profile.
                </p>
              ) : (
                <form className={styles.form} onSubmit={onSubmit}>
                  <div>
                    <label className={styles.label} htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      className={styles.input}
                      type="email"
                      value={user.email}
                      disabled
                      style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    />
                  </div>

                  <div>
                    <label className={styles.label} htmlFor="name">
                      Display name
                    </label>
                    <input
                      id="name"
                      className={styles.input}
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        setSaveSuccess(false)
                      }}
                      autoComplete="name"
                      placeholder="Your name"
                    />
                  </div>

                  <button className={styles.submit} type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving…' : 'Save changes'}
                  </button>

                  {saveError && <p className={styles.error}>{saveError}</p>}
                  {saveSuccess && (
                    <p className={styles.error} style={{ color: '#1ed760' }}>
                      Profile updated.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
