import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from './AboutUs.module.scss'

export default function AboutUsPage() {
  return (
    <div className="site">
      <Header />

      <main className="main">
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.content}>
              <p className={styles.eyebrow}>About Us</p>
              <h1 className={styles.title}>Orange Talents in a nutshell</h1>
              <p className={styles.paragraph}>
                Orange Talents is a boutique recruitment and talent advisory firm focused on China-linked and
                global-growing companies. We connect high-calibre professionals with organizations that value
                long-term, shared growth.
              </p>
              <p className={styles.paragraph}>
                Our consultants combine deep industry knowledge with cross-border hiring experience. We work closely
                with both clients and candidates to understand their stories, values, and ambitions, and then design
                matching strategies that go beyond CVs and job descriptions.
              </p>
              <p className={styles.paragraph}>
                Whether you are expanding your team in new markets or exploring your next career move, Orange Talents
                aims to be your trusted partner on the journey.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.bodySection} aria-labelledby="about-us-more-heading">
          <div className={styles.bodyInner}>
            <h2 id="about-us-more-heading" className={styles.bodyTitle}>
              What you can expect from us
            </h2>
            <div className={styles.bodyCopy}>
              <p>
                We keep searches focused and communication honest—so clients know what the market is saying, and
                candidates understand how a role really fits their next chapter.
              </p>
              <p>
                Most of our work sits at the intersection of China-linked growth and global teams: org design questions,
                cross-border reporting, and hiring narratives that need to work in more than one market. If that sounds
                like your world, we would like to hear from you.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer variant="compact" />
    </div>
  )
}

