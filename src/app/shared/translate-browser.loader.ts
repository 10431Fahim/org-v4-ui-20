import {Observable, of} from 'rxjs';
import {TranslateLoader} from '@ngx-translate/core';
import {makeStateKey, StateKey, TransferState} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {TRANSLATION_VERSION, TranslationData} from './translate-server.loader';

export class TranslateBrowserLoader implements TranslateLoader {
  constructor(private http: HttpClient, private transferState: TransferState) {}

  public getTranslation(lang: string): Observable<any> {
    const key: StateKey<TranslationData> = makeStateKey<TranslationData>(
      `transfer-translate-${lang}-${TRANSLATION_VERSION}`
    );

    const data = this.transferState.get<TranslationData>(key, {} as TranslationData);

    if (data) {
      if (data._version === TRANSLATION_VERSION) {
        return of(data);
      }
    }

    // fallback HTTP request
    return this.http.get(`/i18n/${lang}.json`);
  }
}

export function translateBrowserLoaderFactory(
  httpClient: HttpClient,
  transferState: TransferState
) {
  return new TranslateBrowserLoader(httpClient, transferState);
}
