import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import StaticHero from '@/components/common/StaticHero/StaticHero'

export default function AboutAdsPage() {
  return (
    <div className="site">
      <Header />
      <main className="main">
        <StaticHero
          eyebrow="About ads"
          title="Advertising & tracking"
          subtitle="We aim for a clear and respectful experience. This page explains how Orange Talents may use advertising and measurement tools."
          backgroundImage="/images/updated_images/2.chatting.jpg"
        />
        <section className="container block-container mb-l">
          <h2 className="headline-3 mb-s">What this means</h2>
          <p className="paragraph-2 mb-s">
            If we run campaigns, we may use basic measurement tools to understand what content is helpful and how people
            find us. We do not sell personal data.
          </p>
          <h2 className="headline-3 mb-s">Your controls</h2>
          <p className="paragraph-2 mb-s">
            You can control cookies and tracking preferences via your browser settings. Where required, we will provide
            consent options.
          </p>
          <h2 className="headline-3 mb-s">Contact</h2>
          <p className="paragraph-2">
            Questions about tracking or ads? Email{' '}
            <a href="mailto:privacy@orangetalents.com" style={{ fontWeight: 700 }}>
              privacy@orangetalents.com
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

