// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  name: 'bnpbd',
  domain: 'bnpbd.org',
  //
  // apiBaseLink: 'https://api-v2.bnpbd.org',
  // ftpBaseLink: 'https://api.bnpbd.org',

  apiBaseLink: 'http://localhost:1601',
  ftpBaseLink: 'http://localhost:1601',
  // apiBaseLink: 'https://ict-bnp-78-api.bnpbangladesh.org',
  // ftpBaseLink: 'https://ict-bnp-78-cdn.bnpbangladesh.org',
  // apiBaseLink: 'https://api-v2.bnpbd.org',
  // ftpBaseLink: 'https://api.bnpbd.org',

  sslIpnUrl: 'http://localhost:3008/api/payment/ssl-ipn',
  appBaseUrl: '/account',
  userBaseUrl: 'account',
  userProfileUrl: '/account',
  userLoginUrl: 'login',
  storageSecret: 'SOFT_2021_IT_1998',
  adminTokenSecret: 'SOFT_ADMIN_1995_&&_SOJOL_dEv',
  userTokenSecret: 'SOFT_ADMIN_1996_&&_SOBUR_dEv',
  apiTokenSecret: 'SOFT_API_1998_&&_SAZIB_dEv',
  VERSION: 1
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

