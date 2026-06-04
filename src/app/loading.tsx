import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

export default function Loading() {
  return (
    <div className="site">
      <Header />
      <main className="main">
        <section className="container block-container mb-l">
          <h1 className="headline-1 mb-m">Loading…</h1>
          <p className="paragraph-2">Please wait a moment.</p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

