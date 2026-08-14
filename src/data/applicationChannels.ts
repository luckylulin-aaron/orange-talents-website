export type ApplicationChannel = {
  id: 'full-time-internship' | 'freelance-recruiter'
  titleZh: string
  titleEn: string
  description: string
  actionZh: string
  actionEn: string
  href: string
  qrImage: string
  variant: 'purple' | 'orange'
  qrAlt: string
  linkAriaLabel: string
}

export const FULL_TIME_INTERNSHIP_APPLICATION_URL =
  'https://www.feishu.cn/share/base/form/shrcnhhusLCkHsmkbD4SmAgk3ZW?share_link_type=qrcode&ccm_open_type=form_qrcode'

export const FREELANCE_RECRUITER_APPLICATION_URL =
  'https://www.feishu.cn/share/base/form/shrcn2X7qFe4m9TLef6TT07iMeh?share_link_type=qrcode&ccm_open_type=form_qrcode'

export const applicationChannels: ApplicationChannel[] = [
  {
    id: 'full-time-internship',
    titleZh: '正式员工 / 实习生',
    titleEn: 'Full-time / Internship',
    description:
      'Explore current opportunities and submit your application through our official recruitment form.',
    actionZh: '查看职位并投递',
    actionEn: 'View Jobs & Apply',
    href: FULL_TIME_INTERNSHIP_APPLICATION_URL,
    qrImage: '/images/application-channels/full-time-internship-qr.png',
    variant: 'purple',
    qrAlt: 'QR code for the Full-time and Internship application form',
    linkAriaLabel: 'Open the Full-time and Internship application form in a new tab',
  },
  {
    id: 'freelance-recruiter',
    titleZh: '自由职业猎头',
    titleEn: 'Freelance Recruiter',
    description: 'Work with Orange Talents as an independent recruiting partner.',
    actionZh: '申请成为合作猎头',
    actionEn: 'Apply to Become a Partner Recruiter',
    href: FREELANCE_RECRUITER_APPLICATION_URL,
    qrImage: '/images/application-channels/freelance-recruiter-qr.png',
    variant: 'orange',
    qrAlt: 'QR code for the Freelance Recruiter application form',
    linkAriaLabel: 'Open the Freelance Recruiter application form in a new tab',
  },
]
