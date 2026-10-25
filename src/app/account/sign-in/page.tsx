'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from '../auth.module.scss'

export default function SignInPage() {
  const router = useRouter()
  const [signupHref,setSignupHref] = useState('/account/sign-up')
  useEffect(()=>{const next=new URLSearchParams(window.location.search).get('next') || '';if(/^\/jobs\/[a-z0-9-]+$/.test(next)||next==='/admin/jobs'||next==='/account/saved-jobs')setSignupHref('/account/sign-up?next='+encodeURIComponent(next))},[])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Sign in failed.')
      }

      const next = new URLSearchParams(window.location.search).get('next') || ''
      router.push(/^\/jobs\/[a-z0-9-]+$/.test(next) || next === '/admin/jobs' || next === '/account/saved-jobs' ? next : '/account')
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Sign in failed.')
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
              <h1 className={`headline-1 ${styles.title}`}>Sign in</h1>
              <p className={`paragraph-2 ${styles.text}`}>Access your profile, saved jobs, and applications.</p>

              <form className={styles.form} onSubmit={onSubmit}>
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
                    autoComplete="current-password"
                    required
                  />
                </div>

                <button className={styles.submit} type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing in…' : 'Sign in'}
                </button>

                {error && <p className={styles.error}>{error}</p>}
              </form>

              <p className={styles.hintRow}>
                New here?{' '}
                <Link className={styles.hintLink} href={signupHref}>
                  Create an account
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

