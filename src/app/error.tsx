/* eslint-disable react/no-unescaped-entities */
'use client'

import Link from 'next/link'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="site">
      <Header />
      <main className="main">
        <section className="container block-container mb-l">
          <h1 className="headline-1 mb-m">Something went wrong</h1>
          <p className="paragraph-2 mb-s">
            We were unable to load this page. Please try again, or return to the homepage.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-24 clear-button"
              style={{
                padding: '12px 16px',
                border: '1px solid rgba(255, 145, 77, 0.55)',
                background: 'rgba(255, 145, 77, 0.08)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>

            <Link href="/" className="detail-3" style={{ color: '#ff914d' }}>
              Back to home
            </Link>
          </div>

          {process.env.NODE_ENV === 'development' && error?.digest ? (
            <p className="paragraph-2 mt-m" style={{ opacity: 0.8 }}>
              Error digest: {error.digest}
            </p>
          ) : null}
        </section>
      </main>
      <Footer />
    </div>
  )
}

