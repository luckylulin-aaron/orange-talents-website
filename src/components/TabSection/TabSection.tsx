'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './TabSection.module.scss'

const TabSection = () => {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    {
      id: 0,
      label: 'Who we are',
      number: '01',
      title: 'Your Shared Growth Partner',
      description:
        'Orange Talents is a professional recruitment agency, talent advisory expert, and shared growth partner in the China-linked globe. We create economic value through connecting talents and the right opportunities with a go-global mindset.',
      link: '/stories',
      linkText: 'Read our stories >',
      image: '/images/updated_images/1.partnership.jpg',
      alt: 'Your Shared Growth Partner'
    },
    {
      id: 1,
      label: 'How we act',
      number: '02',
      title: 'Go Beyond and Dive Deep in',
      description:
        'Going beyond CV and Job Description, from Stories to Values, we connect to candidates and clients with empathy. Diving deep into development history and current layout, we catch variation trends of tech industries and talents.',
      link: '/insights',
      linkText: 'Share our insights >',
      image: '/images/470x500/WhereWeBelong-c-940.jpg',
      alt: 'Go Beyond and Dive Deep in'
    },
    {
      id: 2,
      label: 'What we provide',
      number: '03',
      title: 'Recruitment',
      description: '',
      link: '/services',
      linkText: 'Learn about our services >',
      image: '/images/470x500/HowWeAct-d-940.jpg',
      alt: 'Recruitment services'
    }
  ]

  return (
    <div className={`container block-container mb-xxxl mb-mobile-xl ${styles.tabSection}`}>
      <div className={styles.wrapper}>
        {/* 图片面板 */}
        <div className={`${styles.imagePanel} mb-mobile-4`}>
          {tabs.map((tab) => (
            <Image
              key={tab.id}
              src={tab.image}
              alt={tab.alt}
              fill
              sizes="(max-width: 768px) 100vw, 47vw"
              className={`${styles.image} ${activeTab === tab.id ? styles.active : ''}`}
              priority={tab.id === 0}
            />
          ))}
        </div>

        {/* 卡片列表 */}
        <div className={styles.cardsWrapper}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`${styles.card} ${activeTab === tab.id ? styles.expanded : ''}`}
            >
              <button
                className={`detail-2 ${styles.cardHeader}`}
                type="button"
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.label.toUpperCase()}</span>
                <span>{tab.number}</span>
              </button>
              
              <div
                className={styles.cardBody}
                style={{
                  overflow: 'hidden',
                  opacity: activeTab === tab.id ? 1 : 0,
                  height: activeTab === tab.id ? 'auto' : '0px',
                }}
              >
                <div
                  className={`mt-m ${styles.textArea}`}
                  style={{
                    opacity: activeTab === tab.id ? 1 : 0,
                    transform: activeTab === tab.id ? 'translate(0px, 0px)' : 'translate(0px, 20px)',
                  }}
                >
                  <h3 className={`headline-2 ${styles.title}`}>
                    {tab.title}
                  </h3>
                  <div className={styles.textLink}>
                    <div className="paragraph-3 ma-0">
                      {tab.description}
                    </div>
                    <Link
                      aria-label={tab.linkText}
                      className={`detail-3 ${styles.link}`}
                      href={tab.link}
                    >
                      {tab.linkText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TabSection




