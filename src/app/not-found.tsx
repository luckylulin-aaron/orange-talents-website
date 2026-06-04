import Link from 'next/link'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

export default function NotFound() {
  return (
    <div className="site">
      <Header />
      <main className="main">
        <section className="container block-container mb-l">
          <h1 className="headline-1 mb-m">Page not found</h1>
          <p className="paragraph-2 mb-s">The page you’re looking for doesn’t exist or has been moved.</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <Link
              href="/jobs"
              className="detail-3"
              style={{ color: '#ff914d', textDecoration: 'none', fontWeight: 700 }}
            >
              Browse jobs
            </Link>
            <Link
              href="/"
              className="detail-3"
              style={{ color: '#ff914d', textDecoration: 'none', fontWeight: 700 }}
            >
              Back to home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

