'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
  const [isAccountOpen, setIsAccountOpen] = useState(false)

  const [user, setUser] = useState<{ id: number; email: string; name: string | null } | null>(null)
  const isLoggedIn = Boolean(user)

  const handleToggleMenu = () => setIsMenuOpen((previous) => !previous)
  const handleCloseMenu = () => setIsMenuOpen(false)
  const handleToggleAccount = () => setIsAccountOpen((previous) => !previous)
  const handleCloseAccount = () => setIsAccountOpen(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null)
    setUser(null)
    handleCloseAccount()
  }

  const renderBrand = () => (
    <Link href="/" className={styles.brand} aria-label="Orange Talents home">
      <span className={styles.logo} aria-hidden>
        <img src="/images/updated_images/orangetalents_logo.jpg" alt="" className={styles.logoImage} />
      </span>
      <span className={styles.brandText}>
        <span className={styles.brandName}>Orange Talents</span>
        <span className={styles.brandDivider} aria-hidden />
        <span className={styles.brandTagline}>Recruiting</span>
      </span>
    </Link>
  )

  const renderAccountMenu = () => (
    <div className={styles.accountMenu}>
      <button
        type="button"
        className={styles.accountButton}
        aria-haspopup="menu"
        aria-expanded={isAccountOpen}
        onClick={handleToggleAccount}
      >
        <span>My Account</span>
        <ArrowIcon size={18} />
      </button>
      {isAccountOpen && (
        <div className={styles.accountDropdown} role="menu">
          {isLoggedIn ? (
            <>
              <p className={styles.accountSectionTitle}>Signed in</p>
              <p className={styles.accountLinkSecondary} style={{ paddingTop: 0 }}>
                {user?.email}
              </p>
              <Link href="/account/profile" className={styles.accountLinkPrimary} onClick={handleCloseAccount}>
                View profile
              </Link>
              <Link href="/account/applications" className={styles.accountLinkSecondary} onClick={handleCloseAccount}>
                Applications
              </Link>
              <Link href="/account/saved-jobs" className={styles.accountLinkSecondary} onClick={handleCloseAccount}>
                Saved jobs
              </Link>
              <div className={styles.accountDivider} />
              <Link href="/account/settings" className={styles.accountLinkSecondary} onClick={handleCloseAccount}>
                Account settings
              </Link>
              <button type="button" className={styles.accountLinkSecondary} onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <p className={styles.accountSectionTitle}>For candidates</p>
              <Link href="/account/sign-in" className={styles.accountLinkPrimary} onClick={handleCloseAccount}>
                Sign in
              </Link>
              <Link href="/account/sign-up" className={styles.accountLinkSecondary} onClick={handleCloseAccount}>
                Create account
              </Link>
              <div className={styles.accountDivider} />
              <p className={styles.accountSectionTitle}>Quick links</p>
              <Link href="/join-us" className={styles.accountLinkSecondary} onClick={handleCloseAccount}>
                Careers at Orange Talents
              </Link>
              <Link href="/jobs" className={styles.accountLinkSecondary} onClick={handleCloseAccount}>
                Search open roles
              </Link>
            </>
          )}
        </div>
      )}
    </div>
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

          <div className={styles.actions}>{renderAccountMenu()}</div>

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
          <div className={styles.mobileActions}>
            <Link href="/account" className={`${styles.accountButton} ${styles.mobileCta}`} onClick={handleCloseMenu}>
              <span>My Account</span>
              <ArrowIcon size={18} />
            </Link>
          </div>
        </nav>
      </div>

      {isMenuOpen && <div className={styles.backdrop} aria-hidden onClick={handleCloseMenu} />}
    </>
  )
}

export default Header

