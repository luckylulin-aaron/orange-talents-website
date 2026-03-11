import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from './Contact.module.scss'

export default function ContactPage() {
  return (
    <div className="site">
      <Header />

      <main className="main">
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Contact</p>
            <h1 className={styles.title}>Get in touch</h1>
            <p className={styles.subtitle}>
              Have a question about Orange Talents, a role, or our services? Send us a note and we&apos;ll reply soon.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.layout}>
              <div>
                <p className={styles.intro}>
                  Email works best for us. You can also reach us directly at{' '}
                  <a href="mailto:info@orangetalents.com" className={styles.highlight}>
                    info@orangetalents.com
                  </a>
                  .
                </p>
                <p className={styles.intro}>
                  If you&apos;re an employer with an active hiring need, you may prefer{' '}
                  <a href="/employers#employer-brief" className={styles.highlight}>
                    the employer brief form
                  </a>
                  .
                </p>
              </div>

              <form className={styles.form} action="mailto:info@orangetalents.com" method="post" encType="text/plain">
                <div>
                  <label className={styles.label} htmlFor="name">
                    Name
                  </label>
                  <input id="name" name="Name" className={styles.input} type="text" />
                </div>
                <div>
                  <label className={styles.label} htmlFor="email">
                    Email
                  </label>
                  <input id="email" name="Email" className={styles.input} type="email" />
                </div>

                <div className={styles.full}>
                  <label className={styles.label} htmlFor="subject">
                    Subject
                  </label>
                  <input id="subject" name="Subject" className={styles.input} type="text" placeholder="How can we help?" />
                </div>

                <div className={styles.full}>
                  <label className={styles.label} htmlFor="message">
                    Message
                  </label>
                  <textarea id="message" name="Message" className={styles.textarea} placeholder="Write your message here." />
                </div>

                <div className={styles.submitRow}>
                  <button type="submit" className={styles.submitButton}>
                    Send message
                  </button>
                </div>

                <p className={`${styles.full} ${styles.note}`}>
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

