import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

export default function SignInPage() {
  return (
    <div className="site">
      <Header />
      <main className="main">
        <section className="container block-container mb-l">
          <h1 className="headline-1 mb-m">Sign in</h1>
          <p className="paragraph-2 mb-s">
            In the future, this page will allow candidates to sign in to view their profile, saved jobs, and
            applications. For now, it serves as a simple placeholder.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

