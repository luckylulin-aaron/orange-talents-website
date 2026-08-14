import Image from 'next/image'

import { applicationChannels } from '@/data/applicationChannels'
import styles from './ApplicationChannels.module.scss'

export default function ApplicationChannels() {
  return (
    <section
      id="application-channels"
      className={styles.section}
      aria-labelledby="application-channels-title"
    >
      <div className={styles.inner}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>Application channels</p>
          <h2 id="application-channels-title" className={styles.title}>
            Apply to Orange Talents
          </h2>
          <p className={styles.description}>
            Choose the channel that best matches how you would like to work with us.
          </p>
          <p className={styles.descriptionZh} lang="zh-CN">
            请选择最符合您合作方式的申请渠道。
          </p>
        </div>

        <div className={styles.channelGrid}>
          {applicationChannels.map((channel) => (
            <article
              key={channel.id}
              className={`${styles.channelPanel} ${styles[channel.variant]}`}
            >
              <div className={styles.channelCopy}>
                <p className={styles.channelTag} lang="zh-CN">
                  {channel.titleZh}
                </p>
                <h3 className={styles.channelTitle}>{channel.titleEn}</h3>
                <p className={styles.channelDescription}>{channel.description}</p>
              </div>

              <div className={styles.channelAction}>
                <a
                  href={channel.href}
                  className={styles.qrLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={channel.linkAriaLabel}
                >
                  <Image
                    src={channel.qrImage}
                    alt={channel.qrAlt}
                    width={640}
                    height={640}
                    className={styles.qrImage}
                    unoptimized
                  />
                </a>

                <p className={styles.scanHint}>
                  <span lang="zh-CN">扫码或直接打开表单</span>
                  <span>Scan with your phone or open the form directly.</span>
                </p>

                <a
                  href={channel.href}
                  className={styles.channelCta}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={channel.linkAriaLabel}
                >
                  <span lang="zh-CN">{channel.actionZh}</span>
                  <span className={styles.channelCtaEn}>
                    {channel.actionEn}
                    <span aria-hidden="true"> →</span>
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
