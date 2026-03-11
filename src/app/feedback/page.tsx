import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from './Feedback.module.scss'

export default function FeedbackPage() {
  return (
    <div className="site">
      <Header />

      <main className="main">
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Feedback</p>
            <h1 className={styles.title}>Help us improve</h1>
            <p className={styles.subtitle}>
              We&apos;d love your feedback on the website, our content, or the overall experience. Every note helps us
              make things better.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.layout}>
              <div>
                <p className={styles.intro}>
                  If you prefer email, write to{' '}
                  <a href="mailto:feedback@orangetalents.com" className={styles.highlight}>
                    feedback@orangetalents.com
                  </a>
                  .
                </p>
                <p className={styles.intro}>
                  For hiring-related requests, please use{' '}
                  <a href="/talents#talent-brief" className={styles.highlight}>
                    the talent brief form
                  </a>
                  .
                </p>
              </div>

              <form
                className={styles.form}
                action="mailto:feedback@orangetalents.com"
                method="post"
                encType="text/plain"
              >
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
                  <label className={styles.label} htmlFor="type">
                    Feedback type
                  </label>
                  <select id="type" name="Type" className={styles.select} defaultValue="Website">
                    <option value="Website">Website</option>
                    <option value="Content">Content</option>
                    <option value="Bug">Bug / Issue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className={styles.full}>
                  <label className={styles.label} htmlFor="message">
                    Details
                  </label>
                  <textarea
                    id="message"
                    name="Message"
                    className={styles.textarea}
                    placeholder="What did you like? What should we improve?"
                  />
                </div>

                <div className={styles.submitRow}>
                  <button type="submit" className={styles.submitButton}>
                    Send feedback
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

