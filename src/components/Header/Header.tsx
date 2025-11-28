'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ArrowIcon from '@/components/common/ArrowIcon'
import styles from './Header.module.scss'

type NavItem = {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: 'Join Us', href: '/join-us' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Insights', href: '/insights' },
  { label: 'Employers', href: '/employers' },
]

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleToggleMenu = () => setIsMenuOpen((previous) => !previous)
  const handleCloseMenu = () => setIsMenuOpen(false)

  const renderBrand = () => (
    <Link href="/" className={styles.brand} aria-label="Orange Talents home">
      <span className={styles.logo} aria-hidden>
        <Image
          src="/images/updated_images/orangetalents_logo.jpg"
          alt="Orange Talents logo"
          fill
          sizes="40px"
          className={styles.logoImage}
          priority
        />
      </span>
      <span className={styles.brandText}>
        <span className={styles.brandName}>Orange Talents</span>
        <span className={styles.brandDivider} aria-hidden />
        <span className={styles.brandTagline}>Recruiting</span>
      </span>
    </Link>
  )

  const renderAccountButton = () => (
    <Link href="/account" className={styles.accountButton}>
      <span>My Account</span>
      <ArrowIcon size={18} />
    </Link>
  )

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {renderBrand()}

          <nav className={styles.navDesktop} aria-label="Primary navigation">
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={styles.navLink}>
                    <span className={styles.navLabel}>{item.label}</span>
                    <ArrowIcon size={16} className={styles.navIcon} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>{renderAccountButton()}</div>

          <button
            type="button"
            className={styles.menuButton}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={handleToggleMenu}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`${styles.mobileSheet} ${isMenuOpen ? styles.mobileSheetVisible : ''}`} role="dialog" aria-modal="true">
        <div className={styles.mobileHeader}>
          {renderBrand()}
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close menu"
            onClick={handleCloseMenu}
          >
            ×
          </button>
        </div>
        <nav aria-label="Mobile navigation" className={styles.mobileNav}>
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className={styles.mobileLink} onClick={handleCloseMenu}>
              <span>{item.label}</span>
              <ArrowIcon size={18} />
            </Link>
          ))}
          <div className={styles.mobileActions}>{renderAccountButton()}</div>
        </nav>
      </div>

      {isMenuOpen && <div className={styles.backdrop} aria-hidden onClick={handleCloseMenu} />}
    </>
  )
}

export default Header

