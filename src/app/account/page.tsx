import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

export default function AccountHomePage() {
  return (
    <div className="site">
      <Header />
      <main className="main">
        <section className="container block-container mb-l">
          <h1 className="headline-1 mb-m">My Account</h1>
          <p className="paragraph-2">
            This is a simple placeholder for the account overview. From here, candidates will be able to access their
            profile, saved jobs, and applications once authentication is added.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

