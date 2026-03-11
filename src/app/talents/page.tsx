import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from './Talents.module.scss'

export default function TalentsPage() {
  return (
    <div className="site">
      <Header />

      <main className="main">
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Talent Search</p>
            <h1 className={styles.title}>Find the right talent, faster</h1>
            <p className={styles.subtitle}>
              Orange Talents supports founders and HR teams with China-linked and go-global hiring. Share your hiring
              brief and we&apos;ll respond with a clear next step.
            </p>
            <div className={styles.heroActions}>
              <a href="#talent-brief" className={styles.primaryCta}>
                Share a hiring need
              </a>
              <a href="/employers" className={styles.secondaryCta}>
                For employers &amp; services →
              </a>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>What we can support</h2>
            <div className={styles.servicesGrid}>
              <article className={styles.serviceCard}>
                <p className={styles.serviceTitle}>Targeted sourcing</p>
                <p className={styles.serviceText}>
                  Structured mapping and outreach to reach relevant profiles in your target cities and industries.
                </p>
              </article>
              <article className={styles.serviceCard}>
                <p className={styles.serviceTitle}>Shortlists with context</p>
                <p className={styles.serviceText}>
                  Calibrated candidate summaries that focus on values, motivation, and cross-border collaboration.
                </p>
              </article>
              <article className={styles.serviceCard}>
                <p className={styles.serviceTitle}>Cross-border advisory</p>
                <p className={styles.serviceText}>
                  Guidance on role design, reporting lines, and narratives that resonate in China-linked markets.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>Our simple process</h2>
            <div className={styles.stepsGrid}>
              <article className={styles.stepCard}>
                <p className={styles.stepNumber}>Step 1</p>
                <p className={styles.stepTitle}>Briefing</p>
                <p className={styles.stepText}>We clarify role scope, must-haves, timeline, and hiring context.</p>
              </article>
              <article className={styles.stepCard}>
                <p className={styles.stepNumber}>Step 2</p>
                <p className={styles.stepTitle}>Mapping</p>
                <p className={styles.stepText}>We identify target talent pools and launch focused outreach.</p>
              </article>
              <article className={styles.stepCard}>
                <p className={styles.stepNumber}>Step 3</p>
                <p className={styles.stepTitle}>Shortlist</p>
                <p className={styles.stepText}>You receive a shortlist with honest feedback from conversations.</p>
              </article>
              <article className={styles.stepCard}>
                <p className={styles.stepNumber}>Step 4</p>
                <p className={styles.stepTitle}>Offer support</p>
                <p className={styles.stepText}>We align both sides and support decisions through the offer stage.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="talent-brief" className={styles.contactSection}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>Share your hiring brief</h2>
            <div className={styles.contactLayout}>
              <div>
                <p className={styles.contactIntro}>
                  Tell us what kind of talent you are looking for. Submitting the form will open your email client with
                  the details pre-filled, so you can review and send when ready.
                </p>
                <p className={styles.contactIntro}>
                  Prefer email? Reach us at{' '}
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
                  <label className={styles.label} htmlFor="market">
                    City / market
                  </label>
                  <input id="market" name="Market" className={styles.input} type="text" placeholder="Shenzhen or Remote" />
                </div>

                <div className={styles.formRowFull}>
                  <label className={styles.label} htmlFor="role">
                    Role title / target profile
                  </label>
                  <input id="role" name="Role" className={styles.input} type="text" placeholder="e.g. Recruiting Analyst" />
                </div>

                <div className={styles.formRowFull}>
                  <label className={styles.label} htmlFor="skills">
                    Must-have skills
                  </label>
                  <textarea
                    id="skills"
                    name="Must-have skills"
                    className={styles.textarea}
                    placeholder="Share 3–5 key skills, language requirements, and relevant industries."
                  />
                </div>

                <div className={styles.formRowFull}>
                  <label className={styles.label} htmlFor="timeline">
                    Timeline / urgency
                  </label>
                  <input id="timeline" name="Timeline" className={styles.input} type="text" placeholder="e.g. ASAP / 4–6 weeks" />
                </div>

                <div className={`${styles.formRowFull} ${styles.submitRow}`}>
                  <button type="submit" className={styles.submitButton}>
                    Send brief via email
                  </button>
                </div>

                <p className={`${styles.formRowFull} ${styles.note}`}>
                  Submitting will open your email client with the details pre-filled.
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

