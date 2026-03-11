import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import StaticHero from '@/components/common/StaticHero/StaticHero'

export default function PrivacyCenterPage() {
  return (
    <div className="site">
      <Header />
      <main className="main">
        <StaticHero
          eyebrow="Privacy"
          title="Privacy center"
          subtitle="We treat personal data with care. This page explains how Orange Talents collects and uses information across recruiting and advisory work."
          backgroundImage="/images/updated_images/2.chatting.jpg"
        />
        <section className="container block-container mb-l">
          <h2 className="headline-3 mb-s">How we use information</h2>
          <p className="paragraph-2 mb-s">
            We use information you share to understand hiring needs, evaluate candidate fit, and communicate with you
            during recruitment or advisory projects. We aim to collect only what is necessary for the purpose.
          </p>
          <h2 className="headline-3 mb-s">Your choices</h2>
          <p className="paragraph-2 mb-s">
            You can request access, corrections, or deletion of your data where applicable. You may also ask us to stop
            contacting you at any time.
          </p>
          <h2 className="headline-3 mb-s">Related policy</h2>
          <p className="paragraph-2">
            Read our candidate privacy policy at{' '}
            <a href="/candidate-privacy-policy" style={{ fontWeight: 700 }}>
              /candidate-privacy-policy
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

