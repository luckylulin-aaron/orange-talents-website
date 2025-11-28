'use client'

import Link from 'next/link'
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
          <a className={styles.legalLink} target="_blank" rel="noreferrer" href="https://www.spotify.com/legal/">
            Legal
          </a>
          <a className={styles.legalLink} target="_blank" rel="noreferrer" href="https://www.spotify.com/privacy/">
            Privacy center
          </a>
          <Link className={styles.legalLink} href="/candidate-privacy-policy">
            Privacy policy
          </Link>
          <a
            className={styles.legalLink}
            target="_blank"
            rel="noreferrer"
            href="https://www.spotify.com/legal/privacy-policy/"
          >
            About ads
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer




