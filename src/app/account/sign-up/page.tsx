'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from '../auth.module.scss'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Registration failed.')
      }

      router.push('/account')
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Registration failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="site">
      <Header />
      <main className="main">
        <section className={styles.section}>
          <div className="container">
            <div className={styles.card}>
              <h1 className={`headline-1 ${styles.title}`}>Create account</h1>
              <p className={`paragraph-2 ${styles.text}`}>Create an account to save roles and track applications.</p>

              <form className={styles.form} onSubmit={onSubmit}>
                <div>
                  <label className={styles.label} htmlFor="name">
                    Name (optional)
                  </label>
                  <input
                    id="name"
                    className={styles.input}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className={styles.label} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    className={styles.input}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div>
                  <label className={styles.label} htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    className={styles.input}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>

                <button className={styles.submit} type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating…' : 'Create account'}
                </button>

                {error && <p className={styles.error}>{error}</p>}
              </form>

              <p className={styles.hintRow}>
                Already have an account?{' '}
                <Link className={styles.hintLink} href="/account/sign-in">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

