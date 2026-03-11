'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

export default function AccountHomePage() {
  const [user, setUser] = useState<{ id: number; email: string; name: string | null } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return
        setUser(data?.user ?? null)
      })
      .finally(() => {
        if (!isMounted) return
        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="site">
      <Header />
      <main className="main">
        <section className="container block-container mb-l">
          <h1 className="headline-1 mb-m">My Account</h1>
          {isLoading ? (
            <p className="paragraph-2">Loading…</p>
          ) : user ? (
            <>
              <p className="paragraph-2 mb-s">
                Signed in as <strong>{user.email}</strong>
                {user.name ? (
                  <>
                    {' '}
                    ({user.name})
                  </>
                ) : null}
                .
              </p>
              <p className="paragraph-2">
                Go to your <Link href="/account/profile">profile</Link>, view <Link href="/account/saved-jobs">saved jobs</Link>, or check{' '}
                <Link href="/account/applications">applications</Link>.
              </p>
            </>
          ) : (
            <p className="paragraph-2">
              You are not signed in. <Link href="/account/sign-in">Sign in</Link> or <Link href="/account/sign-up">create an account</Link>.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

