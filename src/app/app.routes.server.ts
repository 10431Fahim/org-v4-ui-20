import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Static routes that can be prerendered
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'registration',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'reset-password',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'account',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'video-gallery',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'get-in-touch',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'certificate-verification',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'coming-soon',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'all-news',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'programs&pressReleases',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'notice',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'reports',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'press-conference',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'photo-gallery',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'pages',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'about-us',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'article',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'songothon',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'sohojogi-songothon',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'ongo-songothon',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'national-standing-committee',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'executive-committee',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'jatio-nirbahi-comitte',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'upodeshta-counsil',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'sub-article',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'article-details',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'leader-details',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'our-leaders',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'constitution',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'vision-2030',
    renderMode: RenderMode.Prerender
  },
  {
    path: '19-points',
    renderMode: RenderMode.Prerender
  },
  {
    path: '10-points',
    renderMode: RenderMode.Prerender
  },
  {
    path: '31-points',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'presidency-of-ziaur-rahman',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'presidency-details',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'premiership-begum-khaleda-zia1',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'premiership-begum-khaleda-zia2',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'membership-fee',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'donate',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'donate-payment',
    renderMode: RenderMode.Server
  },
  {
    path: 'premiership-begum-khaleda-zia3',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'slogan',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'founding-historic',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'bnpbd',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'payment-status',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'primary-member-fee',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'membership-registration',
    renderMode: RenderMode.Prerender
  },
  // Dynamic routes that should be server-side rendered instead of prerendered
  {
    path: 'video-details/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'press-conference/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'login/:type',
    renderMode: RenderMode.Server
  },
  {
    path: 'registration/:type',
    renderMode: RenderMode.Server
  },
  {
    path: 'all-news/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'programs&pressReleases/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'notice/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'reports/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'press-conference/press-conference/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'pages/:pageSlug',
    renderMode: RenderMode.Server
  },
  {
    path: 'sub-article/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'article-details/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'leader-details/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'bnpbd/story-details/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'bnpbd/press-releases-details/:id',
    renderMode: RenderMode.Server
  },
  // Additional child routes
  {
    path: 'all-videos',
    renderMode: RenderMode.Server
  },
  {
    path: 'account/basic-info',
    renderMode: RenderMode.Server
  },
  {
    path: 'account/transaction',
    renderMode: RenderMode.Server
  },
  {
    path: 'account/change-password',
    renderMode: RenderMode.Server
  },
  {
    path: 'payment-status/success',
    renderMode: RenderMode.Server
  },
  {
    path: 'payment-status/cancel',
    renderMode: RenderMode.Server
  },
  {
    path: 'payment-status/fail',
    renderMode: RenderMode.Server
  },
  {
    path: 'payment-status/payment-nagad',
    renderMode: RenderMode.Server
  },
  {
    path: 'payment-status/check-bkash-payment',
    renderMode: RenderMode.Server
  }
];
