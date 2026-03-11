import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import StaticHero from '@/components/common/StaticHero/StaticHero'

export default function CandidatePrivacyPolicyPage() {
  return (
    <div className="site">
      <Header />
      <main className="main">
        <StaticHero
          eyebrow="Privacy policy"
          title="Candidate privacy policy"
          subtitle="This policy explains how Orange Talents collects and uses candidate information during recruitment and talent advisory engagements."
          backgroundImage="/images/updated_images/3.chatting2.jpg"
        />
        <section className="container block-container mb-l">
          <h2 className="headline-3 mb-s">What we collect</h2>
          <p className="paragraph-2 mb-s">
            Depending on the process, we may collect contact details, work history, education, compensation expectations,
            preferred locations, and information you choose to share in interviews or documents.
          </p>
          <h2 className="headline-3 mb-s">How we use it</h2>
          <p className="paragraph-2 mb-s">
            We use candidate information to assess fit for roles, coordinate interviews, communicate updates, and provide
            relevant opportunities. We may also use it to improve our recruiting processes and market insights.
          </p>
          <h2 className="headline-3 mb-s">Updates & deletion</h2>
          <p className="paragraph-2">
            To request an update or deletion of your information, email{' '}
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

