import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

export default function ApplicationsPage() {
  return (
    <div className="site">
      <Header />
      <main className="main">
        <section className="container block-container mb-l">
          <h1 className="headline-1 mb-m">Applications</h1>
          <p className="paragraph-2 mb-s">
            In the future, candidates will be able to track where they are in each hiring process on this page.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

