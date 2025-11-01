import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  TransferState
} from '@angular/core';
import {provideRouter, withInMemoryScrolling, withPreloading, PreloadAllModules} from '@angular/router';
import {HttpClient, provideHttpClient, withFetch, withInterceptors, withXsrfConfiguration} from '@angular/common/http';
import {provideTranslateService, TranslateLoader} from '@ngx-translate/core';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay, withNoHttpTransferCache} from '@angular/platform-browser';
import {translateBrowserLoaderFactory} from './shared/translate-browser.loader';
import {AuthUserInterceptor} from './auth-interceptor/auth-user.interceptor';
import {CsrfInterceptor} from './auth-interceptor/csrf.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Angular 20 Error Handling
    provideBrowserGlobalErrorListeners(),

    // Angular 20 Zoneless Change Detection
    provideZonelessChangeDetection(),

    // Router with enhanced features
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withPreloading(PreloadAllModules)
    ),

    // Client Hydration with enhanced features
    provideClientHydration(
      withEventReplay(),
      withNoHttpTransferCache()
    ),

    // HTTP Client with enhanced features
    provideHttpClient(
      withFetch(),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN'
      }),
      withInterceptors([AuthUserInterceptor, CsrfInterceptor])
    ),

    // Translation Service
    provideTranslateService({
      fallbackLang: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: translateBrowserLoaderFactory,
        deps: [HttpClient, TransferState]
      }
    })
  ]
};
