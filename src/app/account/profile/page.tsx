import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

export default function ProfilePage() {
  return (
    <div className="site">
      <Header />
      <main className="main">
        <section className="container block-container mb-l">
          <h1 className="headline-1 mb-m">Profile</h1>
          <p className="paragraph-2 mb-s">
            This placeholder page will later let candidates review and edit their personal information, experience, and
            location preferences.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

