import {Routes} from '@angular/router';
import {userAuthStateGuard} from './auth-guard/user-auth-state.guard';
import {userAuthGuard} from './auth-guard/user-auth.guard';

export const routes: Routes = [ {
  path: '',
  loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
},
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/user/login/login.module').then((m) => m.LoginModule),
    canActivate: [userAuthStateGuard],
  },
  {
    path: 'registration',
    loadChildren: () =>
      import('./pages/user/registration/registration.module').then(
        (m) => m.RegistrationModule
      ),
    canActivate: [userAuthStateGuard],
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/user/reset-password/reset-password.module').then(m => m.ResetPasswordModule),
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/user/account/account.module').then(m => m.AccountModule),
    canActivate: [userAuthGuard],
  },
  {
    path: 'video-gallery',
    loadChildren: () => import('./pages/video-gallery/video-gallery.module').then(m => m.VideoGalleryModule),
  },
  {
    path: 'get-in-touch',
    loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule),
  },
  {
    path: 'certificate-verification',
    loadChildren: () => import('./pages/certificate-verification/certificate-verification.module').then(m => m.CertificateVerificationModule),
  },
  {
    path: 'coming-soon',
    loadChildren: () => import('./pages/coming-soon/coming-soon.module').then(m => m.ComingSoonModule),
  },
  {
    path: 'all-news',
    loadChildren: () => import('./pages/all-news/all-news.module').then(m => m.AllNewsModule),
  },
  {
    path: 'programs&pressReleases',
    loadChildren: () => import('./pages/program/program.module').then(m => m.ProgramModule),
  },

  {
    path: 'notice',
    loadChildren: () => import('./pages/all-notice/all-notice.module').then(m => m.AllNoticeModule),
  },

  {
    path: 'reports',
    loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsModule),
  },
  {
    path: 'press-conference',
    loadChildren: () => import('./pages/conference/conference.module').then(m => m.ConferenceModule),
  },
  {
    path: 'photo-gallery',
    loadChildren: () => import('./pages/gallery/gallery.module').then(m => m.GalleryModule),
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/additional-page-view/additional-page-view.module').then(m => m.AdditionalPageViewModule),
  },
  {
    path: 'about-us',
    loadChildren: () => import('./pages/porichito/porichito.module').then(m => m.PorichitoModule),
  },
  // {
  //   path: 'porichiti1',
  //   loadChildren: () => import('./pages/porichito/porichito.module').then(m => m.PorichitoModule),
  // },
  {
    path: 'article',
    loadChildren: () => import('./pages/pathagar/pathagar.module').then(m => m.PathagarModule),
  },
  {
    path: 'songothon',
    loadChildren: () => import('./pages/songothon/songothon.module').then(m => m.SongothonModule),
  },
  {
    path: 'sohojogi-songothon',
    loadChildren: () => import('./pages/sohojogi-songothon/sohojogi-songothon.module').then(m => m.SohojogiSongothonModule),
  },
  {
    path: 'ongo-songothon',
    loadChildren: () => import('./pages/ongo-songothon/ongo-songothon.module').then(m => m.OngoSongothonModule),
  },
  {
    path: 'national-standing-committee',
    loadChildren: () => import('./pages/jatio-sthai-comitte/jatio-sthai-comitte.module').then(m => m.JatioSthaiComitteModule),
  },
  {
    path: 'executive-committee',
    loadChildren: () => import('./pages/executive-committe/executive-committe.module').then(m => m.ExecutiveCommitteModule),
  },
  {
    path: 'jatio-nirbahi-comitte',
    loadChildren: () => import('./pages/jatio-nirbahi-comitte/jatio-nirbahi-comitte.module').then(m => m.JatioNirbahiComitteModule),
  },
  {
    path: 'upodeshta-counsil',
    loadChildren: () => import('./pages/upodeshta-counsil/upodeshta-counsil.module').then(m => m.UpodeshtaCounsilModule),
  },
  {
    path: 'sub-article',
    loadChildren: () => import('./pages/sub-pathagar/sub-pathagar.module').then(m => m.SubPathagarModule),
  },
  {
    path: 'article-details',
    loadChildren: () => import('./pages/pathagar-detail/pathagar-detail.module').then(m => m.PathagarDetailModule),
  },
  {
    path:"leader-details",
    loadChildren: () => import('./pages/leaders-details/leaders-details.module').then(m => m.LeadersDetailsModule)
  },
  {
    path:"our-leaders",
    loadChildren: () => import('./pages/our-leaders/our-leaders.module').then(m =>m.OurLeadersModule)
  },
  {
    path:"constitution",
    loadChildren: () => import('./pages/constitution/constitution.module').then(m => m.ConstitutionModule)
  },
  {
    path:"vision-2030",
    loadChildren: () => import('./pages/vision-page/vision-page.module').then(m => m.VisionPageModule)
  },
  {
    path:"19-points",
    loadChildren: () => import('./pages/nineteen-dofa/nineteen-dofa.module').then(m => m.NineteenDofaModule)
  },
  {
    path:"10-points",
    loadChildren: () => import('./pages/teen-dofa/teen-dofa.module').then(m => m.TeenDofaModule)
  },
  {
    path:"31-points",
    loadChildren: () => import('./pages/thirty-one-dofa/thirty-one-dofa.module').then(m => m.ThirtyOneDofaModule)
  },
  {
    path:"presidency-of-ziaur-rahman",
    loadChildren: () => import('./pages/presidency/presidency.module').then(m => m.PresidencyModule)
  },
  {
    path:"presidency-details",
    loadChildren: () => import('./pages/presidency-details/presidency-details.module').then(m => m.PresidencyDetailsModule)
  },
  {
    path:"premiership-begum-khaleda-zia1",
    loadChildren: () => import('./pages/premiership-brgum-khalada-zia1/premiership-brgum-khalada-zia1.module').then(m => m.PremiershipBrgumKhaladaZia1Module)
  }
  ,
  {
    path:"premiership-begum-khaleda-zia2",
    loadChildren: () => import('./pages/premiership-brgum-khalada-zia2/premiership-brgum-khalada-zia2.module').then(m => m.PremiershipBrgumKhaladaZia2Module)
  },
  {
    path: 'membership-fee',
    loadChildren: () => import('./pages/membership-fee/membership-fee.module').then(m => m.MembershipFeeModule),
    // canActivate: [UserAuthGuard],
  },
  {
    path: 'donate',
    loadChildren: () => import('./pages/donate/donate.module').then(m => m.DonateModule),
  },
  {
    path: 'donate-payment',
    loadComponent: () => import('./pages/donate-payment/donate-payment.component').then(m => m.DonatePaymentComponent),
  },
  {
    path:"premiership-begum-khaleda-zia3",
    loadChildren: () => import('./pages/premiership-brgum-khalada-zia3/premiership-brgum-khalada-zia3.module').then(m => m.PremiershipBrgumKhaladaZia3Module)
  },
  {
    path:"slogan",
    loadChildren: () => import('./pages/motto/motto.module').then(m => m.MottoModule)
  },
  {
    path:"founding-historic",
    loadChildren: () => import('./pages/founding-historic/founding-historic.module').then(m => m.FoundingHistoricModule)
  },
  {
    path:"bnpbd",
    loadChildren: () => import('./pages/visions-resources/visions-resources.module').then(m => m.VisionsResourcesModule)
  } ,
  {
    path:"payment-status",
    loadChildren: () => import('./pages/payment/payment.module').then(m => m.PaymentModule)
  },
  {
    path:"primary-member-fee",
    loadChildren: () => import('./pages/general-member-fee/general-member-fee.module').then(m => m.GeneralMemberFeeModule)
  },
  {
    path: 'membership-registration',
    loadChildren: () => import('./pages/user/member-registration-form/member-registration-form.module').then(m => m.MemberRegistrationFormModule),
  },
];
