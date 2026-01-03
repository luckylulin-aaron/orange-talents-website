'use client'

import Link from '@/components/common/NoLink'
import styles from './Footer.module.scss'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer id="js-footer" className={styles.container}>
      <div className={`container p-relative color-white ${styles.content}`}>
        <div className={`is-hidden-mobile ${styles.scrollButton}`}>
          <button aria-label="Scroll to top" className={styles.scrollBtn} onClick={scrollToTop}>
            ↑
          </button>
        </div>

        <div className={styles.note}>
          <h3>Orange Talents</h3>
          <p>
            We partner with global enterprises and remarkable candidates who share the same values. Reach out any time—our
            team is here to help you go global with confidence.
          </p>
        </div>

        <div className={styles.legalRow}>
          <Link className={styles.legalLink} href="/">
            © 2025 Orange Talents.
          </Link>
          <Link className={styles.legalLink} href="https://www.spotify.com/legal/">
            Legal
          </Link>
          <Link className={styles.legalLink} href="https://www.spotify.com/privacy/">
            Privacy center
          </Link>
          <Link className={styles.legalLink} href="/candidate-privacy-policy">
            Privacy policy
          </Link>
          <Link
            className={styles.legalLink}
            href="https://www.spotify.com/legal/privacy-policy/"
          >
            About ads
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer




