'use client'

import { useState } from 'react'
import Link from '@/components/common/NoLink'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import styles from './FreshContent.module.scss'
import jobsData from '@/data/jobs.json'

const FreshContent = () => {
  const [activeCard, setActiveCard] = useState(0)

  return (
    <div className="container block-container mb-0 mb-mobile-0">
      <section id="FreshContent" className={styles.section}>
        <div className="container block-container fluidWidth mb-xxxl mb-mobile-xxl">
          <section>
            <div className="container mb-l mb-mobile-s">
              <div className="row">
                <div className="col-12">
                  <h2 className="headline-1 text-center">Fresh Content</h2>
                </div>
              </div>
            </div>

            <Swiper
              className={styles.swiper}
              slidesPerView={'auto'}
              spaceBetween={8}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 'auto',
                },
              }}
            >
              {jobsData.podcasts.map((podcast, index) => (
                <SwiperSlide
                  key={podcast.id}
                  className={`${styles.swiperSlide} ${activeCard === index ? styles.active : styles.closed}`}
                >
                  {index === 0 ? (
                    <Link
                      className={`rounded-24 rounded-16-mobile hover-inside ${styles.container} ${styles.active} ${styles.white}`}
                      href={podcast.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className={`ma-0 color-black headline-2 ${styles.title}`}>
                        {podcast.title}
                      </p>
                      <p className={`ma-0 color-black paragraph-2 ${styles.text}`}></p>
                      <div className={styles.audioWaves}>
                        <span className={styles.wave}></span>
                        <span className={styles.wave}></span>
                        <span className={styles.wave}></span>
                        <span className={styles.wave}></span>
                        <span className={styles.wave}></span>
                      </div>
                      <div className={styles.bottomLink}>
                        <p className={`body-1 ma-0 no-underline ${styles.linkText}`}>
                          Listen
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <div
                      className={`rounded-24 rounded-16-mobile hover-inside ${styles.container} ${styles.closed} ${styles.violet}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveCard(index)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setActiveCard(index)
                        }
                      }}
                    >
                      <p className={`ma-0 color-black headline-2 ${styles.title}`}>
                        {podcast.title}
                      </p>
                      <p className={`ma-0 color-black paragraph-2 ${styles.text}`}></p>
                      <div className={styles.bottomLink}>
                        <p className={`body-1 ma-0 no-underline ${styles.linkText}`}>
                          Listen
                        </p>
                      </div>
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        </div>
      </section>
    </div>
  )
}

export default FreshContent




