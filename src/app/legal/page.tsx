import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import StaticHero from '@/components/common/StaticHero/StaticHero'

export default function LegalPage() {
  return (
    <div className="site">
      <Header />
      <main className="main">
        <StaticHero
          eyebrow="Legal"
          title="Legal information"
          subtitle="This page outlines key notices and terms for using Orange Talents content and services. If you have questions, contact us anytime."
          backgroundImage="/images/updated_images/1.partnership.jpg"
        />
        <section className="container block-container mb-l">
          <h2 className="headline-3 mb-s">General notice</h2>
          <p className="paragraph-2 mb-s">
            Orange Talents provides recruitment and talent advisory services. Information on this website is for general
            reference and may be updated from time to time.
          </p>
          <h2 className="headline-3 mb-s">Intellectual property</h2>
          <p className="paragraph-2 mb-s">
            Text, visuals, and materials on this site belong to Orange Talents unless otherwise stated. Please do not
            reproduce or distribute content without permission.
          </p>
          <h2 className="headline-3 mb-s">Contact</h2>
          <p className="paragraph-2">
            For legal inquiries, email{' '}
            <a href="mailto:legal@orangetalents.com" style={{ fontWeight: 700 }}>
              legal@orangetalents.com
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

