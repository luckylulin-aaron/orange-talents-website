import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from './Employers.module.scss'

export default function EmployersPage() {
  return (
    <div className="site">
      <Header />

      <main className="main">
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Employers</p>
            <h1 className={styles.title}>Partners for China-linked &amp; go-global hiring</h1>
            <p className={styles.subtitle}>
              We help founders, business leaders, and HR teams hire cross-border talent with clarity and confidence –
              from first briefing to offer and onboarding.
            </p>
            <div className={styles.heroActions}>
              <a href="#employer-brief" className={styles.primaryCta}>
                Talk to us about a role
              </a>
              <a href="#how-we-work" className={styles.secondaryCta}>
                See how we work →
              </a>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>What we do for employers</h2>
            <div className={styles.servicesGrid}>
              <article className={styles.serviceCard}>
                <p className={styles.serviceTitle}>Executive &amp; senior hiring</p>
                <p className={styles.serviceText}>
                  Targeted searches for critical leadership and senior specialist roles, with structured market mapping
                  and transparent shortlists.
                </p>
              </article>
              <article className={styles.serviceCard}>
                <p className={styles.serviceTitle}>Market &amp; talent mapping</p>
                <p className={styles.serviceText}>
                  Understand which profiles exist in a given city or region, typical compensation ranges, and how your
                  brand is perceived.
                </p>
              </article>
              <article className={styles.serviceCard}>
                <p className={styles.serviceTitle}>China-linked &amp; go-global advisory</p>
                <p className={styles.serviceText}>
                  Advice on structuring cross-border teams, reporting lines, and hiring narratives that resonate with
                  candidates in and outside China.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="how-we-work" className={styles.section}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>How we work together</h2>
            <div className={styles.stepsGrid}>
              <article className={styles.stepCard}>
                <p className={styles.stepNumber}>Step 1</p>
                <p className={styles.stepTitle}>Briefing</p>
                <p className={styles.stepText}>
                  We clarify context, success metrics, team set-up, and non-negotiables for the role.
                </p>
              </article>
              <article className={styles.stepCard}>
                <p className={styles.stepNumber}>Step 2</p>
                <p className={styles.stepTitle}>Search &amp; outreach</p>
                <p className={styles.stepText}>
                  We run structured market mapping and direct outreach to relevant profiles in target locations.
                </p>
              </article>
              <article className={styles.stepCard}>
                <p className={styles.stepNumber}>Step 3</p>
                <p className={styles.stepTitle}>Shortlist &amp; feedback</p>
                <p className={styles.stepText}>
                  You receive calibrated shortlists and honest market feedback from our candidate conversations.
                </p>
              </article>
              <article className={styles.stepCard}>
                <p className={styles.stepNumber}>Step 4</p>
                <p className={styles.stepTitle}>Offer &amp; onboarding support</p>
                <p className={styles.stepText}>
                  We help both sides align on expectations around offer, relocation, and first months in the role.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.casesSection}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>Selected examples</h2>
            <div className={styles.caseList}>
              <article className={styles.caseCard}>
                <p className={styles.caseTitle}>Tech scale-up hiring its first China-based leader</p>
                <p className={styles.caseText}>
                  Helped a global SaaS company design and fill a Head of China role, balancing HQ expectations with
                  local market realities in under three months.
                </p>
              </article>
              <article className={styles.caseCard}>
                <p className={styles.caseTitle}>Cross-border team build for a manufacturing group</p>
                <p className={styles.caseText}>
                  Supported a manufacturing group with China-linked operations to build a bilingual strategy and
                  operations team across two cities.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="employer-brief" className={styles.contactSection}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>Tell us about your hiring need</h2>
            <div className={styles.contactLayout}>
              <div>
                <p className={styles.contactIntro}>
                  Share a few details about the role, timeline, and location you have in mind. We will review your brief
                  and respond with questions or a suggested next step.
                </p>
                <p className={styles.contactIntro}>
                  If you prefer, you can also email us directly at{' '}
                  <a href="mailto:employers@orangetalents.com" className={styles.highlight}>
                    employers@orangetalents.com
                  </a>
                  .
                </p>
              </div>

              <form
                className={styles.form}
                action="mailto:employers@orangetalents.com"
                method="post"
                encType="text/plain"
              >
                <div>
                  <label className={styles.label} htmlFor="company">
                    Company name
                  </label>
                  <input id="company" name="Company" className={styles.input} type="text" />
                </div>
                <div>
                  <label className={styles.label} htmlFor="contact">
                    Contact name
                  </label>
                  <input id="contact" name="Contact" className={styles.input} type="text" />
                </div>

                <div>
                  <label className={styles.label} htmlFor="email">
                    Work email
                  </label>
                  <input id="email" name="Email" className={styles.input} type="email" />
                </div>
                <div>
                  <label className={styles.label} htmlFor="location">
                    City / market
                  </label>
                  <input id="location" name="Location" className={styles.input} type="text" />
                </div>

                <div className={styles.formRowFull}>
                  <label className={styles.label} htmlFor="role">
                    Role &amp; hiring need
                  </label>
                  <textarea
                    id="role"
                    name="Role"
                    className={styles.textarea}
                    placeholder="Share role title, key responsibilities, and ideal start timeline."
                  />
                </div>

                <div className={`${styles.formRowFull} ${styles.submitRow}`}>
                  <button type="submit" className={styles.submitButton}>
                    Send brief via email
                  </button>
                </div>

                <p className={`${styles.formRowFull} ${styles.note}`}>
                  Submitting will open your email client with the details pre-filled. You can review and send when
                  ready.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

