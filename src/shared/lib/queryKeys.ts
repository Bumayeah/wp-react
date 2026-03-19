export const queryKeys = {
  pages: (slug: string) => ['pages', slug] as const,
  siteOptions: () => ['site_options'] as const,
  trips: () => ['agenda'] as const,
  trip: (slug: string) => ['agenda', slug] as const,
  posts: () => ['posts'] as const,
  post: (slug: string) => ['posts', slug] as const,
  board: () => ['board'] as const,
  sponsors: () => ['sponsors'] as const,
  testimonials: () => ['testimonials'] as const,
  myRegistrations: () => ['mijn', 'registrations'] as const,
  myProfile: () => ['mijn', 'profile'] as const,
  myQuestions: () => ['mijn', 'questions'] as const,
} as const
