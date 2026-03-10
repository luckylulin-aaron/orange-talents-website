import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

export default function SignUpPage() {
  return (
    <div className="site">
      <Header />
      <main className="main">
        <section className="container block-container mb-l">
          <h1 className="headline-1 mb-m">Create account</h1>
          <p className="paragraph-2 mb-s">
            This page will eventually let candidates create an account with Orange Talents so they can save jobs and
            track applications.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

