import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

export default function SavedJobsPage() {
  return (
    <div className="site">
      <Header />
      <main className="main">
        <section className="container block-container mb-l">
          <h1 className="headline-1 mb-m">Saved jobs</h1>
          <p className="paragraph-2 mb-s">
            Once account features are implemented, candidates will be able to see a list of their saved roles here.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

