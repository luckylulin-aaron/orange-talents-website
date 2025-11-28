'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import styles from './FeaturedJobs.module.scss'
import jobsData from '@/data/jobs.json'

const FeaturedJobs = () => {
  const [activeCard, setActiveCard] = useState(0)

  const handleCardClick = (index: number) => {
    setActiveCard(index)
  }

  return (
    <div className="container block-container mb-l mb-mobile-0">
      <section id="FeaturedJobs" className={styles.section}>
        <div className="container block-container fluidWidth mb-l mb-mobile-0">
          <section>
            <div className="container mb-l mb-mobile-s">
              <div className="row">
                <div className="col-12">
                  <h2 className="headline-1 text-center">Opportunities &amp; Insights</h2>
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
              {jobsData.featuredJobs.map((job, index) => (
                <SwiperSlide
                  key={job.id}
                  className={`w-full ${styles.swiperSlide} ${activeCard === index ? styles.active : styles.closed}`}
                >
                  <div
                    className={`rounded-24 rounded-16-mobile hover-inside ${styles.container} ${
                      activeCard === index ? styles.active : styles.closed
                    } ${job.image ? styles.imageCard : styles.white}`}
                    role="button"
                    tabIndex={0}
                    style={
                      job.image && activeCard !== index
                        ? {
                            backgroundImage: `url(${job.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center center',
                            backgroundRepeat: 'no-repeat',
                          }
                        : {}
                    }
                    onClick={() => handleCardClick(index)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleCardClick(index)
                      }
                    }}
                  >
                    <p className={`ma-0 color-black detail-2 mb-s mb-mobile-xxs ${styles.category}`}>
                      {job.category.toUpperCase()}
                    </p>
                    <p className={`ma-0 color-black headline-2 ${styles.title}`}>
                      {job.title}
                    </p>
                    <p className={`ma-0 color-black paragraph-2 ${styles.text}`}>
                      {job.description}
                    </p>
                    <div className={`mt-m mt-s mb-0-last w-fit ${styles.jobApply}`}>
                      <Link aria-label="Apply now" className={`detail-3 ${styles.link}`} href={job.link}>
                        Apply now &gt;
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        </div>
      </section>
    </div>
  )
}

export default FeaturedJobs




