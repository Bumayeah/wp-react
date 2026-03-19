export const ROUTES = {
  home: '/',

  trips: '/reizen',
  tripDetail: (slug: string) => `/reizen/${slug}`,
  tripRegister: (slug: string) => `/reizen/${slug}/inschrijven`,

  news: '/nieuws',
  newsDetail: (slug: string) => `/nieuws/${slug}`,

  about: '/over-ons',
  board: '/bestuur',
  faq: '/faq',
  contact: '/contact',

  support: '/steunen',
  supportThankYou: '/steunen/bedankt',

  privacy: '/privacy',
  cookies: '/cookies',
  terms: '/voorwaarden',

  forgotPassword: '/account/wachtwoord-vergeten',

  my: '/mijn',
  myRegistrations: '/mijn/inschrijvingen',
  myProfile: '/mijn/profiel',
  myQuestions: '/mijn/vragen',
} as const
