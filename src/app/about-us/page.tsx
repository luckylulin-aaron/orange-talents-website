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
      </main>

      <Footer />
    </div>
  )
}

