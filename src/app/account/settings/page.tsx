import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

export default function AccountSettingsPage() {
  return (
    <div className="site">
      <Header />
      <main className="main">
        <section className="container block-container mb-l">
          <h1 className="headline-1 mb-m">Account settings</h1>
          <p className="paragraph-2 mb-s">
            In the future, this page will provide controls for managing sign-in methods, notifications, and language or
            region preferences.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

